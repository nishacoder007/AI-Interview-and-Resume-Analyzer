import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Award, 
  TrendingUp, 
  FileText, 
  MessageSquareCode,
  Calendar,
  Edit3,
  Check,
  X,
  Plus,
  Briefcase
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeCount, setResumeCount] = useState(0);
  const [bestAts, setBestAts] = useState(0);
  const [interviews, setInterviews] = useState([]);

  // Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [skillsInput, setSkillsInput] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    // Populate form data from user context
    if (user) {
      setName(user.name || '');
      setTitle(user.title || 'Software Engineer');
      setBio(user.bio || 'Passionate developer interested in building modern web applications and optimizing systems.');
      setExperienceLevel(user.experienceLevel || 'Mid-Level');
      setSkillsInput(user.skills ? user.skills.join(', ') : 'React, Node.js, JavaScript');
    }
  }, [user]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [resumesRes, interviewsRes] = await Promise.all([
          API.get('/resume/all'),
          API.get('/interview/history')
        ]);
        
        const resumes = resumesRes.data || [];
        const interviewList = interviewsRes.data || [];
        
        setResumeCount(resumes.length);
        setInterviews(interviewList);
        
        if (resumes.length > 0) {
          setBestAts(Math.max(...resumes.map(r => r.atsScore)));
        }
      } catch (error) {
        console.error('Fetch profile analytics failed:', error);
        toast.error('Failed to load profile intelligence.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name field cannot be left blank.');
      return;
    }

    // Split skills by commas and trim whitespaces
    const parsedSkills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      setSubmitLoading(true);
      const res = await updateProfile({
        name,
        title,
        bio,
        experienceLevel,
        skills: parsedSkills
      });

      if (res.success) {
        toast.success('Professional profile successfully updated!');
        setIsEditing(false);
      } else {
        toast.error(res.message || 'Profile updates failed.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred while updating profile.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Compute capability score aggregates
  let techAvg = 0, commAvg = 0, confAvg = 0, solveAvg = 0;
  if (interviews.length > 0) {
    interviews.forEach(i => {
      techAvg += i.feedback?.technicalScore || 0;
      commAvg += i.feedback?.communicationScore || 0;
      confAvg += i.feedback?.confidenceScore || 0;
      solveAvg += i.feedback?.problemSolvingScore || 0;
    });
    techAvg = Math.round(techAvg / interviews.length);
    commAvg = Math.round(commAvg / interviews.length);
    confAvg = Math.round(confAvg / interviews.length);
    solveAvg = Math.round(solveAvg / interviews.length);
  } else {
    // Fallback standard benchmarks
    techAvg = 70;
    commAvg = 75;
    confAvg = 80;
    solveAvg = 72;
  }

  // Capability Chart
  const capabilityChartData = {
    labels: ['Technical Accuracy', 'Communication', 'Confidence', 'Problem Solving'],
    datasets: [
      {
        label: 'Candidate Score (%)',
        data: [techAvg, commAvg, confAvg, solveAvg],
        backgroundColor: [
          'rgba(99, 102, 241, 0.45)', // indigo-500
          'rgba(168, 85, 247, 0.45)', // purple-500
          'rgba(245, 158, 11, 0.45)', // amber-500
          'rgba(16, 185, 129, 0.45)'  // emerald-500
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 1.5,
        borderRadius: 12,
      },
    ],
  };

  const capabilityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#121829',
        bodyColor: '#f1f5f9',
        borderColor: '#1f293d',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(31, 41, 61, 0.4)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-darkBg">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#121829', color: '#f8fafc', border: '1px solid #1f293d' }
      }} />

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col md:pl-64">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-grow p-6 max-w-5xl w-full mx-auto space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Analytics Profile</h1>
              <p className="text-sm font-semibold text-slate-400 mt-1">Manage credentials and monitor capability index averages.</p>
            </div>
            
            {/* Toggle Panel Button */}
            {!loading && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 shadow-md ${
                  isEditing 
                    ? 'bg-slate-800 text-slate-300 hover:text-white border border-darkBorder' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 button-glow'
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel Editing
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Edit Profile Details
                  </>
                )}
              </button>
            )}
          </div>

          {loading ? (
            <Loader message="Synthesizing capability index averages..." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Visual summary card */}
              <div className="space-y-6">
                
                {/* Profile Overview Card */}
                <div className="glass-panel rounded-3xl p-6 text-center space-y-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-indigo-500/[0.02] blur-xl pointer-events-none"></div>

                  <div className="space-y-4">
                    {/* Avatar */}
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 font-extrabold text-2xl border-2 border-indigo-500/30 shadow-lg">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>

                    <div>
                      <h2 className="text-xl font-extrabold text-white">{user?.name}</h2>
                      <p className="text-xs text-indigo-400 font-bold tracking-wide uppercase mt-1">
                        {user?.title || 'Software Engineer'}
                      </p>
                      <span className="text-[10px] font-bold text-slate-500 bg-darkBg/60 border border-darkBorder px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-2.5 inline-block">
                        {user?.experienceLevel || 'Mid-Level'}
                      </span>
                    </div>
                  </div>

                  {/* Profile Meta Info */}
                  <div className="border-t border-darkBorder pt-6 space-y-4 text-xs font-semibold text-slate-400 text-left">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4.5 w-4.5 text-slate-500" />
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Email Address</p>
                        <p className="text-slate-200 truncate mt-0.5">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4.5 w-4.5 text-slate-500" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Experience Range</p>
                        <p className="text-slate-200 mt-0.5">{user?.experienceLevel || 'Mid-Level'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Bio / Summary Box */}
                <div className="glass-panel rounded-3xl p-6 space-y-3">
                  <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest">Professional Summary</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {user?.bio || 'Passionate developer interested in building modern web applications and optimizing systems.'}
                  </p>
                </div>

                {/* Custom Skills Tags display */}
                <div className="glass-panel rounded-3xl p-6 space-y-3">
                  <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest">Skills Matrix</h3>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {user?.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1 rounded-lg uppercase tracking-wide"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 font-semibold italic">No custom skills added.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Edit Form vs Diagnostics/Charts */}
              <div className="lg:col-span-2 space-y-6">
                
                {isEditing ? (
                  // Profile Editor panel
                  <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/[0.02] blur-3xl pointer-events-none"></div>

                    <h3 className="font-extrabold text-lg text-white border-b border-darkBorder pb-3 flex items-center gap-2">
                      <Edit3 className="h-5 w-5 text-indigo-400" />
                      Configure Professional Details
                    </h3>

                    <form onSubmit={handleUpdateSubmit} className="space-y-4 pt-4">
                      
                      {/* Form row 1: Name and Title */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="form-name" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Full Name
                          </label>
                          <input
                            id="form-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-xl border border-darkBorder bg-darkBg/60 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label htmlFor="form-title" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Professional Role / Title
                          </label>
                          <input
                            id="form-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="block w-full rounded-xl border border-darkBorder bg-darkBg/60 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                            placeholder="MERN Developer"
                          />
                        </div>
                      </div>

                      {/* Form row 2: Experience level dropdown */}
                      <div>
                        <label htmlFor="form-exp" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Experience Level Category
                        </label>
                        <select
                          id="form-exp"
                          value={experienceLevel}
                          onChange={(e) => setExperienceLevel(e.target.value)}
                          className="block w-full rounded-xl border border-darkBorder bg-darkCard px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer"
                        >
                          <option value="Entry-Level">Entry-Level Developer (0-2 years)</option>
                          <option value="Mid-Level">Mid-Level Developer (2-5 years)</option>
                          <option value="Senior-Level">Senior-Level Specialist (5+ years)</option>
                        </select>
                      </div>

                      {/* Form row 3: Bio summary */}
                      <div>
                        <label htmlFor="form-bio" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Professional Summary Bio
                        </label>
                        <textarea
                          id="form-bio"
                          rows={4}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="block w-full rounded-xl border border-darkBorder bg-darkBg/60 p-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                          placeholder="Brief summary of your stack accomplishments..."
                        />
                      </div>

                      {/* Form row 4: Skills comma input */}
                      <div>
                        <label htmlFor="form-skills" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>Skills Matrix Tags</span>
                          <span className="text-[10px] text-slate-500 tracking-normal capitalize font-semibold normal-case">Enter skills separated by commas</span>
                        </label>
                        <input
                          id="form-skills"
                          type="text"
                          value={skillsInput}
                          onChange={(e) => setSkillsInput(e.target.value)}
                          className="block w-full rounded-xl border border-darkBorder bg-darkBg/60 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                          placeholder="React, Node.js, Express, MongoDB, TypeScript, Git"
                        />
                      </div>

                      {/* CTA Form controls */}
                      <div className="flex justify-end gap-3 pt-3 border-t border-darkBorder">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="rounded-xl border border-darkBorder bg-darkCard px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitLoading}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition button-glow disabled:opacity-50"
                        >
                          {submitLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              <span>Commit Profile Changes</span>
                            </>
                          )}
                        </button>
                      </div>

                    </form>

                  </div>
                ) : (
                  // Analytics overview charts and benchmarks
                  <div className="space-y-6">
                    
                    {/* Diagnostic Quick stats rows */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      
                      <div className="glass-panel rounded-2xl p-4 text-center">
                        <FileText className="h-5 w-5 text-indigo-400 mx-auto mb-1" />
                        <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">Resumes</p>
                        <p className="text-xl font-extrabold text-white mt-1">{resumeCount}</p>
                      </div>

                      <div className="glass-panel rounded-2xl p-4 text-center">
                        <Award className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">Best ATS</p>
                        <p className="text-xl font-extrabold text-white mt-1">{bestAts}%</p>
                      </div>

                      <div className="glass-panel rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
                        <MessageSquareCode className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                        <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">Mocks Graded</p>
                        <p className="text-xl font-extrabold text-white mt-1">{interviews.length}</p>
                      </div>

                    </div>

                    {/* Chart panel */}
                    <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[300px]">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-extrabold text-lg text-white">AI Capability Index</h3>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">Accumulated scores across all mock evaluations</p>
                        </div>
                        {interviews.length === 0 && (
                          <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/25 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Baseline Benchmark
                          </span>
                        )}
                      </div>

                      <div className="flex-grow min-h-[200px] relative">
                        <Bar data={capabilityChartData} options={capabilityChartOptions} />
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
