import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb,
  Clock
} from 'lucide-react';

const InterviewResult = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [expandedQId, setExpandedQId] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/interview/result/${id}`);
        setInterview(res.data);
      } catch (error) {
        console.error('Fetch interview result failed:', error);
        toast.error('Failed to load this interview scorecard.');
        setTimeout(() => navigate('/dashboard'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id, navigate]);

  const toggleExpandQ = (qId) => {
    if (expandedQId === qId) {
      setExpandedQId(null);
    } else {
      setExpandedQId(qId);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/25 bg-emerald-500/5';
    if (score >= 65) return 'text-indigo-400 border-indigo-500/25 bg-indigo-500/5';
    return 'text-yellow-400 border-yellow-500/25 bg-yellow-500/5';
  };

  const getScoreGlow = (score) => {
    if (score >= 80) return 'rgba(16, 185, 129, 0.15)';
    if (score >= 65) return 'rgba(99, 102, 241, 0.15)';
    return 'rgba(245, 158, 11, 0.15)';
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
          
          {/* Header Controls */}
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>

          {loading ? (
            <Loader message="Loading report scorecard..." />
          ) : !interview ? (
            <div className="text-center py-20 glass-panel rounded-3xl">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-extrabold text-lg text-white">Scorecard not found</h3>
              <p className="text-xs text-slate-400 mt-2">The requested scorecard was either deleted or is inaccessible.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Top Banner Card */}
              <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/[0.03] blur-3xl pointer-events-none"></div>
                
                <div className="text-center md:text-left space-y-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-500/25">
                    <Sparkles className="h-3 w-3" />
                    AI Evaluation Graded
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{interview.jobType} Mock</h1>
                  <p className="text-xs text-slate-400 font-semibold flex items-center justify-center md:justify-start gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Attempted on {new Date(interview.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Circular Score Badge */}
                <div 
                  className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-slate-800 ${getScoreColor(interview.score)}`}
                  style={{ boxShadow: `0 0 30px ${getScoreGlow(interview.score)}` }}
                >
                  <div className="text-center">
                    <span className="text-3xl font-extrabold tracking-tight">{interview.score}</span>
                    <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-widest mt-0.5">Grade</span>
                  </div>
                </div>
              </div>

              {/* Sub-Scores & Areas of Study */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left side sub-scores progress */}
                <div className="glass-panel rounded-3xl p-6 space-y-5">
                  <h3 className="font-extrabold text-sm text-slate-300 flex items-center gap-2 border-b border-darkBorder pb-2">
                    <Award className="h-4.5 w-4.5 text-indigo-400" />
                    Competency Breakdown
                  </h3>

                  <div className="space-y-4">
                    {/* Progress 1 */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                        <span>Technical Accuracy</span>
                        <span className="text-white font-extrabold">{interview.feedback?.technicalScore || 0}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${interview.feedback?.technicalScore || 0}%` }}></div>
                      </div>
                    </div>

                    {/* Progress 2 */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                        <span>Communication Quality</span>
                        <span className="text-white font-extrabold">{interview.feedback?.communicationScore || 0}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${interview.feedback?.communicationScore || 0}%` }}></div>
                      </div>
                    </div>

                    {/* Progress 3 */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                        <span>Confidence Level</span>
                        <span className="text-white font-extrabold">{interview.feedback?.confidenceScore || 0}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full" style={{ width: `${interview.feedback?.confidenceScore || 0}%` }}></div>
                      </div>
                    </div>

                    {/* Progress 4 */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                        <span>Problem Solving</span>
                        <span className="text-white font-extrabold">{interview.feedback?.problemSolvingScore || 0}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${interview.feedback?.problemSolvingScore || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side Strengths/Weaknesses */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Strengths */}
                  <div className="glass-panel rounded-3xl p-6 space-y-4">
                    <h3 className="font-extrabold text-sm text-slate-300 flex items-center gap-2 border-b border-darkBorder pb-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                      Key Core Strengths
                    </h3>
                    <ul className="space-y-3.5">
                      {interview.feedback?.strengths?.map((str, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs font-medium text-slate-300 leading-relaxed">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="glass-panel rounded-3xl p-6 space-y-4">
                    <h3 className="font-extrabold text-sm text-slate-300 flex items-center gap-2 border-b border-darkBorder pb-2">
                      <AlertCircle className="h-4.5 w-4.5 text-yellow-400" />
                      Constructive Feedback
                    </h3>
                    <ul className="space-y-3.5">
                      {interview.feedback?.weaknesses?.map((wk, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs font-medium text-slate-300 leading-relaxed">
                          <AlertCircle className="h-4.5 w-4.5 text-yellow-400 shrink-0 mt-0.5" />
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>

              {/* Suggestions */}
              {interview.feedback?.improvementSuggestions && (
                <div className="glass-panel rounded-3xl p-6 space-y-3">
                  <h3 className="font-extrabold text-sm text-slate-300 flex items-center gap-2 border-b border-darkBorder pb-2">
                    <Lightbulb className="h-4.5 w-4.5 text-yellow-400 animate-pulse" />
                    Recommended Improvement Plans
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {interview.feedback?.improvementSuggestions.map((sug, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs font-medium text-slate-300 bg-darkBg/30 border border-darkBorder p-3 rounded-xl leading-relaxed">
                        <span className="h-2 w-2 rounded-full bg-yellow-400 shrink-0 mt-1.5 animate-pulse"></span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Q&A Accordion */}
              <div className="glass-panel rounded-3xl p-6 space-y-4">
                <h3 className="font-extrabold text-lg text-white">Review Questions & Responses</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Examine your submitted responses for each question to benchmark improvements:
                </p>

                <div className="space-y-3 pt-2">
                  {interview.questions?.map((q) => {
                    const ans = interview.answers?.find(a => a.questionId === q.id)?.userAnswerText || 'No answer submitted.';
                    const isExpanded = expandedQId === q.id;
                    return (
                      <div 
                        key={q.id} 
                        className="rounded-2xl border border-darkBorder bg-darkBg/30 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleExpandQ(q.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/20 transition"
                        >
                          <div className="flex gap-3 overflow-hidden pr-2">
                            <span className="text-xs font-bold text-indigo-400 shrink-0 mt-0.5">Q{q.id}.</span>
                            <span className="text-sm font-bold text-slate-200 truncate">{q.questionText}</span>
                          </div>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
                        </button>

                        {isExpanded && (
                          <div className="p-4 border-t border-darkBorder bg-darkCard/20 space-y-3">
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Question Details ({q.category}):</p>
                              <p className="text-sm font-semibold text-slate-300 leading-relaxed">{q.questionText}</p>
                            </div>
                            <div className="pt-2">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Your response:</p>
                              <p className="text-xs font-medium text-slate-200 bg-darkBg/80 p-3 rounded-xl border border-darkBorder leading-relaxed whitespace-pre-wrap">
                                {ans}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex justify-end gap-3 pt-2">
                <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-darkBorder bg-darkCard px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white transition">
                  Back to dashboard overview
                </Link>
                <Link to="/interview" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition button-glow">
                  Attend another mock interview round
                </Link>
              </div>

            </div>
          )}

        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default InterviewResult;
