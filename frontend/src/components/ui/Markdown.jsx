// Small, dependency-free Markdown renderer for lesson content.
// Supports: headings, paragraphs, bold/italic, inline code, links, fenced code blocks,
// bullet & numbered lists, blockquotes, tables and horizontal rules.
// It builds React elements (never raw HTML), so lesson text can't inject scripts.
import { Fragment } from 'react';

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text, keyPrefix = 'i') {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!part) return null;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={key} className="px-1.5 py-0.5 rounded-md bg-zinc-800 text-teal-300 text-[0.85em] font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={key} className="text-white font-semibold">{renderInline(part.slice(2, -2), key)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={key} className="italic text-zinc-200">{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const safe = /^https?:\/\//i.test(link[2]);
      return safe ? (
        <a key={key} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-teal-400 underline underline-offset-2 hover:text-teal-300">
          {link[1]}
        </a>
      ) : (
        <Fragment key={key}>{link[1]}</Fragment>
      );
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

const splitRow = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
const isTableSep = (line) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(line);

export default function Markdown({ children = '' }) {
  const lines = String(children).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // fenced code block
    const fence = line.match(/^(```|~~~)\s*([\w+-]*)\s*$/);
    if (fence) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith(fence[1])) { code.push(lines[i]); i++; }
      i++;
      out.push(
        <div key={k++} className="my-5 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
          {fence[2] && (
            <div className="px-4 py-1.5 text-[11px] uppercase tracking-wider text-zinc-500 bg-zinc-900 border-b border-zinc-800 font-mono">
              {fence[2]}
            </div>
          )}
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-zinc-200 font-mono"><code>{code.join('\n')}</code></pre>
        </div>
      );
      continue;
    }

    // headings
    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const cls = level === 2
        ? 'text-xl font-bold text-white mt-8 mb-3'
        : level === 3
          ? 'text-lg font-semibold text-white mt-6 mb-2'
          : 'text-base font-semibold text-zinc-200 mt-5 mb-2';
      const Tag = `h${level}`;
      out.push(<Tag key={k++} className={cls}>{renderInline(h[2], `h${k}`)}</Tag>);
      i++;
      continue;
    }

    // horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      out.push(<hr key={k++} className="my-6 border-zinc-800" />);
      i++;
      continue;
    }

    // table
    if (line.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const head = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) { rows.push(splitRow(lines[i])); i++; }
      out.push(
        <div key={k++} className="my-5 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>{head.map((c, ci) => <th key={ci} className="px-4 py-2.5 font-semibold border-b border-zinc-800">{renderInline(c, `th${ci}`)}</th>)}</tr>
            </thead>
            <tbody className="text-zinc-400">
              {rows.map((r, ri) => (
                <tr key={ri} className="border-b border-zinc-800/60 last:border-0">
                  {r.map((c, ci) => <td key={ci} className="px-4 py-2.5">{renderInline(c, `td${ri}-${ci}`)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // blockquote
    if (line.startsWith('>')) {
      const q = [];
      while (i < lines.length && lines[i].startsWith('>')) { q.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(
        <blockquote key={k++} className="my-5 pl-4 border-l-4 border-teal-500/60 bg-teal-500/5 py-2 pr-3 rounded-r-lg text-zinc-300">
          {renderInline(q.join(' '), `bq${k}`)}
        </blockquote>
      );
      continue;
    }

    // lists
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      const ordered = !!ol;
      const re = ordered ? /^\s*\d+[.)]\s+(.*)$/ : /^\s*[-*]\s+(.*)$/;
      const items = [];
      while (i < lines.length && re.test(lines[i])) { items.push(lines[i].match(re)[1]); i++; }
      const Tag = ordered ? 'ol' : 'ul';
      out.push(
        <Tag key={k++} className={`my-4 space-y-1.5 pl-6 text-zinc-300 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-teal-500`}>
          {items.map((it, ii) => <li key={ii} className="leading-relaxed pl-1">{renderInline(it, `li${k}-${ii}`)}</li>)}
        </Tag>
      );
      continue;
    }

    // paragraph (collect consecutive plain lines)
    const para = [lines[i]];
    i++;
    while (
      i < lines.length && lines[i].trim() &&
      !/^(```|~~~|#{2,4}\s|>|\s*[-*]\s+|\s*\d+[.)]\s+)/.test(lines[i]) &&
      !(lines[i].includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1]))
    ) { para.push(lines[i]); i++; }
    out.push(<p key={k++} className="my-3 text-zinc-300 leading-7">{renderInline(para.join(' '), `p${k}`)}</p>);
  }

  return <div className="lesson-markdown">{out}</div>;
}
