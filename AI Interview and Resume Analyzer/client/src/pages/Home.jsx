import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Sparkles, 
  FileText, 
  MessageSquareCode, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  Play
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const features = [
    {
      icon: FileText,
      title: "ATS Resume Analysis",
      desc: "Upload your PDF resume and receive a deep, real-time ATS optimization report with detailed suggestions, keyword analysis, and vocabulary checks.",
      color: "from-blue-500/10 to-indigo-500/10",
      iconColor: "text-blue-400"
    },
    {
      icon: MessageSquareCode,
      title: "AI Mock Interviews",
      desc: "Simulate pressure-filled technical rounds (MERN, Frontend, Backend) or behavioral HR rounds. Receive custom tailored questions and dynamic answers grading.",
      color: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-400"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      desc: "Track your scores over time. View progress line graphs, technical skill radars, and actionable areas of weakness using beautiful customized Chart.js components.",
      color: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-400"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-darkBg overflow-hidden">
      {/* Decorative backdrop blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none"></div>

      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto text-center">
          
          {/* Badge announcement */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-8 animate-pulse-slow">
            <Cpu className="h-3.5 w-3.5" />
            <span>Introducing MERN-Engine Mock Grader v2.0</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto font-sans">
            Supercharge Your Prep With <span className="text-gradient-purple">AI-Driven Insights</span> & Mock Interviews
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Elevate your career trajectory. Upload your resume to unlock detailed ATS matching, attend bespoke mock technical developer boards, and receive dynamic coaching comments.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/register"} 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-neon px-8 py-4 font-bold text-white shadow-xl shadow-indigo-500/10 hover:opacity-95 transition button-glow"
            >
              <span>{isAuthenticated ? 'Enter Dashboard' : 'Get Started Free'}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-darkBorder bg-darkCard/50 px-8 py-4 font-semibold text-slate-300 hover:text-white hover:bg-slate-800/40 transition"
            >
              <Play className="h-4 w-4" />
              <span>Explore Features</span>
            </a>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="mt-16 relative rounded-3xl border border-darkBorder/80 bg-darkCard/40 p-4 shadow-2xl backdrop-blur-md max-w-5xl mx-auto overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-transparent to-transparent z-10"></div>
            
            {/* Header control dots */}
            <div className="flex items-center gap-1.5 pb-4 border-b border-darkBorder/50">
              <div className="h-3 w-3 rounded-full bg-red-500/40"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500/40"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/40"></div>
              <div className="ml-4 text-xs font-semibold text-slate-500">https://elevateai.platform/dashboard</div>
            </div>

            {/* Mock Dashboard Grid Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left opacity-90">
              <div className="rounded-2xl border border-darkBorder bg-darkBg/60 p-5">
                <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Average ATS Score</span>
                <p className="mt-2 text-3xl font-extrabold text-white">82%</p>
                <div className="mt-3 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-neon rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div className="rounded-2xl border border-darkBorder bg-darkBg/60 p-5">
                <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Interviews Conducted</span>
                <p className="mt-2 text-3xl font-extrabold text-white">12,450+</p>
                <p className="text-xs font-semibold text-emerald-400 mt-2">↑ 24% Growth this month</p>
              </div>
              <div className="rounded-2xl border border-darkBorder bg-darkBg/60 p-5">
                <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Placement Success</span>
                <p className="mt-2 text-3xl font-extrabold text-white">94.8%</p>
                <p className="text-xs font-semibold text-indigo-400 mt-2">Validated by candidate returns</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-darkCard/25 border-y border-darkBorder px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Everything You Need to Ace Your Next Role
              </h2>
              <p className="mt-4 text-slate-400 font-medium">
                Our suite of premium, automated tools evaluates your resumes and answers with recruitment logic to output immediate coaching tips.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feat, index) => {
                const Icon = feat.icon;
                return (
                  <div 
                    key={index} 
                    className="group rounded-3xl border border-darkBorder bg-darkCard/40 p-8 hover:border-indigo-500/40 hover:bg-darkCard/60 transition-all duration-300"
                  >
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.color} border border-darkBorder mb-6`}>
                      <Icon className={`h-6 w-6 ${feat.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition duration-200">
                      {feat.title}
                    </h3>
                    <p className="mt-4 text-sm text-slate-400 font-medium leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust Badge */}
        <section id="about" className="py-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Optimized for MERN & modern technical recruitment pipelines
            </h2>
            <p className="mt-6 text-slate-400 font-medium leading-relaxed">
              Recruitment standards are shifting rapidly. Standard keyword matching is no longer sufficient. Our AI mock modules are tailored to stress-test your communication capacity and conceptual technical bounds to verify you can discuss structures comfortably in live developer interviews.
            </p>
            
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3 text-slate-300 text-sm font-semibold">
                <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>JWT secured platform cookies & local storage</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm font-semibold">
                <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>Dual database capability (MERN database + local offline fallback)</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm font-semibold">
                <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>Deterministic keyword scores matched with state evaluations</span>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-2xl pointer-events-none"></div>
            <div className="relative rounded-3xl border border-darkBorder bg-darkCard/60 p-8 text-left">
              <h4 className="text-lg font-bold text-white mb-4">MOCK INTERVIEW DEMO GRID</h4>
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-900/60 p-4 border border-darkBorder">
                  <p className="text-xs text-indigo-400 font-bold mb-1">MERN Stack Technical Question</p>
                  <p className="text-sm text-slate-300 font-semibold leading-relaxed">"How would you optimize slow-running mongoose queries?"</p>
                </div>
                <div className="rounded-xl bg-slate-900/60 p-4 border border-darkBorder opacity-75">
                  <p className="text-xs text-purple-400 font-bold mb-1">AI Evaluator Analysis</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">"Analyzing response vocabulary... Keywords found: [indexing, compound keys, explain() method, lean query execution]. Rating score: 92%."</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
