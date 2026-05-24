import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FileText, 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Bookmark, 
  CheckCircle,
  HelpCircle,
  Clock,
  Trash2
} from 'lucide-react';

const ResumeResult = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/resume/${id}`);
        setResume(res.data);
      } catch (error) {
        console.error('Fetch resume details failed:', error);
        toast.error('Failed to load this resume audit.');
        setTimeout(() => navigate('/dashboard'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete this resume analysis record? This action is irreversible.')) {
      return;
    }

    try {
      setLoading(true);
      await API.delete(`/resume/${id}`);
      toast.success('Resume analysis record successfully deleted.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Delete resume failed:', error);
      toast.error('Could not complete deletion.');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/35 bg-emerald-500/5';
    if (score >= 65) return 'text-indigo-400 border-indigo-500/35 bg-indigo-500/5';
    return 'text-yellow-400 border-yellow-500/35 bg-yellow-500/5';
  };

  const getScoreGlow = (score) => {
    if (score >= 80) return 'rgba(16, 185, 129, 0.2)';
    if (score >= 65) return 'rgba(99, 102, 241, 0.2)';
    return 'rgba(245, 158, 11, 0.2)';
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
          
          {/* Back Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            
            {resume && (
              <button 
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete Analysis
              </button>
            )}
          </div>

          {loading ? (
            <Loader message="Fetching audit details..." />
          ) : !resume ? (
            <div className="text-center py-20 glass-panel rounded-3xl">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-extrabold text-lg text-white">Analysis not found</h3>
              <p className="text-xs text-slate-400 mt-2">The requested report was either deleted or is inaccessible.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Core Score circular display */}
              <div className="space-y-6">
                <div className="glass-panel rounded-3xl p-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none"></div>
                  
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-darkBg/60 px-3 py-1 rounded-full border border-darkBorder mb-6">
                    ATS Audit rating
                  </span>

                  {/* Circular Dial */}
                  <div 
                    className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-slate-800"
                    style={{ boxShadow: `0 0 40px ${getScoreGlow(resume.atsScore)}` }}
                  >
                    <div className="text-center">
                      <span className="text-4xl font-extrabold text-white tracking-tight">{resume.atsScore}</span>
                      <span className="text-sm font-semibold text-slate-500">/100</span>
                    </div>
                  </div>

                  <p className="mt-6 text-sm font-bold text-slate-100">
                    {resume.atsScore >= 80 ? 'Highly Match-Compatible!' : 
                     resume.atsScore >= 65 ? 'Ready to Apply (with warnings)' : 
                     'Significant Improvements Needed'}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs font-medium">
                    This score measures keyword density, structured hierarchies, and grammar parsed by typical corporate scanning software.
                  </p>
                </div>

                {/* Role Matches */}
                <div className="glass-panel rounded-3xl p-6 space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-300 flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-indigo-400" />
                    AI Career Suggestions
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {resume.bestRoleSuggestions?.map((role, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-3 py-1.5 rounded-xl uppercase tracking-wide"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Audit details */}
                <div className="glass-panel rounded-3xl p-6 text-xs text-slate-500 space-y-2">
                  <div className="flex justify-between">
                    <span>File Analyzed:</span>
                    <span className="font-semibold text-slate-300 truncate max-w-[120px]">{resume.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parsed On:</span>
                    <span className="font-semibold text-slate-300">{new Date(resume.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audit Pipeline:</span>
                    <span className="font-semibold text-indigo-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      MERN v2.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Suggestions, missing skills */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Missing Skills */}
                <div className="glass-panel rounded-3xl p-6 space-y-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Detected Missing Keywords
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      These core skill tags are currently absent or thin in your CV text:
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {resume.missingSkills?.length === 0 ? (
                      <p className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle className="h-4 w-4" />
                        Fantastic! All key technology terms were parsed correctly.
                      </p>
                    ) : (
                      resume.missingSkills?.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/25 px-3 py-1.5 rounded-xl uppercase tracking-wide"
                        >
                          + {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Suggestions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Suggestions block */}
                  <div className="glass-panel rounded-3xl p-6 space-y-4">
                    <h3 className="font-extrabold text-md text-white flex items-center gap-2 border-b border-darkBorder pb-2">
                      <TrendingUp className="h-4.5 w-4.5 text-blue-400" />
                      Content Optimization
                    </h3>
                    
                    <ul className="space-y-3">
                      {resume.suggestions?.map((sug, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs font-medium text-slate-300 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5"></span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Grammar / layout improvements */}
                  <div className="glass-panel rounded-3xl p-6 space-y-4">
                    <h3 className="font-extrabold text-md text-white flex items-center gap-2 border-b border-darkBorder pb-2">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
                      Structure & Styling
                    </h3>
                    
                    <ul className="space-y-3">
                      {resume.improvements?.map((imp, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs font-medium text-slate-300 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Bottom Navigation */}
                <div className="flex gap-3 justify-end pt-4">
                  <Link to="/upload" className="inline-flex items-center gap-2 rounded-xl border border-darkBorder bg-darkCard px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white transition">
                    Upload another resume PDF
                  </Link>
                  <Link to="/interview" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition button-glow">
                    Practice custom technical mock rounds
                  </Link>
                </div>

              </div>

            </div>
          )}

        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default ResumeResult;
