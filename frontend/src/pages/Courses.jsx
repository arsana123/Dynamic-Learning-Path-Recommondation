import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Star, Users, BookOpen, Sparkles } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { courseAPI } from '../utils/api';
import { authUtils } from '../utils/auth';

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const user = authUtils.getUser();
    setCurrentUser(user);

    const fetchCourses = async () => {
      try {
        const data = await courseAPI.getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const allTags = [...new Set(courses.flatMap(c => c.tags || []))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                          course.description.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficulty === 'All' || course.difficulty === difficulty;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => course.tags?.includes(tag));
    return matchesSearch && matchesDifficulty && matchesTags;
  });

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-zinc-400">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-teal-500/10 rounded-xl">
          <Sparkles className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Explore Courses</h1>
          <p className="text-zinc-500">Discover courses tailored to your learning goals</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  difficulty === d
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : 'bg-zinc-800/50 text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-zinc-500">{filteredCourses.length} courses found</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const userEnrollment = currentUser?.enrolledCourses?.find(
            e => (e.course?._id || e.course) === course._id
          );
          const isCompleted = userEnrollment?.completed || false;

          return (
            <Card key={course._id} hover glow className="overflow-hidden group">
              <div className="relative">
                <img
                  src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge difficulty={course.difficulty}>{course.difficulty}</Badge>
                </div>
                {isCompleted && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="success">Completed</Badge>
                  </div>
                )}
              </div>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {course.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-md border border-zinc-700">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-semibold text-white mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{course.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-zinc-500 mb-5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {course.lessons?.length || 0} lessons
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-white">{course.rating || 0}</span>
                    </div>
                    <span className="text-zinc-700">•</span>
                    <div className="flex items-center gap-1 text-sm text-zinc-500">
                      <Users className="w-4 h-4" />
                      {(course.enrolledCount || 0).toLocaleString()}
                    </div>
                  </div>
                  <Link to={`/courses/${course._id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Search className="w-10 h-10 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
          <p className="text-zinc-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
