import React from 'react';
import { DealershipData } from '../types';
import { Shield, ShieldAlert, Globe, Car, User, HelpCircle } from 'lucide-react';

interface OutcomeCardsProps {
  client: DealershipData;
  competitor: DealershipData;
}

export default function OutcomeCards({ client, competitor }: OutcomeCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Client Outcome */}
      <div 
        className={`rounded-xl p-6 border text-center transition flex flex-col justify-between relative overflow-hidden bg-white shadow-sm hover:shadow-md ${
          client.passed 
            ? 'border-slate-200 border-l-4 border-l-emerald-500' 
            : 'border-slate-200 border-l-4 border-l-red-500'
        }`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-transparent to-transparent opacity-5 pointer-events-none" />
        
        <div>
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-slate-500 mb-2 font-bold flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#FD5900]" />
            C-4 Client Dealership
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight">
            {client.dealershipName}
          </h3>
          <span 
            className={`inline-block px-5 py-1.5 rounded-full font-bold text-xs tracking-wider uppercase shadow-sm ${
              client.passed 
                ? 'bg-emerald-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {client.passed ? 'PASS' : 'FAIL'}
          </span>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-slate-400">Shopper:</span>
            <span className="text-slate-700 font-semibold">{client.shopperName}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-3.5 h-3.5 flex items-center justify-center text-slate-400 font-mono font-bold">@</span>
            <span className="text-slate-400">Submitted:</span>
            <span className="text-slate-700 font-medium">{client.submissionTimestamp}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Car className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-slate-400">Vehicle:</span>
            <span className="text-slate-700 font-semibold">
              {client.vehicle.year} {client.vehicle.make} {client.vehicle.model} {client.vehicle.trim}
            </span>
          </div>

          {client.customerQuestion && (
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-400 flex-shrink-0">Customer Question:</span>
              <span className="text-slate-700 font-medium italic">"{client.customerQuestion}"</span>
            </div>
          )}

          {client.websiteUrl && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-slate-400">Website:</span>
              <a 
                href={client.websiteUrl} 
                target="_blank" 
                rel="no-referrer" 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium truncate"
              >
                {client.websiteUrl}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Competitor Outcome */}
      <div 
        className={`rounded-xl p-6 border text-center transition flex flex-col justify-between relative overflow-hidden bg-white shadow-sm hover:shadow-md ${
          competitor.passed 
            ? 'border-slate-200 border-l-4 border-l-emerald-500' 
            : 'border-slate-200 border-l-4 border-l-red-500'
        }`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-transparent to-transparent opacity-5 pointer-events-none" />

        <div>
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-slate-500 mb-2 font-bold flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            Primary Peer Competitor
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight">
            {competitor.dealershipName}
          </h3>
          <span 
            className={`inline-block px-5 py-1.5 rounded-full font-bold text-xs tracking-wider uppercase shadow-md ${
              competitor.passed 
                ? 'bg-emerald-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {competitor.passed ? 'PASS' : 'FAIL'}
          </span>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-slate-400">Shopper:</span>
            <span className="text-slate-700 font-semibold">{competitor.shopperName}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-3.5 h-3.5 flex items-center justify-center text-slate-400 font-mono font-bold">@</span>
            <span className="text-slate-400">Submitted:</span>
            <span className="text-slate-700 font-medium">{competitor.submissionTimestamp}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Car className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-slate-400">Vehicle:</span>
            <span className="text-slate-700 font-semibold">
              {competitor.vehicle.year} {competitor.vehicle.make} {competitor.vehicle.model} {competitor.vehicle.trim}
            </span>
          </div>

          {competitor.customerQuestion && (
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-400 flex-shrink-0">Customer Question:</span>
              <span className="text-slate-700 font-medium italic">"{competitor.customerQuestion}"</span>
            </div>
          )}

          {competitor.websiteUrl && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-slate-400">Website:</span>
              <a 
                href={competitor.websiteUrl} 
                target="_blank" 
                rel="no-referrer" 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium truncate"
              >
                {competitor.websiteUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
