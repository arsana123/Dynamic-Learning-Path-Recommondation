import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Sparkles, User, Mail, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { authAPI } from '../utils/api';
import { authUtils } from '../utils/auth';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const data = await authAPI.register(formData);
      
      authUtils.saveAuth(data.token, {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar,
        streak: 1, // Start with streak of 1 on sign up
      });

      navigate('/');
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl mb-6 shadow-xl shadow-teal-500/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
            <p className="text-zinc-400">Join our dynamic learning path platform today</p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 p-8">
            {errors.general && (
              <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {errors.general}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                disabled={loading}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                disabled={loading}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                    className={`w-full px-4 py-3 pr-11 text-white bg-zinc-900 border rounded-xl transition-all duration-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${errors.password ? 'border-red-500' : 'border-zinc-700'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating account..." : "Sign up"}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-zinc-900/50 text-zinc-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right - Hero */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-zinc-900 to-zinc-950 border-l border-zinc-800">
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Personalized learning paths tailored to your goals
          </h2>
          <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
            Join thousands of learners who have accelerated their careers with our intelligent recommendation system.
          </p>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-sm text-zinc-500">Active Learners</p>
            </div>
            <div className="w-px h-12 bg-zinc-800" />
            <div>
              <p className="text-3xl font-bold text-white">200+</p>
              <p className="text-sm text-zinc-500">Expert Courses</p>
            </div>
            <div className="w-px h-12 bg-zinc-800" />
            <div>
              <p className="text-3xl font-bold text-teal-400">4.9</p>
              <p className="text-sm text-zinc-500">User Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
