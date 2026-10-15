import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, User, MapPin, Briefcase, Calendar, Trophy, BookOpen, Target, Sparkles } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { courses } from '../data/mockData';
import { authUtils } from '../utils/auth';
import { authAPI } from '../utils/api';

const achievements = [
  { id: 1, title: 'First Course', description: 'Complete your first course', icon: BookOpen, earned: true },
  { id: 2, title: 'Quick Learner', description: 'Complete 5 courses', icon: Trophy, earned: true },
  { id: 3, title: 'Perfect Score', description: 'Score 100% on a quiz', icon: Target, earned: true },
  { id: 4, title: 'Dedicated', description: 'Maintain a 30-day streak', icon: Calendar, earned: false },
];

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    location: '',
    bio: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      const user = authUtils.getUser();
      const token = authUtils.getToken();
      
      if (!user || !token) {
        navigate('/login');
        return;
      }

      try {
        const userData = await authAPI.getMe(token);
        authUtils.updateUser(userData);
        setCurrentUser(userData);
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          location: userData.location || '',
          bio: userData.bio || '',
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        setCurrentUser(user);
        setProfile({
          name: user.name || '',
          email: user.email || '',
          location: user.location || '',
          bio: user.bio || '',
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleSaveProfile = async () => {
    const token = authUtils.getToken();
    try {
      const updatedUser = await authAPI.updateProfile(token, {
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
      });
      authUtils.updateUser(updatedUser);
      setCurrentUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  const completedCourses = currentUser.enrolledCourses?.filter(e => e.completed) || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-teal-500/10 rounded-xl">
          <User className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-zinc-500">Manage your account and view achievements</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
\        <Card className="lg:col-span-2" glow>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Personal Information</h2>
              <Button
                variant={isEditing ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  if (isEditing) {
                    handleSaveProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="relative">
                <Avatar src={currentUser.avatar} name={currentUser.name} size="xl" className="w-28 h-28" />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/25">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex-1 space-y-5">
                {isEditing ? (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Bio</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 text-white bg-zinc-900 border border-zinc-700 rounded-xl transition-all duration-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
                      <p className="text-zinc-500">{currentUser.role || 'Student'}</p>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-zinc-400">
                        <Mail className="w-4 h-4 text-zinc-600" />
                        {profile.email}
                      </div>
                      {profile.location && (
                        <div className="flex items-center gap-3 text-zinc-400">
                          <MapPin className="w-4 h-4 text-zinc-600" />
                          {profile.location}
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-zinc-400">
                        <Briefcase className="w-4 h-4 text-zinc-600" />
                        {currentUser.role || 'Student'}
                      </div>
                    </div>
                    {profile.bio && <p className="text-zinc-400 pt-2">{profile.bio}</p>}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-white">Learning Stats</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
              <span className="text-zinc-400">Courses Completed</span>
              <span className="font-bold text-white">{currentUser.completedCourses || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
              <span className="text-zinc-400">Average Score</span>
              <span className="font-bold text-teal-400">{currentUser.averageScore || 0}%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
              <span className="text-zinc-400">Current Streak</span>
              <span className="font-bold text-white">{currentUser.streak || 0} days</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
              <span className="text-zinc-400">Member Since</span>
              <span className="font-bold text-white">{new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card glow>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Achievements</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map(({ id, title, description, icon: Icon, earned }) => (
              <div
                key={id}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  earned
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-zinc-800 bg-zinc-900/50 opacity-50'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  earned ? 'bg-amber-500/20' : 'bg-zinc-800'
                }`}>
                  <Icon className={`w-7 h-7 ${earned ? 'text-amber-400' : 'text-zinc-600'}`} />
                </div>
                <h3 className={`font-semibold ${earned ? 'text-white' : 'text-zinc-500'}`}>{title}</h3>
                <p className="text-sm text-zinc-500 mt-1">{description}</p>
                {earned && <Badge variant="success" className="mt-3">Earned</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      {completedCourses.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-teal-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Certificates</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedCourses.map(enrollment => {
                const course = enrollment.course;
                if (!course) return null;
                return (
                  <div key={course._id} className="p-5 border border-zinc-800 rounded-2xl hover:border-teal-500/30 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-teal-500/10 rounded-xl group-hover:bg-teal-500/20 transition-colors">
                        <Trophy className="w-5 h-5 text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{course.title}</h3>
                        <p className="text-sm text-zinc-500">Completed {enrollment.completedAt ? new Date(enrollment.completedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'recently'}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-4">
                      View Certificate
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
