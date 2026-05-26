import React, { useState } from 'react';
import { DealerScores } from '../types';
import { Award, Sliders, CheckSquare, Target } from 'lucide-react';

interface ScorecardTableProps {
  clientName: string;
  competitorName: string;
  clientScores: DealerScores;
  competitorScores: DealerScores;
  onUpdateScores: (dealer: 'client' | 'competitor', category: keyof DealerScores, score: number) => void;
}

export default function ScorecardTable({
  clientName,
  competitorName,
  clientScores,
  competitorScores,
  onUpdateScores,
}: ScorecardTableProps) {
  const [showSliders, setShowSliders] = useState(false);

  const categories: { key: keyof DealerScores; label: string }[] = [
    { key: 'responseSpeed', label: 'Response Speed SLA' },
    { key: 'autoEmailQuality', label: 'Auto Email Content Quality' },
    { key: 'personalEmailQuality', label: 'Personal Email Quality' },
    { key: 'textQuality', label: 'Text Message Content Quality' },
    { key: 'callResponse', label: 'Phone Call Connection Audit' },
  ];

  const getScoreColorClass = (score: number) => {
    if (score >= 7) return 'text-emerald-400';
    if (score >= 4) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBgClass = (score: number) => {
    if (score >= 7) return 'bg-emerald-950/20 border-emerald-500/25';
    if (score >= 4) return 'bg-amber-950/20 border-amber-500/25';
    return 'bg-red-950/20 border-red-500/25';
  };

  const calculateTotal = (scores: DealerScores) => {
    return (
      (scores.responseSpeed || 0) +
      (scores.autoEmailQuality || 0) +
      (scores.personalEmailQuality || 0) +
      (scores.textQuality || 0) +
      (scores.callResponse || 0)
    );
  };

  const clientTotal = calculateTotal(clientScores);
  const competitorTotal = calculateTotal(competitorScores);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 animate-pulse" />
            Deterministic Performance Appraisal Matrix
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Deterministic evaluation scores mapped across core communication disciplines.
          </p>
        </div>

        <button
          onClick={() => setShowSliders(!showSliders)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
            showSliders
              ? 'bg-[#FD5900] text-white border-transparent'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          {showSliders ? 'Hide Scoring Sliders' : 'Fine-Tune Scores'}
        </button>
      </div>

      {/* Grid Header */}
      <div className="hidden sm:grid grid-cols-3 gap-4 pb-3 border-b border-slate-150 font-mono text-[10px] uppercase font-bold text-[#64748b] tracking-wider text-center">
        <div className="text-left pl-4">Evaluation Metric</div>
        <div className="text-orange-600 font-bold">{clientName}</div>
        <div className="text-blue-600 font-bold">{competitorName}</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {categories.map((cat) => {
          const clientScore = clientScores[cat.key] || 0;
          const competitorScore = competitorScores[cat.key] || 0;

          return (
            <div key={cat.key} className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-center">
                {/* Category Name */}
                <div className="text-left font-bold text-base text-slate-850 pl-1 sm:pl-4">
                  {cat.label}
                </div>

                {/* Client Score Cell */}
                <div className="flex sm:justify-center items-center gap-2 justify-between">
                  <span className="text-xs font-mono font-medium text-orange-600 sm:hidden">
                    {clientName}:
                  </span>
                  <div className="font-mono text-xl font-extrabold flex items-center gap-1.5">
                    <span className={getScoreColorClass(clientScore)}>{clientScore}</span>
                    <span className="text-xs text-slate-400">/10</span>
                    {clientScore > competitorScore && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold font-mono tracking-wider">
                        WIN
                      </span>
                    )}
                  </div>
                </div>

                {/* Competitor Score Cell */}
                <div className="flex sm:justify-center items-center gap-2 justify-between">
                  <span className="text-xs font-mono font-medium text-blue-600 sm:hidden">
                    {competitorName}:
                  </span>
                  <div className="font-mono text-xl font-bold flex items-center gap-1.5">
                    <span className={getScoreColorClass(competitorScore)}>{competitorScore}</span>
                    <span className="text-xs text-slate-400">/10</span>
                    {competitorScore > clientScore && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold font-mono tracking-wider">
                        WIN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sliders in fine-tuning mode */}
              {showSliders && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 bg-[#f8fafc] p-3 rounded-lg border border-slate-200/85">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-orange-600">
                      <span>Adjust {clientName}</span>
                      <span className="font-mono">{clientScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={clientScore}
                      onChange={(e) => onUpdateScores('client', cat.key, parseInt(e.target.value, 10))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FD5900]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-blue-600">
                      <span>Adjust {competitorName}</span>
                      <span className="font-mono">{competitorScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={competitorScore}
                      onChange={(e) => onUpdateScores('competitor', cat.key, parseInt(e.target.value, 10))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FD5900]"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Totals Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 py-6 text-center font-bold border-t-2 border-slate-100 mt-4">
          <div className="text-left pl-1 sm:pl-4 text-base font-extrabold text-[#FD5900] flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#FD5900]" />
            Cumulative Performance Rating
          </div>

          <div className="flex sm:justify-center items-center justify-between">
            <span className="text-slate-400 text-xs uppercase font-mono sm:hidden">
              {clientName} Cumulative:
            </span>
            <div className="font-mono text-2xl font-extrabold">
              <span className={getScoreColorClass(Math.round(clientTotal / 5))}>{clientTotal}</span>
              <span className="text-sm text-slate-400 font-normal">/50</span>
              {clientTotal > competitorTotal && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full ml-2 inline-block shadow-sm">
                  LEADER
                </span>
              )}
            </div>
          </div>

          <div className="flex sm:justify-center items-center justify-between">
            <span className="text-slate-400 text-xs uppercase font-mono sm:hidden">
              {competitorName} Cumulative:
            </span>
            <div className="font-mono text-2xl font-extrabold font-bold">
              <span className={getScoreColorClass(Math.round(competitorTotal / 5))}>{competitorTotal}</span>
              <span className="text-sm text-slate-400 font-normal">/50</span>
              {competitorTotal > clientTotal && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full ml-2 inline-block shadow-sm">
                  LEADER
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
