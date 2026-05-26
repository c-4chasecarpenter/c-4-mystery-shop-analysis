import React from 'react';
import { DealershipData, ResponseQuality } from '../types';

interface ResponseQualityAnalysisProps {
  client: DealershipData;
  competitor: DealershipData;
}

const defaultClientQuality: ResponseQuality = {
  autoEmailPersonalization: "Strong",
  autoEmailVehicleDetail: "VIN + Price",
  autoEmailCtaQuality: "2 CTAs",
  textPersonalization: "None",
  textContentValue: "Opt-in Only",
  personalEmailReceived: "Not in 60 min",
  grammarSpelling: "Minor Issues",
  overallSpeedRating: "FAIL"
};

const defaultCompetitorQuality: ResponseQuality = {
  autoEmailPersonalization: "Generic",
  autoEmailVehicleDetail: "None",
  autoEmailCtaQuality: "Inventory Link",
  textPersonalization: "Name + Rep",
  textContentValue: "Engaging",
  personalEmailReceived: "5 min",
  grammarSpelling: "Clean",
  overallSpeedRating: "PASS"
};

const rows = [
  { label: "Auto Email Personalization", key: "autoEmailPersonalization" as keyof ResponseQuality },
  { label: "Auto Email Vehicle Detail", key: "autoEmailVehicleDetail" as keyof ResponseQuality },
  { label: "Auto Email CTA Quality", key: "autoEmailCtaQuality" as keyof ResponseQuality },
  { label: "Text Personalization", key: "textPersonalization" as keyof ResponseQuality },
  { label: "Text Content Value", key: "textContentValue" as keyof ResponseQuality },
  { label: "Personal Email Received", key: "personalEmailReceived" as keyof ResponseQuality },
  { label: "Grammar / Spelling", key: "grammarSpelling" as keyof ResponseQuality },
  { label: "Overall Speed Rating", key: "overallSpeedRating" as keyof ResponseQuality },
];

const getValueColor = (val: string) => {
  const norm = val.toLowerCase().trim();
  if (
    norm === 'strong' ||
    norm === 'vin + price' ||
    norm === '2 ctas' ||
    norm === 'name + rep' ||
    norm === 'engaging' ||
    norm === 'clean' ||
    norm === 'pass' ||
    (norm.endsWith('min') && !norm.includes('not'))
  ) {
    return 'text-emerald-600 font-bold';
  }
  if (
    norm === 'generic' ||
    norm === 'inventory link' ||
    norm === 'minor issues' ||
    norm === 'price only' ||
    norm === 'vin only'
  ) {
    return 'text-amber-600 font-bold';
  }
  if (
    norm === 'none' ||
    norm === 'opt-in only' ||
    norm === 'fail' ||
    norm === 'bad'
  ) {
    return 'text-red-600 font-bold';
  }
  return 'text-slate-500 font-medium'; // e.g. "Not in 60 min"
};

export default function ResponseQualityAnalysis({ client, competitor }: ResponseQualityAnalysisProps) {
  const clientQuality = client.responseQuality || defaultClientQuality;
  const competitorQuality = competitor.responseQuality || defaultCompetitorQuality;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-slate-800 shadow-sm mb-8">
      <div className="mb-6">
        <span className="text-[10px] font-mono font-extrabold tracking-[0.25em] uppercase text-[#FD5900] block mb-1">
          Response Quality Analysis
        </span>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          Detailed cognitive breakdown of automation parameters, speed adherence, and formatting hygiene.
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Client Quality Card */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200">
            <h4 className="text-base font-bold text-slate-800 tracking-tight uppercase">
              {client.dealershipName}
            </h4>
            <span className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase">
              Client
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map((row) => {
              const val = clientQuality[row.key] || 'None';
              return (
                <div key={row.key} className="flex justify-between items-center py-3 text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">{row.label}</span>
                  <span className={`tracking-wide font-mono ${getValueColor(val)}`}>
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Competitor Quality Card */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200">
            <h4 className="text-base font-bold text-slate-800 tracking-tight uppercase">
              {competitor.dealershipName}
            </h4>
            <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase">
              Competitor
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map((row) => {
              const val = competitorQuality[row.key] || 'None';
              return (
                <div key={row.key} className="flex justify-between items-center py-3 text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">{row.label}</span>
                  <span className={`tracking-wide font-mono ${getValueColor(val)}`}>
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
