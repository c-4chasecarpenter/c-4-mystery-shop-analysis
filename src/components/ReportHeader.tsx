import React from 'react';

interface ReportHeaderProps {
  clientName: string;
  competitorName: string;
  analysisDate: string;
}

export default function ReportHeader({ clientName, competitorName, analysisDate }: ReportHeaderProps) {
  return (
    <div className="text-center mb-12 relative pb-8">
      <div className="font-mono text-[11px] tracking-[4px] uppercase text-[#FD5900] mb-2 font-bold select-none">
        C-4 Analytics Mystery Shop Report
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
        Lead Response Comparison
      </h1>
      <p className="text-slate-500 text-base md:text-lg mt-2 font-light">
        {clientName} <span className="text-slate-400 mx-2">vs</span> {competitorName} &middot; {analysisDate || 'Complete Performance Evaluation'}
      </p>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-[#FD5900] to-transparent" />
    </div>
  );
}
