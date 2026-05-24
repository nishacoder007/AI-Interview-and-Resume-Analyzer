import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { Upload, FileText, X, Sparkles, CheckCircle } from 'lucide-react';

const UploadResume = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      toast.error('Only PDF files are supported for automated ATS parsing.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('Resume size exceeds the 10MB limit.');
      return;
    }

    setFile(selectedFile);
    toast.success(`Loaded file: ${selectedFile.name}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select or drop a PDF resume first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setAnalyzing(true);
      console.log('📤 Transmitting resume PDF to backend server...');
      
      const res = await API.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ Analysis complete. ID:', res.data._id || res.data.id);
      toast.success('ATS Analysis generated successfully!');
      
      const newId = res.data._id || res.data.id;
      setTimeout(() => navigate(`/resume-result/${newId}`), 800);
    } catch (error) {
      console.error('Resume upload error:', error);
      toast.error(error.response?.data?.message || 'Error occurred while analyzing resume.');
      setAnalyzing(false);
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

        {analyzing ? (
          <div className="flex-grow flex items-center justify-center p-6">
            <Loader message="AI is reading and scoring your resume PDF..." fullScreen={false} />
          </div>
        ) : (
          <main className="flex-grow p-6 max-w-4xl w-full mx-auto space-y-6 flex flex-col justify-center">
            
            {/* Header info */}
            <div className="text-center max-w-2xl mx-auto mb-4">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">ATS Resume Analyzer</h1>
              <p className="mt-2 text-sm font-semibold text-slate-400">
                Instantly evaluate your resume compatibility. Simply upload your PDF CV below, and our model will parse key skills, grammar, and layouts.
              </p>
            </div>

            {/* Upload Area container */}
            <div className="glass-panel rounded-3xl p-8 max-w-2xl w-full mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none"></div>

              <form onSubmit={handleUploadSubmit} className="space-y-6">
                
                {/* Drag zone */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-12 px-6 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive 
                      ? 'border-indigo-500 bg-indigo-500/5' 
                      : file 
                        ? 'border-emerald-500/40 bg-emerald-500/5' 
                        : 'border-darkBorder bg-darkBg/30 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {file ? (
                    // Loaded state
                    <div className="space-y-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                        <CheckCircle className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100 truncate max-w-xs mx-auto">{file.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF File</p>
                      </div>
                      <button 
                        type="button"
                        onClick={removeFile}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove File
                      </button>
                    </div>
                  ) : (
                    // Empty drag state
                    <div className="space-y-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                        <Upload className="h-7 w-7 animate-bounce" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">Drag & drop your PDF resume here</p>
                        <p className="text-xs text-slate-500 mt-1">or click to browse local files (max 10MB)</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <Sparkles className="h-3 w-3" />
                        Automated parsing
                      </span>
                    </div>
                  )}
                </div>

                {/* Info parameters */}
                <div className="rounded-xl border border-darkBorder bg-darkBg/40 p-4 text-xs font-medium text-slate-500 leading-relaxed">
                  💡 **Pro Tip:** For the best assessment, ensure your PDF resume is text-based (not scanned images/photos). Our system evaluates structured section headers, vocabulary metrics, and technical keywords matching live job roles.
                </div>

                {/* CTA Submit */}
                <button
                  type="submit"
                  disabled={!file}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-lg hover:bg-indigo-500 transition button-glow disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span>Request ATS Scoring Report</span>
                </button>

              </form>
            </div>
            
          </main>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default UploadResume;
