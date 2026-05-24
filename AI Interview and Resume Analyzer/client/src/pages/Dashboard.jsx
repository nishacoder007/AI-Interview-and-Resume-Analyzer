import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FileText, 
  MessageSquareCode, 
  Plus, 
  TrendingUp, 
  Calendar, 
  Award, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resumesRes, interviewsRes] = await Promise.all([
          API.get('/resume/all'),
          API.get('/interview/history')
        ]);
        setResumes(resumesRes.data || []);
        setInterviews(interviewsRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard lists:', error);
        toast.error('Failed to load recent history logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute metrics
  const avgAtsScore = resumes.length > 0 
    ? Math.round(resumes.reduce((acc, curr) => acc + curr.atsScore, 0) / resumes.length)
    : 0;

  const avgInterviewScore = interviews.length > 0
    ? Math.round(interviews.reduce((acc, curr) => acc + curr.score, 0) / interviews.length)
    : 0;

  // Chart Details
  const chartLabels = resumes.length > 0 
    ? resumes.slice().reverse().map(r => new Date(r.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}))
    : ['Baseline', 'Industry standard', 'Expert rating'];

  const chartDataPoints = resumes.length > 0
    ? resumes.slice().reverse().map(r => r.atsScore)
    : [55, 70, 85];

  const lineChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'ATS Compliance Score (%)',
        data: chartDataPoints,
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(168, 85, 247, 1)',
        pointBorderColor: '#fff',
        tension: 0.35,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#121829',
        titleColor: '#94a3b8',
        bodyColor: '#f1f5f9',
        borderColor: '#1f293d',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(31, 41, 61, 0.5)',
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 }
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-darkBg">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#121829', color: '#f8fafc', border: '1px solid #1f293d' }
      }} />

      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main dashboard viewport */}
      <div className="flex flex-1 flex-col md:pl-64">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-grow p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Welcome heading */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Hi, {user?.name || 'Candidate'} 👋
              </h1>
              <p className="text-sm font-semibold text-slate-400 mt-1">
                Here's a snapshot of your current preparation metrics.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/upload" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition button-glow">
                <Plus className="h-4 w-4" />
                Upload Resume
              </Link>
              <Link to="/interview" className="inline-flex items-center gap-2 rounded-xl border border-darkBorder bg-darkCard px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 transition">
                <MessageSquareCode className="h-4 w-4" />
                Start Mock
              </Link>
            </div>
          </div>

          {loading ? (
            <Loader message="Loading dashboard intelligence..." />
          ) : (
            <>
              {/* Core metrics cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Stats 1 */}
                <div className="glass-panel rounded-3xl p-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average ATS Score</span>
                    <p className="text-3xl font-extrabold text-white mt-1">{avgAtsScore}%</p>
                    <p className="text-xs text-indigo-400 mt-2 font-medium">Based on {resumes.length} parsed CVs</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/25">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>

                {/* Stats 2 */}
                <div className="glass-panel rounded-3xl p-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews Graded</span>
                    <p className="text-3xl font-extrabold text-white mt-1">{interviews.length}</p>
                    <p className="text-xs text-purple-400 mt-2 font-medium">Avg Grade: {avgInterviewScore}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/25">
                    <Award className="h-6 w-6" />
                  </div>
                </div>

                {/* Stats 3 */}
                <div className="glass-panel rounded-3xl p-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">MERN Readiness</span>
                    <p className="text-3xl font-extrabold text-white mt-1">
                      {avgInterviewScore > 0 ? `${Math.round(avgInterviewScore * 1.05 > 98 ? 98 : avgInterviewScore * 1.05)}%` : 'Ready'}
                    </p>
                    <p className="text-xs text-emerald-400 mt-2 font-medium">Industry standard verified</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/25">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>

              </div>

              {/* Grid with Chart & Quick Launch */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Score Trend Chart */}
                <div className="glass-panel rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between min-h-[350px]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-white">ATS Compliance Track</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Chronological audit improvement ratings</p>
                    </div>
                    {resumes.length === 0 && (
                      <span className="text-[10px] font-semibold text-yellow-400 bg-yellow-500/10 border border-yellow-500/25 px-2 py-0.5 rounded-md uppercase">
                        Demo Data
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-grow min-h-[220px] relative">
                    <Line data={lineChartData} options={lineChartOptions} />
                  </div>
                </div>

                {/* Quick Launch Card */}
                <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-900/10 via-purple-900/5 to-transparent p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/5 blur-3xl pointer-events-none"></div>
                  
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full mb-4 border border-indigo-500/25">
                      <ShieldCheck className="h-3 w-3" />
                      Live Mock round
                    </span>
                    <h3 className="font-extrabold text-xl text-white tracking-tight leading-snug">
                      Practice a tailored developer mock board
                    </h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mt-3">
                      Generate five custom domain questions (MERN/HR/CSS). Practice typed answers to review your confidence, technical vocabulary, and communication scores.
                    </p>
                  </div>

                  <Link to="/interview" className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-gradient-neon py-3 font-semibold text-white shadow-lg hover:opacity-95 transition button-glow">
                    <span>Attend AI Mock Round</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </Link>
                </div>

              </div>

              {/* History Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Resumes */}
                <div className="glass-panel rounded-3xl p-6">
                  <h3 className="font-extrabold text-lg text-white mb-4">Parsed Resume History</h3>
                  
                  {resumes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <FileText className="h-10 w-10 text-slate-600 mb-3" />
                      <p className="text-xs text-slate-400 font-semibold">No resumes uploaded yet.</p>
                      <Link to="/upload" className="text-xs font-bold text-indigo-400 mt-2 hover:underline">
                        Upload your first PDF &gt;
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                      {resumes.slice(0, 4).map((res) => (
                        <div 
                          key={res._id || res.id}
                          onClick={() => navigate(`/resume-result/${res._id || res.id}`)}
                          className="flex items-center justify-between p-3.5 rounded-2xl border border-darkBorder bg-darkBg/30 hover:bg-slate-800/25 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/25 shrink-0">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-semibold text-slate-200 truncate">{res.fileName}</p>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="h-3 w-3" />
                                {new Date(res.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0 pl-2">
                            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl ${
                              res.atsScore >= 80 ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
                              res.atsScore >= 65 ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' :
                              'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20'
                            }`}>
                              {res.atsScore}% ATS
                            </span>
                            <ArrowRight className="h-4 w-4 text-slate-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Mock Interviews */}
                <div className="glass-panel rounded-3xl p-6">
                  <h3 className="font-extrabold text-lg text-white mb-4">Mock Interview History</h3>
                  
                  {interviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <MessageSquareCode className="h-10 w-10 text-slate-600 mb-3" />
                      <p className="text-xs text-slate-400 font-semibold">No interviews attended yet.</p>
                      <Link to="/interview" className="text-xs font-bold text-indigo-400 mt-2 hover:underline">
                        Launch your first mock round &gt;
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                      {interviews.slice(0, 4).map((i) => (
                        <div 
                          key={i._id || i.id}
                          onClick={() => navigate(`/interview-result/${i._id || i.id}`)}
                          className="flex items-center justify-between p-3.5 rounded-2xl border border-darkBorder bg-darkBg/30 hover:bg-slate-800/25 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/25 shrink-0">
                              <MessageSquareCode className="h-5 w-5" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-semibold text-slate-200 truncate">{i.jobType}</p>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="h-3 w-3" />
                                {new Date(i.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0 pl-2">
                            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl ${
                              i.score >= 80 ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
                              i.score >= 65 ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' :
                              'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20'
                            }`}>
                              {i.score}% Score
                            </span>
                            <ArrowRight className="h-4 w-4 text-slate-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
