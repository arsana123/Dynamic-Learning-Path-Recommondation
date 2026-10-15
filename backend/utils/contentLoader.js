import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const CONTENT_DIR = path.join(__dirname, '..', 'content');

const NUMERIC = ['rating', 'ratingsCount', 'enrolledCount', 'price', 'discountPrice'];
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function parseFrontMatter(raw, file) {
  const m = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front-matter block (--- ... ---)`);
  const meta = {};
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i === -1) return;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim();
    if (!key) return;
    meta[key] = val;
  });
  NUMERIC.forEach((k) => { if (meta[k] !== undefined) meta[k] = Number(meta[k]); });
  meta.tags = (meta.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
  meta.prerequisiteTitles = (meta.prerequisites || '').split(',').map((t) => t.trim()).filter(Boolean);
  delete meta.prerequisites;
  return { meta, body: m[2] };
}

// Deterministic shuffle (seeded by the question text) so correct answers are spread
// across A-D but the order is identical every time the seed script runs.
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleOptions(question, options, correctIndex) {
  const rand = mulberry32(hashString(question));
  const items = options.map((text, i) => ({ text, correct: i === correctIndex }));
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return { options: items.map((x) => x.text), correctAnswer: items.findIndex((x) => x.correct) };
}

function parseQuiz(text, file) {
  const questions = [];
  const blocks = text.split(/^Q:\s*/m).map((b) => b.trim()).filter(Boolean);
  blocks.forEach((block, idx) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const question = lines[0];
    const options = [];
    let answer = null;
    lines.slice(1).forEach((l) => {
      const opt = l.match(/^([A-F])\)\s*(.+)$/);
      const ans = l.match(/^ANSWER:\s*([A-F])$/i);
      if (opt) options.push(opt[2]);
      else if (ans) answer = LETTERS.indexOf(ans[1].toUpperCase());
    });
    if (options.length < 2 || answer === null || answer < 0 || answer >= options.length) {
      throw new Error(`${file}: quiz question ${idx + 1} is malformed ("${question}")`);
    }
    questions.push({ question, ...shuffleOptions(question, options, answer) });
  });
  return questions;
}

export function parseCourseFile(file) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  const { meta, body } = parseFrontMatter(raw, file);

  const quizSplit = body.split(/^# QUIZ\s*$/m);
  const lessonsPart = quizSplit[0];
  const quizPart = quizSplit[1] || '';

  const lessons = [];
  const chunks = lessonsPart.split(/^# LESSON:\s*/m).slice(1);
  chunks.forEach((chunk, i) => {
    const nl = chunk.indexOf('\n');
    const head = chunk.slice(0, nl);
    const content = chunk.slice(nl + 1).trim();
    const [title, duration] = head.split('|').map((s) => s.trim());
    if (!title || !duration) throw new Error(`${file}: lesson ${i + 1} header must be "# LESSON: Title | 20 min"`);
    lessons.push({ title, duration, content, videoUrl: '', order: i + 1 });
  });
  if (lessons.length === 0) throw new Error(`${file}: no lessons found`);

  const required = ['title', 'description', 'difficulty', 'duration', 'instructor'];
  required.forEach((k) => { if (!meta[k]) throw new Error(`${file}: front-matter is missing "${k}"`); });

  return {
    ...meta,
    status: 'Published',
    lessons,
    quizQuestions: parseQuiz(quizPart, file),
  };
}

export function loadAllCourses() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map(parseCourseFile);
}

// Turn prerequisiteTitles into ObjectIds using a title -> course lookup
export function resolvePrerequisites(courseData, findIdByTitle) {
  const { prerequisiteTitles = [], ...rest } = courseData;
  return { ...rest, prerequisites: prerequisiteTitles.map(findIdByTitle).filter(Boolean) };
}
