import React from 'react';
import { DealershipData } from '../types';
import { 
  Clock, 
  Check, 
  X, 
  Mail, 
  Phone, 
  MessageSquare, 
  Award, 
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface ResponseSpeedBarsProps {
  client: DealershipData;
  competitor: DealershipData;
}

interface SymmetricalGaugeProps {
  minutes: number;
  target: number;
  passed: boolean;
  dealerName: string;
  isClient: boolean;
}

const SymmetricalGauge = ({ minutes, target, passed, dealerName, isClient }: SymmetricalGaugeProps) => {
  const strokeColor = passed ? 'stroke-emerald-500' : 'stroke-rose-500';
  
  return (
    <div className="flex flex-col items-center bg-slate-50/50 border border-slate-100 rounded-xl p-4 text-center w-full transition duration-200">
      <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
        <span className="truncate max-w-[125px]" title={dealerName}>{dealerName}</span>
        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
          isClient ? 'bg-orange-50 text-[#FD5900] border border-orange-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {isClient ? 'Client' : 'Competitor'}
        </span>
      </span>

      {/* Circle Stopwatch Dial */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="26"
            className="stroke-slate-200 fill-none"
            strokeWidth="3.5"
          />
          <circle
            cx="32"
            cy="32"
            r="26"
            className={`${strokeColor} fill-none transition-all duration-1000 ease-out`}
            strokeWidth="3.5"
            strokeDasharray="163"
            strokeDashoffset={163 - (163 * Math.min(minutes, target)) / target}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">
            {minutes}
          </span>
          <span className="text-[9px] font-mono font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
            Min
          </span>
        </div>
      </div>

      <span className={`inline-flex items-center gap-1 font-mono text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase mt-3.5 tracking-wider ${
        passed 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
          : 'bg-red-50 text-red-600 border-red-150'
      }`}>
        {passed ? (
          <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3px]" />
        ) : (
          <X className="w-2.5 h-2.5 text-red-500 stroke-[3px]" />
        )}
        {passed ? 'Met SLA' : 'Missed'}
      </span>
    </div>
  );
};

export default function ResponseSpeedBars({ client, competitor }: ResponseSpeedBarsProps) {
  
  const channels = [
    {
      id: 'text',
      name: 'Text Message Outreach',
      icon: <MessageSquare className="w-4 h-4 text-[#FD5900]" />,
      targetVal: 5,
      clientData: client.channels.text,
      compData: competitor.channels.text,
    },
    {
      id: 'autoEmail',
      name: 'CRM Auto Email',
      icon: <Mail className="w-4 h-4 text-emerald-600" />,
      targetVal: 5,
      clientData: client.channels.autoEmail,
      compData: competitor.channels.autoEmail,
    },
    {
      id: 'phoneCall',
      name: 'Outbound Rep Phone Call',
      icon: <Phone className="w-4 h-4 text-blue-600" />,
      targetVal: 20,
      clientData: client.channels.phoneCall,
      compData: competitor.channels.phoneCall,
    },
    {
      id: 'personalEmail',
      name: 'Personal Rep Email Outreach',
      icon: <Mail className="w-4 h-4 text-indigo-600" />,
      targetVal: 20,
      clientData: client.channels.personalEmail,
      compData: competitor.channels.personalEmail,
    },
  ];

  // Calculate Overall wins / speed stats
  let clientWinsCount = 0;
  let competitorWinsCount = 0;
  let totalTies = 0;
  let clientSlaMetCount = 0;
  let compSlaMetCount = 0;

  channels.forEach(ch => {
    if (ch.clientData.minutesElapsed < ch.compData.minutesElapsed) {
      clientWinsCount++;
    } else if (ch.clientData.minutesElapsed > ch.compData.minutesElapsed) {
      competitorWinsCount++;
    } else {
      totalTies++;
    }

    if (ch.clientData.passedTarget) clientSlaMetCount++;
    if (ch.compData.passedTarget) compSlaMetCount++;
  });

  const overallWinnerName = clientWinsCount > competitorWinsCount 
    ? client.dealershipName 
    : (competitorWinsCount > clientWinsCount ? competitor.dealershipName : 'Draw');

  return (
    <div className="space-y-8" id="response-speed-head-to-head">
      {/* Dynamic Summary ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        {/* Accent light shine */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FD5900]/15 to-transparent rounded-full filter blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <span className="text-xs font-mono font-bold text-[#FD5900] uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 fill-[#FD5900]" />
              Response Speed Champion
            </span>
            <h3 className="text-2xl font-extrabold tracking-tight text-white mt-1">
              {overallWinnerName === 'Draw' ? (
                <span>Dealership Speed Tie</span>
              ) : (
                <span>🏆 Winner: {overallWinnerName}</span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-lg">
              Evaluated on lead response timing across outbound call, auto-CRM responder, text channels, and personal correspondence.
            </p>
          </div>

          <div className="flex gap-4 self-stretch md:self-auto sm:grid-cols-2 md:flex">
            {/* Client Summary Box */}
            <div className="flex-1 bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 text-center px-6">
              <div className="text-xs text-slate-400 font-mono">Client Met SLA</div>
              <div className="text-xl font-extrabold text-[#FD5900] mt-1">{clientSlaMetCount} / 4</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Channels Met</div>
            </div>
            
            {/* Competitor Summary Box */}
            <div className="flex-1 bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 text-center px-6">
              <div className="text-xs text-slate-400 font-mono">Competitor Met SLA</div>
              <div className="text-xl font-extrabold text-blue-400 mt-1">{compSlaMetCount} / 4</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Channels Met</div>
            </div>
          </div>
        </div>
      </div>

      {/* List / Grid of comparative channel cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((ch) => {
          const clientVal = ch.clientData.minutesElapsed;
          const compVal = ch.compData.minutesElapsed;
          
          const isClientWinner = clientVal < compVal;
          const isTie = clientVal === compVal;
          const diff = Math.abs(clientVal - compVal);
          
          let bannerText = '';
          let bannerClass = '';
          if (isTie) {
            bannerText = `Exact Tie: both responded in exactly ${clientVal} minutes.`;
            bannerClass = 'bg-slate-50 border-slate-200 text-slate-600';
          } else if (isClientWinner) {
            const ratio = clientVal > 0 ? (compVal / clientVal) : compVal;
            const ratioText = ratio >= 2 ? ` (${ratio.toFixed(1)}x faster)` : '';
            bannerText = `⚡ ${client.dealershipName} responded ${diff} min quicker than competitor${ratioText}.`;
            bannerClass = 'bg-orange-50/70 border-orange-100 text-orange-800';
          } else {
            const ratio = compVal > 0 ? (clientVal / compVal) : clientVal;
            const ratioText = ratio >= 2 ? ` (${ratio.toFixed(1)}x faster)` : '';
            bannerText = `⚡ ${competitor.dealershipName} responded ${diff} min quicker than Client${ratioText}.`;
            bannerClass = 'bg-blue-50/70 border-blue-100 text-blue-800';
          }

          return (
            <div key={ch.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition flex flex-col justify-between">
              {/* Card Header */}
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                      {ch.icon}
                    </span>
                    <span className="font-bold text-slate-800 text-md">{ch.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 leading-relaxed uppercase">
                    SLA &le; {ch.targetVal}m
                  </span>
                </div>

                {/* Symmetrical Dual Gauges Layout */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <SymmetricalGauge 
                    minutes={clientVal}
                    target={ch.targetVal}
                    passed={ch.clientData.passedTarget}
                    dealerName={client.dealershipName}
                    isClient={true}
                  />
                  <SymmetricalGauge 
                    minutes={compVal}
                    target={ch.targetVal}
                    passed={ch.compData.passedTarget}
                    dealerName={competitor.dealershipName}
                    isClient={false}
                  />
                </div>
              </div>

              {/* Victory Race banner footer */}
              <div className={`mt-2 border rounded-xl p-3 flex items-center gap-2 text-xs font-semibold leading-relaxed shadow-inner ${bannerClass}`}>
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                <span>{bannerText}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SLA Target Note */}
      <div className="bg-slate-50/50 border border-slate-150 rounded-xl p-4 flex gap-3 text-xs text-slate-500 leading-relaxed items-start">
        <AlertCircle className="w-4 h-4 text-[#FD5900] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 block mb-0.5">About Comparative Timing Gaps</span>
          These visual indicators illustrate exactly where response timelines fell within target boundaries. Bar volume formats are purposely omitted as an overextended time frame results in a larger bar, which deceptively awards visual dominance to slower response teams. The gauges track exact durations against the targeted SLA limit.
        </div>
      </div>
    </div>
  );
}
