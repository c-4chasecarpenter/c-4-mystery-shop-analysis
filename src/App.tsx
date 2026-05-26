import React, { useState } from 'react';
import { sampleMysteryShopReport } from './sampleData';
import { MysteryShopReport, DealerScores, Finding, ChannelFindings, Takeaway } from './types';
import { exportToStandaloneHtml } from './utils/exportHtml';

import ReportHeader from './components/ReportHeader';
import OutcomeCards from './components/OutcomeCards';
import ResponseQualityAnalysis from './components/ResponseQualityAnalysis';
import ResponseSpeedBars from './components/ResponseSpeedBars';
import FindingsBreakdown from './components/FindingsBreakdown';
import ScorecardTable from './components/ScorecardTable';
import TakeawaysGrid from './components/TakeawaysGrid';
import LeadInputManager from './components/LeadInputManager';

import { Download, Layers, ShieldCheck, Mail, Database, HelpCircle } from 'lucide-react';

export default function App() {
  const [report, setReport] = useState<MysteryShopReport | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'speed' | 'granular' | 'scorecard' | 'takeaways'>('summary');

  const handleAnalysisComplete = (newReport: MysteryShopReport) => {
    setReport(newReport);
    setActiveTab('summary'); // jump to summary tab once loaded
  };

  const handleUpdateScores = (dealer: 'client' | 'competitor', category: keyof DealerScores, score: number) => {
    setReport((prev) => {
      if (!prev) return null;
      const updatedDealer = { ...prev[dealer] };
      updatedDealer.scores = { ...updatedDealer.scores, [category]: score };

      // Re-evaluate Pass/Fail status based on realistic criteria:
      // If any score goes below 4, or if speed is under 5, they may fail.
      const totalScore = 
        updatedDealer.scores.responseSpeed +
        updatedDealer.scores.autoEmailQuality +
        updatedDealer.scores.personalEmailQuality +
        updatedDealer.scores.textQuality +
        updatedDealer.scores.callResponse;

      updatedDealer.passed = totalScore >= 35; // pass threshold 35/50

      return {
        ...prev,
        [dealer]: updatedDealer,
      };
    });
  };

  const handleUpdateFindings = (
    dealer: 'client' | 'competitor',
    channel: keyof ChannelFindings,
    findings: Finding[]
  ) => {
    setReport((prev) => {
      if (!prev) return null;
      const updatedDealer = { ...prev[dealer] };
      updatedDealer.findings = { ...updatedDealer.findings, [channel]: findings };
      return {
        ...prev,
        [dealer]: updatedDealer,
      };
    });
  };

  const handleUpdateTakeaways = (newTakeaways: Takeaway[]) => {
    setReport((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        takeaways: newTakeaways,
      };
    });
  };

  const handleExport = () => {
    if (!report) return;
    exportToStandaloneHtml(report);
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen pb-16">
      {/* Upper Accented Border */}
      <div className="h-[4px] bg-gradient-to-r from-[#FD5900] via-[#FD5900]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TOP COMPONENT: Lead document ingest block */}
        <LeadInputManager onAnalysisComplete={handleAnalysisComplete} currentReport={report} />

        {report ? (
          <div className="relative mt-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            {/* Quick Actions Exporter */}
            <div className="md:absolute md:top-8 md:right-8 flex justify-end mb-6 md:mb-0 z-10">
              <button
                onClick={handleExport}
                className="px-4 py-2.5 bg-[#FD5900] hover:bg-[#ff6e1d] hover:scale-[1.02] transform text-white text-xs font-bold font-semibold tracking-wider rounded-lg flex items-center gap-2 shadow-sm transition active:scale-95 whitespace-nowrap uppercase"
              >
                <Download className="w-3.5 h-3.5" />
                Export Standalone C-4 HTML Report
              </button>
            </div>

            {/* Top header showing titles */}
            <ReportHeader 
              clientName={report.client.dealershipName} 
              competitorName={report.competitor.dealershipName} 
              analysisDate={report.metadata.analysisDate} 
            />

            {/* Action Header Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-8 gap-4">
              {/* Interactive Tab navigation bar */}
              <nav className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none" aria-label="Tabs">
                {(
                  [
                    { id: 'summary', label: 'Summary Overview' },
                    { id: 'speed', label: 'Response Times' },
                    { id: 'granular', label: 'Channel Breakdown' },
                    { id: 'scorecard', label: 'Scorecard Matrix' },
                    { id: 'takeaways', label: 'Action Takeaways' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition border whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-[#FD5900] text-white border-transparent shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'summary' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Outcome badges */}
                <OutcomeCards client={report.client} competitor={report.competitor} />

                {/* Response Quality Scorecard indicators block */}
                <ResponseQualityAnalysis client={report.client} competitor={report.competitor} />
              </div>
            )}

            {activeTab === 'speed' && (
              <div className="animate-fadeIn">
                <ResponseSpeedBars client={report.client} competitor={report.competitor} />
              </div>
            )}

            {activeTab === 'granular' && (
              <div className="animate-fadeIn">
                <FindingsBreakdown 
                  client={report.client} 
                  competitor={report.competitor} 
                  onUpdateFindings={handleUpdateFindings}
                />
              </div>
            )}

            {activeTab === 'scorecard' && (
              <div className="animate-fadeIn">
                <ScorecardTable 
                  clientName={report.client.dealershipName}
                  competitorName={report.competitor.dealershipName}
                  clientScores={report.client.scores}
                  competitorScores={report.competitor.scores}
                  onUpdateScores={handleUpdateScores}
                />
              </div>
            )}

            {activeTab === 'takeaways' && (
              <div className="animate-fadeIn">
                <TakeawaysGrid 
                  takeaways={report.takeaways} 
                  onUpdateTakeaways={handleUpdateTakeaways} 
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 mt-12 bg-white border border-slate-200 border-dashed rounded-3xl p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Database className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Report Generated Yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              Enter the client and competitor dealership names above, then upload both mystery shop PDF files to analyze performance and generate comparative scores.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
