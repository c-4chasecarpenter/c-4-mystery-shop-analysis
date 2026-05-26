import React, { useState } from 'react';
import { sampleMysteryShopReport } from '../sampleData';
import { MysteryShopReport } from '../types';
import { AlertCircle, FileText, Upload, Sparkles, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

interface LeadInputManagerProps {
  onAnalysisComplete: (data: MysteryShopReport) => void;
  currentReport: MysteryShopReport | null;
}

export default function LeadInputManager({ onAnalysisComplete, currentReport }: LeadInputManagerProps) {
  const [clientName, setClientName] = useState('');
  const [competitorName, setCompetitorName] = useState('');

  const [clientPdfBase64, setClientPdfBase64] = useState<string>('');
  const [clientPdfName, setClientPdfName] = useState<string>('');
  const [competitorPdfBase64, setCompetitorPdfBase64] = useState<string>('');
  const [competitorPdfName, setCompetitorPdfName] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePdfUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'client' | 'competitor'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported for direct document ingestion.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract only the base64 part
      const base64Content = result.split(',')[1];
      if (type === 'client') {
        setClientPdfBase64(base64Content);
        setClientPdfName(file.name);
      } else {
        setCompetitorPdfBase64(base64Content);
        setCompetitorPdfName(file.name);
      }
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to load PDF file.');
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);

    const logs = [
      "Initializing C-4 Analytics Ingestion Environment...",
      "Connecting securely to Gemini 3.5-Flash retail cognitive workspace...",
      "Extracting dealership parameters & submission metadata...",
      "Aligning response channels: text timestamps & email dates...",
      "Calculating response speeds against target 5 & 20 min goal targets...",
      "Scoring dealer interactions using deterministic C-4 rubrics...",
      "Formulating custom granular channel findings (positive & negative)...",
      "Drafting priority-based takeaway tiles for client coaching...",
      "Compiling final structured JSON comparison schema..."
    ];

    let logIndex = 0;
    setStatusText(logs[0]);
    const logInterval = setInterval(() => {
      if (logIndex < logs.length - 1) {
        logIndex++;
        setStatusText(logs[logIndex]);
      }
    }, 1800);

    if (!clientName.trim()) {
      clearInterval(logInterval);
      setLoading(false);
      setError("Please specify the C-4 Client Dealership Name.");
      return;
    }

    if (!competitorName.trim()) {
      clearInterval(logInterval);
      setLoading(false);
      setError("Please specify the Primary Peer Competitor Name.");
      return;
    }

    const clientInput = clientPdfBase64;
    const competitorInput = competitorPdfBase64;

    if (!clientInput) {
      clearInterval(logInterval);
      setLoading(false);
      setError(`Please upload a Mystery Shop PDF for ${clientName}`);
      return;
    }

    if (!competitorInput) {
      clearInterval(logInterval);
      setLoading(false);
      setError(`Please upload a Mystery Shop PDF for ${competitorName}`);
      return;
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          competitorName,
          clientType: 'pdf',
          competitorType: 'pdf',
          clientInput,
          competitorInput
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred during report evaluation.");
      }

      clearInterval(logInterval);
      setLoading(false);
      onAnalysisComplete(data);
    } catch (err: any) {
      clearInterval(logInterval);
      setLoading(false);
      setError(err.message || "An unexpected network or extraction error has occurred.");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-805 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FD5900]" />
          C-4 Analytics Client and Competitor Information
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter C-4 Client and Competitor names and upload Mystery Shop PDF for each
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Client Block */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
              C-4 Client Dealership Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. George Chevrolet"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#FD5900] focus:ring-1 focus:ring-[#FD5900]/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
              Mystery Shop PDF
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer relative h-44 transition-all duration-300 ${
              clientPdfName 
                ? 'border-emerald-300 bg-emerald-50/30 shadow-inner' 
                : 'border-slate-200 bg-slate-50/50 hover:border-[#FD5900]'
            }`}>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handlePdfUpload(e, 'client')}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {clientPdfName ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2 animate-pulse" />
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wide mb-1 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    UPLOAD CONFIRMED
                  </div>
                  <p className="text-xs font-bold text-slate-700 max-w-[200px] truncate text-center" title={clientPdfName}>
                    {clientPdfName}
                  </p>
                  <p className="text-[10px] text-slate-450 text-center mt-1">
                    Click or Drag to replace file
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700 mb-1">
                    Upload Client Mystery Shop PDF
                  </p>
                  <p className="text-[10px] text-slate-450 text-center max-w-[200px]">
                    Drag & drop PDF directly to parse on C-4 server
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Competitor Block */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
              Primary Peer Competitor Name
            </label>
            <input
              type="text"
              value={competitorName}
              onChange={(e) => setCompetitorName(e.target.value)}
              placeholder="e.g. Apex Chevrolet Group"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#FD5900] focus:ring-1 focus:ring-[#FD5900]/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
              Mystery Shop PDF
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer relative h-44 transition-all duration-300 ${
              competitorPdfName 
                ? 'border-emerald-300 bg-emerald-50/30 shadow-inner' 
                : 'border-slate-200 bg-slate-50/50 hover:border-[#FD5900]'
            }`}>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handlePdfUpload(e, 'competitor')}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {competitorPdfName ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2 animate-pulse" />
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wide mb-1 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    UPLOAD CONFIRMED
                  </div>
                  <p className="text-xs font-bold text-slate-700 max-w-[200px] truncate text-center" title={competitorPdfName}>
                    {competitorPdfName}
                  </p>
                  <p className="text-[10px] text-slate-450 text-center mt-1">
                    Click or Drag to replace file
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700 mb-1">
                    Upload Competitor Mystery Shop PDF
                  </p>
                  <p className="text-[10px] text-slate-450 text-center max-w-[200px]">
                    Drag & drop PDF directly to parse on C-4 server
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200/80 rounded-lg p-3 mb-4 text-xs text-red-650 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-6 py-3 bg-[#FD5900] hover:bg-[#ff6e1d] text-white font-bold rounded-lg text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-orange-100 transition active:scale-95 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing: {statusText}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Generate Mystery Shop Comparison Report</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
