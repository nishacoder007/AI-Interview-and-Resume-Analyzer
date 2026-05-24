import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Sparkles, 
  MessageSquareCode, 
  ArrowRight, 
  ArrowLeft, 
  Code, 
  Monitor, 
  Server, 
  UserCheck, 
  CheckCircle,
  HelpCircle,
  FileCheck
} from 'lucide-react';

const MockInterview = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stage, setStage] = useState('select'); // 'select' | 'loading' | 'active' | 'grading'
  const [jobType, setJobType] = useState('MERN Stack Developer');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // key: questionId, value: text
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const tracks = [
    {
      name: "MERN Stack Developer",
      desc: "Covers React Hooks, Virtual DOM, JWT Auth, Express middlewares, Mongoose query indexing, and event loop concurrency.",
      icon: Code,
      color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400"
    },
    {
      name: "Frontend Developer",
      desc: "Focuses on responsive CSS (Flexbox/Grid), React component lifecycles, routing patterns, and bundle assets optimization.",
      icon: Monitor,
      color: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400"
    },
    {
      name: "Backend Developer",
      desc: "Tests RESTful API design principles, Node event loops, DB normalization, Postgres vs NoSQL architectures, and integration tests.",
      icon: Server,
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400"
    },
    {
      name: "HR Round",
      desc: "Simulates behavioral conflicts resolution, STAR methodologies (Situation, Task, Action, Result), and five-year career tracks.",
      icon: UserCheck,
      color: "from-yellow-500/10 to-amber-500/10 border-yellow-500/20 text-yellow-400"
    }
  ];

  const handleStart = async () => {
    try {
      setStage('loading');
      console.log(`🤖 Triggering interview questions generation for role: "${jobType}"...`);
      const res = await API.post('/interview/start', { jobType });
      setQuestions(res.data.questions || []);
      setCurrentIdx(0);
      setAnswers({});
      setStage('active');
      toast.success('AI Interview board generated successfully!');
    } catch (error) {
      console.error('Fetch interview questions failed:', error);
      toast.error('Failed to generate customized interview questions.');
      setStage('select');
    }
  };

  const handleTextChange = (e) => {
    const qId = questions[currentIdx].id;
    setAnswers({
      ...answers,
      [qId]: e.target.value
    });
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleInterviewSubmit = async () => {
    const qId = questions[currentIdx].id;
    const currentAns = answers[qId] || '';

    // Check if at least some questions are answered
    const totalAnswered = Object.values(answers).filter(val => val.trim().length > 1).length;
    if (totalAnswered === 0 && currentAns.trim().length === 0) {
      toast.error('Please type a response before submitting the mock board.');
      return;
    }

    if (!window.confirm('Are you ready to submit your responses for AI grading? The system will evaluate your communication and technical accuracy.')) {
      return;
    }

    // Format payload
    const formattedAnswers = questions.map(q => ({
      questionId: q.id,
      userAnswerText: answers[q.id] || ''
    }));

    try {
      setStage('grading');
      console.log('📤 Submitting responses for dynamic neural grading...');
      
      const res = await API.post('/interview/answer', {
        jobType,
        questions,
        answers: formattedAnswers
      });

      console.log('✅ Grading success. Saved ID:', res.data._id || res.data.id);
      toast.success('Interview grading complete!');
      const newId = res.data._id || res.data.id;
      setTimeout(() => navigate(`/interview-result/${newId}`), 800);
    } catch (error) {
      console.error('Interview evaluation error:', error);
      toast.error('An error occurred during evaluation.');
      setStage('active');
    }
  };

  const activeQuestion = questions[currentIdx];
  const currentAnswerVal = activeQuestion ? (answers[activeQuestion.id] || '') : '';
  const wordCount = currentAnswerVal.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex min-h-screen bg-darkBg">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#121829', color: '#f8fafc', border: '1px solid #1f293d' }
      }} />

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col md:pl-64">
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Dynamic stages rendering */}
        <div className="flex-grow flex items-center justify-center p-6">
          
          {/* Stage 1: Select Track */}
          {stage === 'select' && (
            <main className="max-w-4xl w-full mx-auto space-y-6">
              
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto mb-4">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full mb-2 border border-indigo-500/25">
                  <Sparkles className="h-3 w-3" />
                  AI MOCK INTERVIEW BOARDS
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Practice Developer Interview Panels</h1>
                <p className="mt-2 text-sm font-semibold text-slate-400">
                  Select a domain specialty below to practice simulated questions. Ace coding explanations, behavioral rounds, and receive comprehensive grading scores.
                </p>
              </div>

              {/* Tracks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {tracks.map((track, idx) => {
                  const Icon = track.icon;
                  const isSelected = jobType === track.name;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setJobType(track.name)}
                      className={`glass-panel rounded-3xl p-6 cursor-pointer border transition-all duration-300 ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-500/[0.04] shadow-lg shadow-indigo-500/5' 
                          : 'hover:border-slate-700 bg-darkCard/40'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border bg-gradient-to-br ${track.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-100">{track.name}</h3>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium mt-2">{track.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Start Controls */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleStart}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-neon px-8 py-4 font-bold text-white shadow-xl hover:opacity-95 transition button-glow"
                >
                  <span>Generate Customized Questions</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

            </main>
          )}

          {/* Stage 2: Question formulations loader */}
          {stage === 'loading' && (
            <Loader message="AI is generating targeted technical interview questions..." />
          )}

          {/* Stage 3: Grading submission loader */}
          {stage === 'grading' && (
            <Loader message="OpenAI is auditing responses & calculating scorecard metrics..." />
          )}

          {/* Stage 4: Live Interview Screen */}
          {stage === 'active' && activeQuestion && (
            <main className="max-w-3xl w-full mx-auto space-y-6">
              
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-darkBorder pb-4">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {jobType} Mock round
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Question <span className="text-white">{currentIdx + 1}</span> of {questions.length}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-neon rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Box */}
              <div className="glass-panel rounded-3xl p-6 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-purple-500/5 blur-2xl pointer-events-none"></div>
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest">
                  <HelpCircle className="h-4 w-4" />
                  {activeQuestion.category} Question
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 leading-snug">
                  {activeQuestion.questionText}
                </h2>
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label htmlFor="answer-input" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Type your comprehensive response:
                  </label>
                  <span className={`text-[10px] font-bold ${wordCount > 35 ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {wordCount} words (recommend 30+)
                  </span>
                </div>
                
                <textarea
                  id="answer-input"
                  rows={6}
                  value={currentAnswerVal}
                  onChange={handleTextChange}
                  className="block w-full rounded-2xl border border-darkBorder bg-darkCard/60 p-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                  placeholder="Explain your approach, libraries used, and trade-offs. Detail is key for high ATS matched grading..."
                />
              </div>

              {/* Nav Controls */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={prevQuestion}
                  disabled={currentIdx === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-darkBorder bg-darkCard px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition button-glow"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleInterviewSubmit}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-neon px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95 transition button-glow"
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>Submit and Grade Round</span>
                  </button>
                )}
              </div>

            </main>
          )}

        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MockInterview;
