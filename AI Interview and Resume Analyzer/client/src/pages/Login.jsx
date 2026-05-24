import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import { Sparkles, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, skip login page
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        toast.success('Successfully logged in! Welcome back!');
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        toast.error(res.message || 'Login failed. Incorrect credentials.');
      }
    } catch (err) {
      toast.error('An unexpected login error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-darkBg overflow-hidden">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#121829',
          color: '#f8fafc',
          border: '1px solid #1f293d'
        }
      }} />
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[80px] pointer-events-none"></div>

        <div className="w-full max-w-md rounded-3xl border border-darkBorder bg-darkCard/80 p-8 shadow-2xl backdrop-blur-md relative z-10">
          
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-neon shadow-lg mb-4">
              <Sparkles className="h-6 w-6 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-xs font-semibold text-slate-400">
              Sign in to manage your resumes and start AI technical mock boards.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-darkBorder bg-darkBg/60 py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-darkBorder bg-darkBg/60 py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-lg hover:bg-indigo-500 transition button-glow disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Access Platform</span>
                </>
              )}
            </button>
          </form>

          {/* Switch link */}
          <p className="mt-6 text-center text-xs font-medium text-slate-400">
            New to ElevateAI?{' '}
            <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition">
              Create a free account
            </Link>
          </p>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
