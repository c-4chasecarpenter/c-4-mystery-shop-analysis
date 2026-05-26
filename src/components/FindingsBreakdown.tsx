import React, { useState } from 'react';
import { DealershipData, Finding, ChannelFindings } from '../types';
import { Mail, MessageSquare, PhoneCall, Check, X, AlertCircle, Plus, Trash, Settings } from 'lucide-react';

interface FindingsBreakdownProps {
  client: DealershipData;
  competitor: DealershipData;
  onUpdateFindings: (dealer: 'client' | 'competitor', channel: keyof ChannelFindings, findings: Finding[]) => void;
}

export default function FindingsBreakdown({ client, competitor, onUpdateFindings }: FindingsBreakdownProps) {
  const [editingMode, setEditingMode] = useState(false);
  const [newFindingText, setNewFindingText] = useState('');
  const [newFindingType, setNewFindingType] = useState<'positive' | 'negative' | 'neutral'>('neutral');

  const channels: { key: keyof ChannelFindings; label: string; icon: any }[] = [
    { key: 'autoEmail', label: 'Automatic Email Analysis', icon: Mail },
    { key: 'personalEmail', label: 'Personal Email Outreach', icon: Mail },
    { key: 'textMessage', label: 'SMS text connection', icon: MessageSquare },
    { key: 'phoneCall', label: 'Outbound Voice outreach', icon: PhoneCall },
  ];

  const handleAddFinding = (dealer: 'client' | 'competitor', channel: keyof ChannelFindings) => {
    if (!newFindingText.trim()) return;
    const currentFindings = dealer === 'client' ? client.findings[channel] : competitor.findings[channel];
    const updated = [...currentFindings, { type: newFindingType, text: newFindingText.trim() }];
    onUpdateFindings(dealer, channel, updated);
    setNewFindingText('');
  };

  const handleRemoveFinding = (
    dealer: 'client' | 'competitor',
    channel: keyof ChannelFindings,
    index: number
  ) => {
    const currentFindings = dealer === 'client' ? client.findings[channel] : competitor.findings[channel];
    const updated = currentFindings.filter((_, i) => i !== index);
    onUpdateFindings(dealer, channel, updated);
  };

  const getWinnerScorePillClass = (clientScore: number, compScore: number, type: 'client' | 'competitor') => {
    if (type === 'client') {
      return clientScore >= compScore
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        : 'bg-red-50 text-red-600 border border-red-200';
    } else {
      return compScore >= clientScore
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        : 'bg-red-50 text-red-650 border border-red-200';
    }
  };

  return (
    <div className="space-y-8 mb-8">
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Granular Quality Audit Details</h3>
          <p className="text-xs text-slate-500 mt-0.5">Edit findings to calibrate message appraisals</p>
        </div>
        <button
          onClick={() => setEditingMode(!editingMode)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
            editingMode
              ? 'bg-[#FD5900] text-white border-transparent'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5 animate-spin-slow" />
          {editingMode ? 'Finish Adjustments' : 'Modify Findings'}
        </button>
      </div>

      {channels.map(({ key, label, icon: Icon }) => {
        // Retrieve dynamic score from dealership model corresponding to current channel type
        const getScores = (chKey: string) => {
          if (chKey === 'autoEmail') return { cl: client.scores.autoEmailQuality, cp: competitor.scores.autoEmailQuality };
          if (chKey === 'personalEmail') return { cl: client.scores.personalEmailQuality, cp: competitor.scores.personalEmailQuality };
          if (chKey === 'textMessage') return { cl: client.scores.textQuality, cp: competitor.scores.textQuality };
          return { cl: client.scores.callResponse, cp: competitor.scores.callResponse };
        };

        const sc = getScores(key);

        return (
          <div key={key} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-6 gap-4">
              <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                <Icon className="w-5 h-5 text-[#FD5900]" />
                {label}
              </h4>

              {/* Score comparisons right floated */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-mono tracking-wider font-bold rounded-lg px-2.5 py-1 ${getWinnerScorePillClass(sc.cl, sc.cp, 'client')}`}>
                  {client.dealershipName}: {sc.cl}/10
                </span>
                <span className={`text-[10px] uppercase font-mono tracking-wider font-bold rounded-lg px-2.5 py-1 ${getWinnerScorePillClass(sc.cl, sc.cp, 'competitor')}`}>
                  {competitor.dealershipName}: {sc.cp}/10
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Card */}
              <div className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-5">
                <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-red-600 mb-4 pb-2 border-b border-slate-200/60 flex justify-between items-center">
                  <span>C-4 Client &middot; {client.dealershipName}</span>
                  <span className="text-slate-400">{client.channels[key === 'textMessage' ? 'text' : key]?.minutesElapsed} mins</span>
                </div>

                <div className="space-y-4">
                  {(client.findings[key] || []).map((finding, index) => (
                    <div key={index} className="flex gap-3 justify-between items-start group">
                      <div className="flex gap-3 items-start">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                          finding.type === 'positive' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          finding.type === 'negative' ? 'bg-red-50 text-red-600 border border-red-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {finding.type === 'positive' ? <Check className="w-2.5 h-2.5" /> :
                           finding.type === 'negative' ? <X className="w-2.5 h-2.5" /> : '!'}
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed select-text">
                          {finding.text}
                        </p>
                      </div>

                      {editingMode && (
                        <button
                          onClick={() => handleRemoveFinding('client', key, index)}
                          className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 rounded-md flex-shrink-0"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  {editingMode && (
                    <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3 bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Add Client Finding:</span>
                        <div className="flex gap-1.5 ml-auto">
                          {(['positive', 'negative', 'neutral'] as const).map(t => (
                            <button
                              key={t}
                              onClick={() => setNewFindingType(t)}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize font-bold transition ${
                                newFindingType === t
                                  ? t === 'positive' ? 'bg-emerald-600 text-white' : t === 'negative' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Draft specialized analyst assessment..."
                          value={newFindingText}
                          onChange={e => setNewFindingText(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 focus:outline-none focus:border-[#FD5900] focus:ring-1 focus:ring-[#FD5900]/20"
                        />
                        <button
                          onClick={() => handleAddFinding('client', key)}
                          className="px-2 py-1.5 bg-[#FD5900] text-white rounded-md hover:bg-[#ff6e1d] hover:scale-105 active:scale-95 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Competitor Card */}
              <div className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-5">
                <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-blue-600 mb-4 pb-2 border-b border-slate-200/60 flex justify-between items-center">
                  <span>Competitor &middot; {competitor.dealershipName}</span>
                  <span className="text-slate-400">{competitor.channels[key === 'textMessage' ? 'text' : key]?.minutesElapsed} mins</span>
                </div>

                <div className="space-y-4">
                  {(competitor.findings[key] || []).map((finding, index) => (
                    <div key={index} className="flex gap-3 justify-between items-start group">
                      <div className="flex gap-3 items-start">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                          finding.type === 'positive' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          finding.type === 'negative' ? 'bg-red-50 text-red-650 border border-red-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {finding.type === 'positive' ? <Check className="w-2.5 h-2.5" /> :
                           finding.type === 'negative' ? <X className="w-2.5 h-2.5" /> : '!'}
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed select-text">
                          {finding.text}
                        </p>
                      </div>

                      {editingMode && (
                        <button
                          onClick={() => handleRemoveFinding('competitor', key, index)}
                          className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 rounded-md flex-shrink-0"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  {editingMode && (
                    <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3 bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Add Competitor Finding:</span>
                        <div className="flex gap-1.5 ml-auto">
                          {(['positive', 'negative', 'neutral'] as const).map(t => (
                            <button
                              key={t}
                              onClick={() => setNewFindingType(t)}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize font-bold transition ${
                                newFindingType === t
                                  ? t === 'positive' ? 'bg-emerald-600 text-white' : t === 'negative' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Draft specialized analyst assessment..."
                          value={newFindingText}
                          onChange={e => setNewFindingText(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 focus:outline-none focus:border-[#FD5900] focus:ring-1 focus:ring-[#FD5900]/20"
                        />
                        <button
                          onClick={() => handleAddFinding('competitor', key)}
                          className="px-2 py-1.5 bg-[#FD5900] text-white rounded-md hover:bg-[#ff6e1d] hover:scale-105 active:scale-95 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
