import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, BookOpen, Star, Users, CheckCircle2, Circle, FileText, Award, Sparkles, Tag } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Markdown from '../components/ui/Markdown';
import { courseAPI, progressAPI, authAPI } from '../utils/api';
import { authUtils } from '../utils/auth';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [completing, setCompleting] = useState(false);
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const loadData = async () => {
    const token = authUtils.getToken();
    const user = authUtils.getUser();
    
    if (!token || !user) {
      navigate('/login');
      return;
    }

    try {
      // 1. Fetch course details
      const courseData = await courseAPI.getCourse(id);
      setCourse(courseData);

      // 2. Fetch fresh user details to check enrollment
      const userData = await authAPI.getMe(token);
      authUtils.updateUser(userData);
      setCurrentUser(userData);

      const enrollment = userData.enrolledCourses?.find(
        e => (e.course?._id || e.course) === id
      );

      if (enrollment) {
        setEnrolled(true);
        setCompletedLessons(enrollment.completedLessons || []);
      } else {
        setEnrolled(false);
        setCompletedLessons([]);
      }
    } catch (error) {
      console.error('Error loading course details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, navigate]);

  const handleEnroll = async () => {
    const token = authUtils.getToken();
    if (!token) return;
    
    setEnrolling(true);
    try {
      await courseAPI.enrollCourse(token, id);
      await loadData();
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert(error.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const openLesson = (lessonId) => {
    if (!enrolled) return;
    setActiveLessonId(lessonId);
    setTimeout(() => {
      document.getElementById('lesson-viewer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCompleteLesson = async (lessonId, nextLessonId) => {
    const token = authUtils.getToken();
    if (!token || !enrolled || completing) return;

    if (!completedLessons.includes(lessonId)) {
      setCompleting(true);
      try {
        await progressAPI.updateProgress(token, id, lessonId);
        await loadData();
      } catch (error) {
        console.error('Failed to complete lesson:', error);
        alert(error.message || 'Failed to mark lesson as complete');
        setCompleting(false);
        return;
      }
      setCompleting(false);
    }
    if (nextLessonId) openLesson(nextLessonId);
  };

  const handleQuizSubmit = async () => {
    const token = authUtils.getToken();
    if (!token) return;

    try {
      const response = await progressAPI.submitQuiz(token, id, quizAnswers);
      setQuizResult(response);
      setQuizSubmitted(true);
      await loadData();
    } catch (error) {
      console.error('Quiz submission failed:', error);
      alert(error.message || 'Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-zinc-400">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-white mb-2">Course not found</h2>
        <Link to="/courses" className="text-teal-400 hover:underline">Back to Courses</Link>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const progress = lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0;
  const quizQuestions = course.quizQuestions || [];
  const firstIncomplete = lessons.find((l) => !completedLessons.includes(l._id));
  const activeLesson = lessons.find((l) => l._id === activeLessonId) || firstIncomplete || lessons[0];
  const activeIndex = activeLesson ? lessons.findIndex((l) => l._id === activeLesson._id) : -1;
  const prevLesson = activeIndex > 0 ? lessons[activeIndex - 1] : null;
  const nextLesson = activeIndex >= 0 && activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : null;
  const activeDone = activeLesson ? completedLessons.includes(activeLesson._id) : false;

  const toEmbedUrl = (url) => {
    if (!url) return '';
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : url;
  };

  return (
    <div className="space-y-8">
      <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden" glow>
            <div className="relative">
              <img src={course.image || 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop'} alt={course.title} className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
            </div>
            <CardContent className="space-y-5 -mt-16 relative">
              <div className="flex flex-wrap gap-2">
                <Badge difficulty={course.difficulty}>{course.difficulty}</Badge>
                {course.tags?.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-lg border border-zinc-700">{tag}</span>
                ))}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{course.title}</h1>
              <p className="text-zinc-400 leading-relaxed">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-600" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-zinc-600" />
                  <span>{lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-zinc-300">{course.rating || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-600" />
                  <span>{(course.enrolledCount || 0).toLocaleString()} enrolled</span>
                </div>
              </div>

              <div className="pt-5 border-t border-zinc-800">
                <p className="text-sm text-zinc-500 mb-1">Instructor</p>
                <p className="font-medium text-white">{course.instructor}</p>
              </div>
            </CardContent>
          </Card>

          {/* Lesson viewer */}
          {enrolled && activeLesson && (
            <Card id="lesson-viewer" glow className="scroll-mt-24">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
                      Lesson {activeIndex + 1} of {lessons.length}
                    </p>
                    <h2 className="text-xl font-bold text-white">{activeLesson.title}</h2>
                  </div>
                  <span className="flex items-center gap-1.5 text-sm text-zinc-500 flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4" />
                    {activeLesson.duration}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {activeLesson.videoUrl && (
                  <div className="aspect-video rounded-xl overflow-hidden border border-zinc-800 mb-6">
                    <iframe
                      src={toEmbedUrl(activeLesson.videoUrl)}
                      title={activeLesson.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
                {activeLesson.content ? (
                  <Markdown>{activeLesson.content}</Markdown>
                ) : (
                  <p className="text-zinc-500 italic">
                    No written content has been added to this lesson yet. Run <code className="text-teal-400">npm run seed:courses</code> in the project root to load the full course material.
                  </p>
                )}
              </CardContent>
              <div className="px-6 py-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <Button variant="ghost" size="sm" disabled={!prevLesson} onClick={() => prevLesson && openLesson(prevLesson._id)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={() => handleCompleteLesson(activeLesson._id, nextLesson?._id)}
                  disabled={completing}
                  variant={activeDone ? 'secondary' : 'primary'}
                >
                  {activeDone ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2 text-teal-400" />
                      {nextLesson ? 'Completed – Next lesson' : 'Completed'}
                    </>
                  ) : (
                    <>
                      {completing ? 'Saving...' : nextLesson ? 'Mark complete & continue' : 'Mark complete'}
                      {!completing && nextLesson && <ArrowRight className="w-4 h-4 ml-2" />}
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm" disabled={!nextLesson} onClick={() => nextLesson && openLesson(nextLesson._id)}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {/* Lessons */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Course Content</h2>
                <span className="text-sm text-zinc-500">{completedLessons.length}/{lessons.length} completed</span>
              </div>
              <ProgressBar value={completedLessons.length} max={lessons.length} className="mt-4" />
            </CardHeader>
            <div className="divide-y divide-zinc-800 max-h-[500px] overflow-y-auto">
              {lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson._id);
                return (
                  <button
                    key={lesson._id}
                    onClick={() => openLesson(lesson._id)}
                    disabled={!enrolled}
                    className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-zinc-800/50 transition-colors text-left group ${!enrolled ? 'opacity-60 cursor-not-allowed' : ''} ${enrolled && activeLesson?._id === lesson._id ? 'bg-teal-500/5 border-l-2 border-teal-500' : ''}`}
                  >
                    <span className="text-sm text-zinc-600 w-6 font-mono">{String(index + 1).padStart(2, '0')}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-700 group-hover:text-zinc-500 flex-shrink-0 transition-colors" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate transition-colors ${isCompleted ? 'text-zinc-500' : 'text-zinc-200 group-hover:text-white'}`}>
                        {lesson.title}
                      </p>
                    </div>
                    <span className="text-sm text-zinc-600 flex-shrink-0">{lesson.duration}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-6 sticky top-20" glow>
            <div className="text-center mb-6">
              <div className="relative inline-flex">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="#27272a" strokeWidth="8" />
                  <circle
                    cx="56" cy="56" r="48" fill="none" stroke="url(#progressGradient)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(progress / 100) * 301.6} 301.6`}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{progress}%</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-500 mt-2">Course Progress</p>
            </div>
            
            {enrolled ? (
              <>
                {progress === 100 ? (
                  <div className="text-center p-5 bg-teal-500/10 border border-teal-500/20 rounded-2xl mb-5">
                    <Award className="w-12 h-12 text-teal-400 mx-auto mb-3" />
                    <p className="font-semibold text-teal-400">Course Completed!</p>
                    <p className="text-sm text-zinc-500 mt-1">Great job finishing this course</p>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-zinc-800/40 border border-zinc-800 rounded-2xl mb-4 text-sm text-zinc-400">
                    Open a lesson, read it, then mark it complete
                  </div>
                )}
                
                {quizQuestions.length > 0 && (
                  <Button variant="outline" className="w-full" onClick={() => setShowQuiz(!showQuiz)}>
                    <FileText className="w-4 h-4 mr-2" />
                    {showQuiz ? 'Hide Quiz' : 'Take Quiz'}
                  </Button>
                )}
              </>
            ) : (
              <div className="mt-2 p-5 bg-gradient-to-br from-zinc-800/50 to-zinc-900 rounded-2xl border border-zinc-700">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Limited Offer</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-white">${course.discountPrice || course.price || 0}</span>
                  {(course.price && course.discountPrice) && (
                    <span className="text-lg text-zinc-500 line-through">${course.price}</span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 mb-4">50% off — Ends in 2 days</p>
                <Button className="w-full" onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {showQuiz && quizQuestions.length > 0 && (
        <Card glow>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Knowledge Check</h2>
                <p className="text-sm text-zinc-500">Test your understanding of the course material</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {quizSubmitted && quizResult ? (
              <div className="text-center py-10">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-5 ${quizResult.percentage >= 70 ? 'bg-teal-500/20 border border-teal-500/30' : 'bg-amber-500/20 border border-amber-500/30'}`}>
                  <span className={`text-4xl font-bold ${quizResult.percentage >= 70 ? 'text-teal-400' : 'text-amber-400'}`}>
                    {quizResult.score}/{quizResult.total}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {quizResult.percentage >= 70 ? 'Great job!' : 'Keep practicing!'}
                </h3>
                <p className="text-zinc-500 mb-8">
                  You scored {quizResult.percentage}% on this quiz
                </p>
                <Button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); setQuizResult(null); }}>
                  Retake Quiz
                </Button>
              </div>
            ) : (
              <>
                {quizQuestions.map((q, qIndex) => (
                  <div key={q._id} className="space-y-4">
                    <p className="font-medium text-white text-lg">
                      {qIndex + 1}. {q.question}
                    </p>
                    <div className="space-y-3">
                      {q.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => setQuizAnswers({ ...quizAnswers, [q._id]: oIndex })}
                          className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                            quizAnswers[q._id] === oIndex
                              ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                              : 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <Button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                  className="w-full"
                  size="lg"
                >
                  Submit Quiz
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
