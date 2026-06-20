import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { extractTextFromPdf } from '../utils/analysisEngine';

interface ResumeUploaderProps {
  onTextExtracted: (text: string, fileName: string) => void;
  onReset: () => void;
  isExtracted: boolean;
  extractedFileName: string | null;
}

export default function ResumeUploader({ 
  onTextExtracted, 
  onReset, 
  isExtracted, 
  extractedFileName 
}: ResumeUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;
    
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF format resume. Standard ATS systems prioritize PDF files.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parsedText = await extractTextFromPdf(file);
      if (!parsedText || parsedText.trim().length === 0) {
        throw new Error("We couldn't extract any legible text from this PDF. Please ensure it's not a scanned image PDF.");
      }
      onTextExtracted(parsedText, file.name);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred while parsing the resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
        1. Upload Resume
      </h2>

      <AnimatePresence mode="wait">
        {!isExtracted && !loading && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative rounded-xl border-2 border-dashed p-8 md:p-10 transition-all flex flex-col items-center justify-center text-center cursor-pointer select-none group min-h-[220px] ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50/50' 
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/30'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            id="resume-dropzone"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleChange}
              id="resume-file-input"
            />
            
            <div className={`p-4 rounded-full mb-4 transition-transform duration-300 ${
              isDragActive 
                ? 'bg-blue-100 text-blue-600 scale-110' 
                : 'bg-slate-100 text-slate-500 group-hover:scale-105'
            }`}>
              <UploadCloud className="h-8 w-8" />
            </div>

            <p className="font-semibold text-slate-700 text-sm mb-1">
              Drag & drop your PDF resume here
            </p>
            <p className="text-xs text-slate-400 max-w-[280px] mb-4">
              Standard PDF files containing raw text work best for ATS scanning algorithms.
            </p>

            <button
              type="button"
              className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 border border-transparent rounded-lg text-white font-sans transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick();
              }}
              id="resume-upload-button"
            >
              Browse Files
            </button>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border border-slate-200 bg-white p-8 md:p-10 flex flex-col items-center justify-center text-center min-h-[220px]"
          >
            <div className="relative flex items-center justify-center mb-4">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <p className="font-semibold text-slate-800 text-sm mb-1">
              Parsing PDF Text...
            </p>
            <p className="text-xs text-slate-400 max-w-xs">
              Our client-side engine is secure and works direct in your browser. Reading structures, lists, and character nodes.
            </p>
          </motion.div>
        )}

        {isExtracted && !loading && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-6 flex items-center justify-between gap-4 animate-fade-in"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 flex-shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-emerald-900 text-sm truncate max-w-[180px] sm:max-w-xs md:max-w-md lg:max-w-lg">
                  {extractedFileName}
                </p>
                <p className="text-xs text-emerald-700 font-medium">
                  Resume text imported successfully • Secure Client Sandbox
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete and Upload New Resume"
              id="delete-resume-button"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-lg bg-orange-50 border border-orange-100 text-orange-800 text-xs flex items-start gap-2.5"
          id="upload-error-message"
        >
          <AlertCircle className="h-4.5 w-4.5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Parsing Issue:</span> {error}
          </div>
        </motion.div>
      )}
    </div>
  );
}
