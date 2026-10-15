import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Edit2, Trash2, Eye, Users, Star, BookOpen, Shield } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { authUtils } from '../utils/auth';
import { API_URL } from '../utils/api';

export default function Admin() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    duration: '',
    instructor: '',
    tags: '',
    price: '',
    image: '',
  });

  useEffect(() => {
    const user = authUtils.getUser();
    console.log('Current user:', user);
    if (!user || user.role !== 'admin') {
      console.log('User not admin, redirecting...');
      navigate('/');
      return;
    }
    loadCourses();
  }, [navigate]);

  const loadCourses = async () => {
    try {
      const token = authUtils.getToken();
      console.log('Loading courses with token:', token ? 'Token exists' : 'No token');
      const response = await fetch(`${API_URL}/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Courses response status:', response.status);
      const data = await response.json();
      console.log('Courses data:', data);
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const token = authUtils.getToken();
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const courseData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        duration: formData.duration,
        instructor: formData.instructor,
        tags: tagsArray,
        price: parseFloat(formData.price) || 0,
        image: formData.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
        status: 'Published',
        lessons: [],
        quizQuestions: [],
      };

      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Course creation failed:', errorData);
        throw new Error(errorData.message || 'Failed to create course');
      }

      const newCourse = await response.json();
      setCourses([newCourse, ...courses]);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        difficulty: 'Beginner',
        duration: '',
        instructor: '',
        tags: '',
        price: '',
        image: '',
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const token = authUtils.getToken();
      const response = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setCourses(courses.filter(c => c._id !== courseId));
    } catch (error) {
      alert('Error deleting course: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
    { label: 'Total Students', value: courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0).toLocaleString(), icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Avg Rating', value: courses.filter(c => c.rating > 0).length > 0 ? (courses.filter(c => c.rating > 0).reduce((acc, c) => acc + c.rating, 0) / courses.filter(c => c.rating > 0).length).toFixed(1) : '0.0', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/10 rounded-xl">
            <Shield className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-zinc-500">Manage courses and content</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <Card key={label} className={`p-5 border ${border}`} hover>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-zinc-500">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Course Form */}
      {showForm && (
        <Card glow>
          <CardHeader>
            <h2 className="text-lg font-bold text-white">Add New Course</h2>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleCreateCourse} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Course Title"
                  placeholder="Enter course title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={creating}
                />
                <Input
                  label="Instructor"
                  placeholder="Instructor name"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  required
                  disabled={creating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                <textarea
                  placeholder="Course description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                  disabled={creating}
                  className="w-full px-4 py-3 text-white bg-zinc-900 border border-zinc-700 rounded-xl transition-all duration-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    disabled={creating}
                    className="w-full px-4 py-3 text-white bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <Input
                  label="Duration"
                  placeholder="e.g., 8 weeks"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  disabled={creating}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Tags (comma separated)"
                  placeholder="e.g., React, JavaScript, Frontend"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  disabled={creating}
                />
                <Input
                  label="Price"
                  type="number"
                  placeholder="e.g., 99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={creating}
                />
              </div>
              <Input
                label="Image URL (optional)"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                disabled={creating}
              />
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Course'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={creating}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Course Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">All Courses</h2>
            <div className="flex gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="flex border border-zinc-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'cards' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Course</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Students</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rating</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredCourses.map(course => (
                  <tr key={course._id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{course.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={course.status === 'Published' ? 'success' : 'warning'}>
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{(course.enrolledCount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {course.rating > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-zinc-300">{course.rating}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course._id)}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map(course => (
                <div key={course._id} className="p-5 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant={course.status === 'Published' ? 'success' : 'warning'}>
                      {course.status}
                    </Badge>
                    <button className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-white mb-3 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {(course.enrolledCount || 0).toLocaleString()}
                    </div>
                    {course.rating > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-zinc-300">{course.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-5 pt-4 border-t border-zinc-800">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleDeleteCourse(course._id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
