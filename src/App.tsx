import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Sparkles, 
  RefreshCw, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import ResumeUploader from './components/ResumeUploader';
import JobDescriptionInput from './components/JobDescriptionInput';
import AtsResultDashboard from './components/AtsResultDashboard';
import { analyzeResume } from './utils/analysisEngine';
import { AnalysisResult } from './types';

export default function App() {
  const [resumeText, setResumeText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResumeTextExtracted = (text: string, name: string) => {
    setResumeText(text);
    setFileName(name);
    setError(null);
  };

  const handleResetResume = () => {
    setResumeText('');
    setFileName('');
    setResult(null);
    setError(null);
  };

  const handleRunAnalysis = () => {
    if (!resumeText) {
      setError("Please upload an primary resume PDF file in Step 1 first.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste a target Job Description or select a quick demo preset in Step 2.");
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    // Simulate standard parser and keywords mapping feedback delay for premium UX feel
    setTimeout(() => {
      try {
        const analysisData = analyzeResume(fileName, resumeText, jobDescription);
        setResult(analysisData);
      } catch (err) {
        console.error(err);
        setError("Our local analysis engine encountered an unexpected structure error. Please try another file.");
      } finally {
        setIsAnalyzing(false);
      }
    }, 1200);
  };

  const handleGoBack = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between font-sans">
      
      {/* Primary Top Header Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/10 flex-shrink-0">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg text-slate-950 tracking-tight">
                  ATS SmartScanner
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-700 rounded border border-blue-100 uppercase tracking-widest leading-none">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium font-sans">
                Professional Resume ATS Optimization & Audit Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-500 font-medium font-sans">
            <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1.2 rounded-lg border border-emerald-100/50 text-emerald-850">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              100% Client-Side • Decoupled Secure Sandbox
            </div>
          </div>

        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
        
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="inputs-stage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              
              {/* Marketing Intros Panel */}
              <div className="rounded-2xl border border-blue-100 bg-white p-5 md:p-6 flex flex-col sm:flex-row gap-5 items-start relative overflow-hidden shadow-sm">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 w-36 h-36 bg-gradient-to-br from-blue-100/30 to-slate-100/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0">
                  <Activity className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-snug mb-1">
                    Free AI-Powered ATS Score Audit
                  </h1>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl font-sans">
                    Instantly check if your resume of choice will pass automated Applicant Tracking Systems. Our fully client-side algorithms extract PDF text strings, tokenizes target phrases, checks layout structure boundaries, and matches critical technical skills directly in your browser. <span className="font-semibold text-blue-600">No servers, no tracking, complete privacy, completely free.</span>
                  </p>
                </div>
              </div>

              {/* Steps Layout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Step 1 Zone */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
                  <ResumeUploader
                    onTextExtracted={handleResumeTextExtracted}
                    onReset={handleResetResume}
                    isExtracted={!!resumeText}
                    extractedFileName={fileName}
                  />
                </div>

                {/* Step 2 Zone */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
                  <JobDescriptionInput
                    value={jobDescription}
                    onChange={setJobDescription}
                  />
                </div>
              </div>

              {/* Global Validation Message Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-900 text-xs flex items-start gap-3"
                  id="global-validation-alert"
                >
                  <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Application Validation Error</span>
                    {error}
                  </div>
                </motion.div>
              )}

              {/* Analysis Trigger Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 md:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm mt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg hidden sm:block flex-shrink-0">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Ready to audit alignment?</h4>
                    <p className="text-[11px] text-slate-400">
                      Calculates Keyword Match Ratio, Structural Headers coverage, and File Formatting attributes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-bold font-sans rounded-xl text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 min-w-[200px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 cursor-pointer select-none transition-all"
                  id="trigger-analysis-btn"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      Analyzing Keywords...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-white" />
                      Analyze Resume
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="results-stage"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm animate-fade-in"
            >
              <AtsResultDashboard
                result={result}
                onGoBack={handleGoBack}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Non-Negotiable Layout Footer */}
      <footer className="w-full border-t border-slate-200 bg-white mt-auto py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Developer Details & Email Placeholder */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">
                Priyansh
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500 font-medium font-sans">
                Expert Frontend Engineer
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium font-mono" id="developer-email-badge">
              priyanshg753@gmail.com
            </div>
          </div>

          {/* Non-Negotiable "Built for Digital Heroes" Button */}
          <div className="flex items-center">
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-sans text-xs font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-950 shadow-md shadow-slate-950/10 cursor-pointer select-none transition-all group border border-transparent"
              id="built-for-digital-heroes-btn"
            >
              Built for Digital Heroes
              <span className="text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
