import { MysteryShopReport } from '../types';

export function exportToStandaloneHtml(report: MysteryShopReport): void {
  const { client, competitor, takeaways } = report;

  const defaultClientQuality = {
    autoEmailPersonalization: "Strong",
    autoEmailVehicleDetail: "VIN + Price",
    autoEmailCtaQuality: "2 CTAs",
    textPersonalization: "None",
    textContentValue: "Opt-in Only",
    personalEmailReceived: "Not in 60 min",
    grammarSpelling: "Minor Issues",
    overallSpeedRating: "FAIL"
  };

  const defaultCompetitorQuality = {
    autoEmailPersonalization: "Generic",
    autoEmailVehicleDetail: "None",
    autoEmailCtaQuality: "Inventory Link",
    textPersonalization: "Name + Rep",
    textContentValue: "Engaging",
    personalEmailReceived: "5 min",
    grammarSpelling: "Clean",
    overallSpeedRating: "PASS"
  };

  const clientQuality = client.responseQuality || defaultClientQuality;
  const competitorQuality = competitor.responseQuality || defaultCompetitorQuality;

  const getQualityColorClass = (val: string) => {
    const norm = (val || '').toLowerCase().trim();
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
      return 'text-green';
    }
    if (
      norm === 'generic' ||
      norm === 'inventory link' ||
      norm === 'minor issues' ||
      norm === 'price only' ||
      norm === 'vin only'
    ) {
      return 'text-amber';
    }
    if (
      norm === 'none' ||
      norm === 'opt-in only' ||
      norm === 'fail' ||
      norm === 'bad'
    ) {
      return 'text-rose';
    }
    return 'text-gray';
  };

  const rowsQuality = [
    { label: "Auto Email Personalization", key: "autoEmailPersonalization" as const },
    { label: "Auto Email Vehicle Detail", key: "autoEmailVehicleDetail" as const },
    { label: "Auto Email CTA Quality", key: "autoEmailCtaQuality" as const },
    { label: "Text Personalization", key: "textPersonalization" as const },
    { label: "Text Content Value", key: "textContentValue" as const },
    { label: "Personal Email Received", key: "personalEmailReceived" as const },
    { label: "Grammar / Spelling", key: "grammarSpelling" as const },
    { label: "Overall Speed Rating", key: "overallSpeedRating" as const },
  ];

  // Determine bar width calculations based on longest response time
  const allMinutes = [
    client.channels.text.minutesElapsed,
    client.channels.autoEmail.minutesElapsed,
    client.channels.phoneCall.minutesElapsed,
    client.channels.personalEmail.minutesElapsed,
    competitor.channels.text.minutesElapsed,
    competitor.channels.autoEmail.minutesElapsed,
    competitor.channels.phoneCall.minutesElapsed,
    competitor.channels.personalEmail.minutesElapsed,
  ].filter(v => v !== undefined && v !== null && !isNaN(v));

  const maxMinutes = Math.max(...allMinutes, 60); // default scaling factor

  // Helper inside template for bars
  const getBarWidth = (mins: number) => {
    return Math.min(Math.max((mins / maxMinutes) * 100, 8), 100).toFixed(0);
  };

  const getUrgencyClass = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'urgency-high';
      case 'Overhaul Needed': return 'urgency-high';
      case 'Process Gap': return 'urgency-med';
      case 'Quick Fix': return 'urgency-med';
      default: return 'urgency-low';
    }
  };

  const getPriorityIconClass = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'critical';
      case 'Overhaul Needed': return 'critical';
      case 'Process Gap': return 'fix';
      case 'Quick Fix': return 'fix';
      default: return 'positive';
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 7) return 'score-good';
    if (score >= 4) return 'score-warn';
    return 'score-bad';
  };

  // Render findings list for HTML
  const renderFindings = (findings: any[]) => {
    if (!findings || findings.length === 0) {
      return '<div class="finding"><span>No granular findings recorded for this channel.</span></div>';
    }
    return findings.map(f => {
      let icon = '!';
      let iconClass = 'neutral';
      if (f.type === 'positive') { icon = '✓'; iconClass = 'positive'; }
      if (f.type === 'negative') { icon = '✗'; iconClass = 'negative'; }
      return `
        <div class="finding">
          <div class="finding-icon ${iconClass}">${icon}</div>
          <span>${cleanText(f.text)}</span>
        </div>`;
    }).join('');
  };

  // Safe cleaner
  function cleanText(txt: string): string {
    if (!txt) return '';
    return txt
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/—/g, " ")
      .replace(/\|/g, " ");
  }

  const renderSpeedCardHTML = (channelName: string, targetVal: number, clientMins: number, clientPassed: boolean, compMins: number, compPassed: boolean) => {
    const isClientWinner = clientMins < compMins;
    const isTie = clientMins === compMins;
    const diff = Math.abs(clientMins - compMins);
    
    const clientOffset = 163 - (163 * Math.min(clientMins, targetVal)) / targetVal;
    const compOffset = 163 - (163 * Math.min(compMins, targetVal)) / targetVal;

    let deltaText = '';
    let deltaClass = '';
    if (isTie) {
      deltaText = `Exact Tie: both responded in ${clientMins} min`;
      deltaClass = 'tie';
    } else if (isClientWinner) {
      const ratio = clientMins > 0 ? (compMins / clientMins) : compMins;
      const ratioText = ratio >= 2 ? ` (${ratio.toFixed(1)}x faster)` : '';
      deltaText = `⚡ ${client.dealershipName} responded ${diff}m quicker${ratioText}`;
      deltaClass = 'client-win';
    } else {
      const ratio = compMins > 0 ? (clientMins / compMins) : clientMins;
      const ratioText = ratio >= 2 ? ` (${ratio.toFixed(1)}x faster)` : '';
      deltaText = `⚡ ${competitor.dealershipName} responded ${diff}m quicker${ratioText}`;
      deltaClass = 'competitor-win';
    }

    return `
    <div class="speed-card">
      <div class="speed-card-header">
        <span class="channel-name">${cleanText(channelName)}</span>
        <span class="target-label">SLA Target &le; ${targetVal} min</span>
      </div>
      
      <div class="speed-comparison-split">
        <!-- Client Dealership Side -->
        <div class="dealer-side is-client-side">
          <div class="dealer-side-name">${cleanText(client.dealershipName)} <span class="role-tag client-tag">Client</span></div>
          
          <div class="gauge-ring-wrapper">
            <svg class="gauge-ring-svg" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" class="gauge-bg-circle" />
              <circle cx="32" cy="32" r="26" class="gauge-fg-circle ${clientPassed ? 'is-good' : 'is-bad'}" stroke-dasharray="163" stroke-dashoffset="${clientOffset}" />
            </svg>
            <div class="gauge-center-time">
              <span class="mins-num">${clientMins}</span>
              <span class="mins-label">MIN</span>
            </div>
          </div>
          
          <span class="sla-badge ${clientPassed ? 'met-sla' : 'missed-sla'}">
            ${clientPassed ? 'MET SLA' : 'MISSED SLA'}
          </span>
        </div>

        <!-- Competitor Dealership Side -->
        <div class="dealer-side is-competitor-side">
          <div class="dealer-side-name">${cleanText(competitor.dealershipName)} <span class="role-tag competitor-tag">Competitor</span></div>
          
          <div class="gauge-ring-wrapper">
            <svg class="gauge-ring-svg" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" class="gauge-bg-circle" />
              <circle cx="32" cy="32" r="26" class="gauge-fg-circle ${compPassed ? 'is-good' : 'is-bad'}" stroke-dasharray="163" stroke-dashoffset="${compOffset}" />
            </svg>
            <div class="gauge-center-time">
              <span class="mins-num">${compMins}</span>
              <span class="mins-label">MIN</span>
            </div>
          </div>
          
          <span class="sla-badge ${compPassed ? 'met-sla' : 'missed-sla'}">
            ${compPassed ? 'MET SLA' : 'MISSED SLA'}
          </span>
        </div>
      </div>

      <div class="speed-race-banner ${deltaClass}">
        <span class="race-lead-icon">🏆</span>
        <span class="banner-payload">${cleanText(deltaText)}</span>
      </div>
    </div>
    `;
  };

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>C-4 Analytics Mystery Shop: ${cleanText(client.dealershipName)} vs ${cleanText(competitor.dealershipName)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0e1a;
    --surface: #111827;
    --surface-2: #1a2236;
    --border: #1e293b;
    --text: #e2e8f0;
    --text-muted: #94a3b8;
    --text-dim: #64748b;
    --green: #10b981;
    --green-bg: rgba(16, 185, 129, 0.1);
    --green-border: rgba(16, 185, 129, 0.25);
    --red: #ef4444;
    --red-bg: rgba(239, 68, 68, 0.1);
    --red-border: rgba(239, 68, 68, 0.25);
    --amber: #f59e0b;
    --amber-bg: rgba(245, 158, 11, 0.1);
    --amber-border: rgba(245, 158, 11, 0.25);
    --cyan: #06b6d4;
    --client-color: #ef4444;
    --competitor-color: #10b981;
    --orange: #FD5900;
  }

  * { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  }

  body {
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    min-height: 100vh;
    font-size: 16px;
  }

  button, input, select, textarea {
    font-family: inherit;
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px 24px;
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 48px;
    position: relative;
  }

  .header::after {
    content: '';
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--orange), transparent);
  }

  .header-label {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--orange);
    margin-bottom: 12px;
    font-weight: 700;
  }

  .header h1 {
    font-size: 40px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 8px;
  }

  .header .subtitle {
    color: var(--text-muted);
    font-size: 17px;
  }

  /* Navigation Bar */
  .tab-bar {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid var(--border);
    margin-bottom: 40px;
    gap: 16px;
  }

  .tab-button {
    background: none;
    border: none;
    color: var(--text-dim);
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 3px solid transparent;
  }

  .tab-button:hover {
    color: var(--text);
  }

  .tab-button.active {
    color: var(--text);
    border-bottom-color: var(--orange);
  }

  .tab-content {
    display: none;
  }

  .tab-content.active {
    display: block;
  }

  /* Outcomes */
  .outcomes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 40px;
  }

  @media (max-width: 768px) {
    .outcomes { grid-template-columns: 1fr; }
    .tab-bar { flex-wrap: wrap; gap: 8px; }
  }

  .outcome-card {
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    border: 1px solid;
  }

  .outcome-card.client {
    background: ${client.passed ? 'var(--green-bg)' : 'var(--red-bg)'};
    border-color: ${client.passed ? 'var(--green-border)' : 'var(--red-border)'};
  }

  .outcome-card.competitor {
    background: ${competitor.passed ? 'var(--green-bg)' : 'var(--red-bg)'};
    border-color: ${competitor.passed ? 'var(--green-border)' : 'var(--red-border)'};
  }

  .outcome-card .dealer-name {
    font-weight: 800;
    font-size: 22px;
    margin-bottom: 4px;
    color: #fff;
  }

  .outcome-card .dealer-role {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 12px;
  }

  .outcome-badge {
    display: inline-block;
    padding: 6px 20px;
    border-radius: 100px;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1px;
  }

  .outcome-badge.fail { background: var(--red); color: #fff; }
  .outcome-badge.pass { background: var(--green); color: #fff; }

  .outcome-meta {
    margin-top: 14px;
    font-size: 13.5px;
    color: var(--text-muted);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 12px;
  }

  .outcome-details {
    margin-top: 8px;
    font-size: 13px;
    color: var(--text-dim);
  }

  .section-title {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--cyan);
    margin-bottom: 16px;
    margin-top: 20px;
    font-weight: 700;
  }

  /* Response Times */
  .response-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 40px;
  }

  /* Speed Comparison Dashboard Styles (No Bar Charts) */
  .speed-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 20px;
  }
  
  @media (max-width: 900px) {
    .speed-grid {
      grid-template-columns: 1fr;
    }
  }

  .speed-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .speed-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #1e293b;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }

  .speed-card-header .channel-name {
    font-size: 17px;
    font-weight: 700;
    color: #fff;
  }

  .speed-card-header .target-label {
    font-size: 11px;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 700;
    color: var(--orange);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .speed-comparison-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  .dealer-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
  }

  .dealer-side-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-muted);
    margin-bottom: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    width: 100%;
  }

  .role-tag {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    margin-left: 4px;
    display: inline-block;
  }

  .role-tag.client-tag {
    background: rgba(239, 68, 68, 0.15);
    color: var(--red);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .role-tag.competitor-tag {
    background: rgba(16, 185, 129, 0.15);
    color: var(--green);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .gauge-ring-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
  }

  .gauge-ring-svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }

  .gauge-bg-circle {
    fill: none;
    stroke: var(--surface);
    stroke-width: 4px;
  }

  .gauge-fg-circle {
    fill: none;
    stroke-width: 4px;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.8s ease;
  }

  .gauge-fg-circle.is-good {
    stroke: var(--green);
  }

  .gauge-fg-circle.is-bad {
    stroke: var(--red);
  }

  .gauge-center-time {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .mins-num {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    line-height: 1;
  }

  .mins-label {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 8px;
    font-weight: 700;
    color: var(--text-dim);
    margin-top: 2px;
  }

  .sla-badge {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 9px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    border: 1px solid transparent;
  }

  .sla-badge.met-sla {
    background: rgba(16, 185, 129, 0.15);
    color: var(--green);
    border-color: rgba(16, 185, 129, 0.25);
  }

  .sla-badge.missed-sla {
    background: rgba(239, 68, 68, 0.15);
    color: var(--red);
    border-color: rgba(239, 68, 68, 0.25);
  }

  .speed-race-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
  }

  .speed-race-banner.client-win {
    background: rgba(239, 68, 68, 0.08);
    border-left: 3px solid var(--red);
    color: #fca5a5;
  }

  .speed-race-banner.competitor-win {
    background: rgba(16, 185, 129, 0.08);
    border-left: 3px solid var(--green);
    color: #6ee7b7;
  }

  .speed-race-banner.tie {
    background: rgba(148, 163, 184, 0.08);
    border-left: 3px solid var(--text-muted);
    color: var(--text-muted);
  }

  /* Breakdown Cards */
  .analysis-section { margin-bottom: 40px; }

  .analysis-title {
    font-size: 21px;
    font-weight: 700;
    margin-bottom: 18px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
  }

  .title-scores { display: flex; gap: 10px; margin-left: auto; }

  .title-score-pill {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 100px;
    white-space: nowrap;
    border: 1px solid;
  }

  .title-score-pill.client-pill {
    background: ${client.scores.responseSpeed >= competitor.scores.responseSpeed ? 'var(--green-bg)' : 'var(--red-bg)'};
    color: ${client.scores.responseSpeed >= competitor.scores.responseSpeed ? 'var(--green)' : 'var(--red)'};
    border-color: ${client.scores.responseSpeed >= competitor.scores.responseSpeed ? 'var(--green-border)' : 'var(--red-border)'};
  }
  .title-score-pill.competitor-pill {
    background: ${competitor.scores.responseSpeed >= client.scores.responseSpeed ? 'var(--green-bg)' : 'var(--red-bg)'};
    color: ${competitor.scores.responseSpeed >= client.scores.responseSpeed ? 'var(--green)' : 'var(--red)'};
    border-color: ${competitor.scores.responseSpeed >= client.scores.responseSpeed ? 'var(--green-border)' : 'var(--red-border)'};
  }

  .analysis-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  @media (max-width: 768px) {
    .analysis-grid { grid-template-columns: 1fr; }
  }

  .analysis-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
  }

  .analysis-card .card-dealer {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 16px;
    font-weight: 700;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    padding-bottom: 8px;
  }

  .analysis-card .card-dealer.is-client { color: var(--red); }
  .analysis-card .card-dealer.is-competitor { color: var(--green); }

  .analysis-card .finding {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 14.5px;
    line-height: 1.6;
    color: var(--text-muted);
  }

  .finding-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    margin-top: 2px;
    font-weight: bold;
  }

  .finding-icon.positive { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
  .finding-icon.negative { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-border); }
  .finding-icon.neutral { background: var(--amber-bg); color: var(--amber); border: 1px solid var(--amber-border); }

  /* Scorecard */
  .scorecard {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 32px;
    margin-top: 20px;
  }

  .scorecard-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
    text-align: center;
    border-bottom: 1px solid var(--border);
    padding-bottom: 12px;
  }

  .scorecard-header .col-label {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    font-weight: 700;
  }

  .scorecard-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    text-align: center;
    align-items: center;
  }

  .scorecard-row:last-child { border-bottom: none; }
  .scorecard-row .category { font-size: 16.5px; font-weight: 600; text-align: left; color: var(--text); }
  .scorecard-row .score-cell { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 22px; font-weight: 700; }

  .scorecard-row.total-row {
    border-top: 2px solid var(--border);
    padding-top: 20px;
    margin-top: 8px;
  }

  .scorecard-row.total-row .category { font-size: 17px; font-weight: 700; }
  .scorecard-row.total-row .score-cell { font-size: 28px; }

  .winner-badge {
    display: inline-block;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 10px;
    letter-spacing: 1px;
    padding: 3px 8px;
    border-radius: 4px;
    margin-left: 8px;
    vertical-align: middle;
    font-weight: 700;
  }

  .winner-badge.green { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }

  /* Takeaways */
  .takeaway-header { margin-top: 20px; margin-bottom: 24px; }
  .takeaway-header h3 { font-size: 24px; font-weight: 800; color: var(--orange); }

  .takeaway-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }

  @media (max-width: 768px) {
    .takeaway-grid { grid-template-columns: 1fr; }
  }

  .takeaway-tile {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px;
    position: relative;
    overflow: hidden;
  }

  .takeaway-tile.full-width { grid-column: 1 / -1; }

  .takeaway-tile .tile-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-bottom: 16px;
  }

  .tile-icon.critical { background: var(--red-bg); border: 1px solid var(--red-border); }
  .tile-icon.positive { background: var(--green-bg); border: 1px solid var(--green-border); }
  .tile-icon.fix { background: var(--amber-bg); border: 1px solid var(--amber-border); }

  .takeaway-tile .tile-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 10px; line-height: 1.4; }
  .takeaway-tile .tile-body { font-size: 14.5px; line-height: 1.7; color: var(--text-muted); }

  .takeaway-tile .tile-tag {
    display: inline-block;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    margin-bottom: 16px;
    font-weight: 700;
  }

  .tile-tag.urgency-high { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-border); }
  .tile-tag.urgency-med { background: var(--amber-bg); color: var(--amber); border: 1px solid var(--amber-border); }
  .tile-tag.urgency-low { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }

  /* Quality Analysis */
  .quality-section {
    background: #060b13;
    border: 1px solid #1e293b;
    border-radius: 20px;
    padding: 24px;
    margin-top: 24px;
    margin-bottom: 40px;
  }
  .quality-section-hdr {
    margin-bottom: 20px;
  }
  .quality-section-hdr h3 {
    font-size: 12px;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--cyan);
    margin-bottom: 4px;
  }
  .quality-section-hdr p {
    font-size: 13px;
    color: var(--text-muted);
  }
  .quality-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 768px) {
    .quality-grid { grid-template-columns: 1fr; }
  }
  .quality-card {
    background: #0b1322;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 24px;
  }
  .quality-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 12px;
    margin-bottom: 16px;
  }
  .quality-header h4 {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
  }
  .quality-badge {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 9px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .quality-badge.client-badge {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.25);
  }
  .quality-badge.comp-badge {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.25);
  }
  .quality-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    font-size: 13.5px;
  }
  .quality-row:last-child {
    border-bottom: none;
  }
  .quality-row .label {
    color: #94a3b8;
  }
  .quality-row .value {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
  .text-green { color: #10b981; font-weight: 700; }
  .text-amber { color: #f59e0b; font-weight: 700; }
  .text-rose { color: #ef4444; font-weight: 700; }
  .text-gray { color: #64748b; font-weight: 500; }
</style>
</head>
<body>
<div class="container">

  <!-- HEADER -->
  <div class="header">
    <div class="header-label">C-4 Analytics Mystery Shop Report</div>
    <h1>Lead Response Comparison</h1>
    <div class="subtitle">${cleanText(client.dealershipName)} vs ${cleanText(competitor.dealershipName)} &middot; Complete Performance Appraisal</div>
  </div>

  <!-- NAVIGATION BAR -->
  <div class="tab-bar">
    <button class="tab-button active" onclick="switchTab('summary')">Summary</button>
    <button class="tab-button" onclick="switchTab('response-times')">Response Times</button>
    <button class="tab-button" onclick="switchTab('channel-breakdown')">Channel Breakdown</button>
    <button class="tab-button" onclick="switchTab('scorecard')">Scorecard</button>
    <button class="tab-button" onclick="switchTab('takeaways')">Key Takeaways</button>
  </div>

  <!-- TAB: SUMMARY -->
  <div id="tab-summary" class="tab-content active">
    <div class="outcomes">
      <div class="outcome-card client">
        <div class="dealer-name">${cleanText(client.dealershipName)}</div>
        <div class="dealer-role">C-4 Client</div>
        <span class="outcome-badge ${client.passed ? 'pass' : 'fail'}">${client.passed ? 'PASS' : 'FAIL'}</span>
        <div class="outcome-meta">Shopper: ${cleanText(client.shopperName)} &middot; Sub: ${cleanText(client.submissionTimestamp)}</div>
        <div class="outcome-details">Vehicle Inquiry: ${cleanText(client.vehicle.year)} ${cleanText(client.vehicle.make)} ${cleanText(client.vehicle.model)} ${cleanText(client.vehicle.trim)}</div>
        ${client.customerQuestion ? `<div class="outcome-details" style="margin-top: 6px;">Customer Question: <em>"${cleanText(client.customerQuestion)}"</em></div>` : ''}
      </div>
      <div class="outcome-card competitor">
        <div class="dealer-name">${cleanText(competitor.dealershipName)}</div>
        <div class="dealer-role">Competitor</div>
        <span class="outcome-badge ${competitor.passed ? 'pass' : 'fail'}">${competitor.passed ? 'PASS' : 'FAIL'}</span>
        <div class="outcome-meta">Shopper: ${cleanText(competitor.shopperName)} &middot; Sub: ${cleanText(competitor.submissionTimestamp)}</div>
        <div class="outcome-details">Vehicle Inquiry: ${cleanText(competitor.vehicle.year)} ${cleanText(competitor.vehicle.make)} ${cleanText(competitor.vehicle.model)} ${cleanText(competitor.vehicle.trim)}</div>
        ${competitor.customerQuestion ? `<div class="outcome-details" style="margin-top: 6px;">Customer Question: <em>"${cleanText(competitor.customerQuestion)}"</em></div>` : ''}
      </div>
    </div>

    <!-- Response Quality Analysis Section -->
    <div class="quality-section">
      <div class="quality-section-hdr">
        <h3>Response Quality Analysis</h3>
        <p>Detailed cognitive breakdown of automation parameters, speed adherence, and formatting hygiene.</p>
      </div>
      <div class="quality-grid">
        <!-- Client Quality Card -->
        <div class="quality-card">
          <div class="quality-header">
            <h4>${cleanText(client.dealershipName)}</h4>
            <span class="quality-badge client-badge">Client</span>
          </div>
          <div>
            ${rowsQuality.map(row => {
              const val = clientQuality[row.key] || 'None';
              return `
                <div class="quality-row">
                  <span class="label">${row.label}</span>
                  <span class="value ${getQualityColorClass(val)}">${cleanText(val)}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Competitor Quality Card -->
        <div class="quality-card">
          <div class="quality-header">
            <h4>${cleanText(competitor.dealershipName)}</h4>
            <span class="quality-badge comp-badge">Competitor</span>
          </div>
          <div>
            ${rowsQuality.map(row => {
              const val = competitorQuality[row.key] || 'None';
              return `
                <div class="quality-row">
                  <span class="label">${row.label}</span>
                  <span class="value ${getQualityColorClass(val)}">${cleanText(val)}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- TAB: RESPONSE TIMES -->
  <div id="tab-response-times" class="tab-content">
    <div class="section-title">Lead Response Times (Head-to-Head Comparison)</div>
    
    <div class="speed-grid">
      ${renderSpeedCardHTML('Text Message Outreach', 5, client.channels.text.minutesElapsed, client.channels.text.passedTarget, competitor.channels.text.minutesElapsed, competitor.channels.text.passedTarget)}
      ${renderSpeedCardHTML('CRM Auto Email', 5, client.channels.autoEmail.minutesElapsed, client.channels.autoEmail.passedTarget, competitor.channels.autoEmail.minutesElapsed, competitor.channels.autoEmail.passedTarget)}
      ${renderSpeedCardHTML('Outbound Phone Call', 20, client.channels.phoneCall.minutesElapsed, client.channels.phoneCall.passedTarget, competitor.channels.phoneCall.minutesElapsed, competitor.channels.phoneCall.passedTarget)}
      ${renderSpeedCardHTML('Personal Email Outreach', 20, client.channels.personalEmail.minutesElapsed, client.channels.personalEmail.passedTarget, competitor.channels.personalEmail.minutesElapsed, competitor.channels.personalEmail.passedTarget)}
    </div>
  </div>

  <!-- TAB: BREAKDOWNS -->
  <div id="tab-channel-breakdown" class="tab-content">
    <div class="analysis-section">
      <div class="analysis-title">Auto Email Channels <div class="title-scores"><span class="title-score-pill client-pill">Client: ${client.scores.autoEmailQuality}/10</span><span class="title-score-pill competitor-pill">Competitor: ${competitor.scores.autoEmailQuality}/10</span></div></div>
      <div class="analysis-grid">
        <div class="analysis-card">
          <div class="card-dealer is-client">${cleanText(client.dealershipName)} &middot; ${client.channels.autoEmail.minutesElapsed} min elapsed</div>
          ${renderFindings(client.findings.autoEmail)}
        </div>
        <div class="analysis-card">
          <div class="card-dealer is-competitor">${cleanText(competitor.dealershipName)} &middot; ${competitor.channels.autoEmail.minutesElapsed} min elapsed</div>
          ${renderFindings(competitor.findings.autoEmail)}
        </div>
      </div>
    </div>

    <div class="analysis-section">
      <div class="analysis-title">Personal Email Channels <div class="title-scores"><span class="title-score-pill client-pill">Client: ${client.scores.personalEmailQuality}/10</span><span class="title-score-pill competitor-pill">Competitor: ${competitor.scores.personalEmailQuality}/10</span></div></div>
      <div class="analysis-grid">
        <div class="analysis-card">
          <div class="card-dealer is-client">${cleanText(client.dealershipName)} &middot; ${client.channels.personalEmail.minutesElapsed} min elapsed</div>
          ${renderFindings(client.findings.personalEmail)}
        </div>
        <div class="analysis-card">
          <div class="card-dealer is-competitor">${cleanText(competitor.dealershipName)} &middot; ${competitor.channels.personalEmail.minutesElapsed} min elapsed</div>
          ${renderFindings(competitor.findings.personalEmail)}
        </div>
      </div>
    </div>

    <div class="analysis-section">
      <div class="analysis-title">SMS / Text Connection <div class="title-scores"><span class="title-score-pill client-pill">Client: ${client.scores.textQuality}/10</span><span class="title-score-pill competitor-pill">Competitor: ${competitor.scores.textQuality}/10</span></div></div>
      <div class="analysis-grid">
        <div class="analysis-card">
          <div class="card-dealer is-client">${cleanText(client.dealershipName)} &middot; ${client.channels.text.minutesElapsed} min elapsed</div>
          ${renderFindings(client.findings.textMessage)}
        </div>
        <div class="analysis-card">
          <div class="card-dealer is-competitor">${cleanText(competitor.dealershipName)} &middot; ${competitor.channels.text.minutesElapsed} min elapsed</div>
          ${renderFindings(competitor.findings.textMessage)}
        </div>
      </div>
    </div>

    <div class="analysis-section">
      <div class="analysis-title">Phone Outbound Outreach <div class="title-scores"><span class="title-score-pill client-pill">Client: ${client.scores.callResponse}/10</span><span class="title-score-pill competitor-pill">Competitor: ${competitor.scores.callResponse}/10</span></div></div>
      <div class="analysis-grid">
        <div class="analysis-card">
          <div class="card-dealer is-client">${cleanText(client.dealershipName)} &middot; ${client.channels.phoneCall.minutesElapsed} min elapsed</div>
          ${renderFindings(client.findings.phoneCall)}
        </div>
        <div class="analysis-card">
          <div class="card-dealer is-competitor">${cleanText(competitor.dealershipName)} &middot; ${competitor.channels.phoneCall.minutesElapsed} min elapsed</div>
          ${renderFindings(competitor.findings.phoneCall)}
        </div>
      </div>
    </div>
  </div>

  <!-- TAB: SCORECARD -->
  <div id="tab-scorecard" class="tab-content">
    <div class="section-title">Deterministic Score Matrix</div>
    <div class="scorecard">
      <div class="scorecard-header">
        <div class="col-label" style="text-align: left;">Category</div>
        <div class="col-label" style="color:var(--red)">${cleanText(client.dealershipName)}</div>
        <div class="col-label" style="color:var(--green)">${cleanText(competitor.dealershipName)}</div>
      </div>

      <div class="scorecard-row">
        <div class="category">Response Speed SLA</div>
        <div class="score-cell ${getScoreColorClass(client.scores.responseSpeed)}">${client.scores.responseSpeed}<span style="font-size:12px;color:var(--text-dim)">/10</span>${client.scores.responseSpeed > competitor.scores.responseSpeed ? '<span class="winner-badge green">WIN</span>' : ''}</div>
        <div class="score-cell ${getScoreColorClass(competitor.scores.responseSpeed)}">${competitor.scores.responseSpeed}<span style="font-size:12px;color:var(--text-dim)">/10</span>${competitor.scores.responseSpeed > client.scores.responseSpeed ? '<span class="winner-badge green">WIN</span>' : ''}</div>
      </div>

      <div class="scorecard-row">
        <div class="category">Auto Email Quality</div>
        <div class="score-cell ${getScoreColorClass(client.scores.autoEmailQuality)}">${client.scores.autoEmailQuality}<span style="font-size:12px;color:var(--text-dim)">/10</span>${client.scores.autoEmailQuality > competitor.scores.autoEmailQuality ? '<span class="winner-badge green">WIN</span>' : ''}</div>
        <div class="score-cell ${getScoreColorClass(competitor.scores.autoEmailQuality)}">${competitor.scores.autoEmailQuality}<span style="font-size:12px;color:var(--text-dim)">/10</span>${competitor.scores.autoEmailQuality > client.scores.autoEmailQuality ? '<span class="winner-badge green">WIN</span>' : ''}</div>
      </div>

      <div class="scorecard-row">
        <div class="category">Personal Email Quality</div>
        <div class="score-cell ${getScoreColorClass(client.scores.personalEmailQuality)}">${client.scores.personalEmailQuality}<span style="font-size:12px;color:var(--text-dim)">/10</span>${client.scores.personalEmailQuality > competitor.scores.personalEmailQuality ? '<span class="winner-badge green">WIN</span>' : ''}</div>
        <div class="score-cell ${getScoreColorClass(competitor.scores.personalEmailQuality)}">${competitor.scores.personalEmailQuality}<span style="font-size:12px;color:var(--text-dim)">/10</span>${competitor.scores.personalEmailQuality > client.scores.personalEmailQuality ? '<span class="winner-badge green">WIN</span>' : ''}</div>
      </div>

      <div class="scorecard-row">
        <div class="category">Text message Quality</div>
        <div class="score-cell ${getScoreColorClass(client.scores.textQuality)}">${client.scores.textQuality}<span style="font-size:12px;color:var(--text-dim)">/10</span>${client.scores.textQuality > competitor.scores.textQuality ? '<span class="winner-badge green">WIN</span>' : ''}</div>
        <div class="score-cell ${getScoreColorClass(competitor.scores.textQuality)}">${competitor.scores.textQuality}<span style="font-size:12px;color:var(--text-dim)">/10</span>${competitor.scores.textQuality > client.scores.textQuality ? '<span class="winner-badge green">WIN</span>' : ''}</div>
      </div>

      <div class="scorecard-row">
        <div class="category">Call Outreach Quality</div>
        <div class="score-cell ${getScoreColorClass(client.scores.callResponse)}">${client.scores.callResponse}<span style="font-size:12px;color:var(--text-dim)">/10</span>${client.scores.callResponse > competitor.scores.callResponse ? '<span class="winner-badge green">WIN</span>' : ''}</div>
        <div class="score-cell ${getScoreColorClass(competitor.scores.callResponse)}">${competitor.scores.callResponse}<span style="font-size:12px;color:var(--text-dim)">/10</span>${competitor.scores.callResponse > client.scores.callResponse ? '<span class="winner-badge green">WIN</span>' : ''}</div>
      </div>

      <!-- TOTALS -->
      <div class="scorecard-row total-row">
        <div class="category">Overall Store Rating</div>
        <div class="score-cell ${getScoreColorClass(Math.round((client.scores.responseSpeed + client.scores.autoEmailQuality + client.scores.personalEmailQuality + client.scores.textQuality + client.scores.callResponse) / 5))}">
          ${client.scores.responseSpeed + client.scores.autoEmailQuality + client.scores.personalEmailQuality + client.scores.textQuality + client.scores.callResponse}
          <span style="font-size:14px;color:var(--text-dim)">/50</span>
        </div>
        <div class="score-cell ${getScoreColorClass(Math.round((competitor.scores.responseSpeed + competitor.scores.autoEmailQuality + competitor.scores.personalEmailQuality + competitor.scores.textQuality + competitor.scores.callResponse) / 5))}">
          ${competitor.scores.responseSpeed + competitor.scores.autoEmailQuality + competitor.scores.personalEmailQuality + competitor.scores.textQuality + competitor.scores.callResponse}
          <span style="font-size:14px;color:var(--text-dim)">/50</span>
        </div>
      </div>
    </div>
  </div>

  <!-- TAB: TAKEAWAYS -->
  <div id="tab-takeaways" class="tab-content">
    <div class="takeaway-header">
      <h3>Strategic Action Plan for ${cleanText(client.dealershipName)}</h3>
    </div>
    <div class="takeaway-grid">
      ${takeaways.map((t, idx) => `
        <div class="takeaway-tile ${t.fullWidth || idx === 0 ? 'full-width' : ''}">
          <div class="tile-icon ${getPriorityIconClass(t.priority)}">${t.emoji || '💡'}</div>
          <span class="tile-tag ${getUrgencyClass(t.priority)}">${cleanText(t.priority)}</span>
          <div class="tile-title">${cleanText(t.title)}</div>
          <div class="tile-body">${cleanText(t.description)}</div>
        </div>
      `).join('')}
    </div>
  </div>

</div>

<script>
  function switchTab(tabId) {
    // Hide all contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.classList.remove('active'));

    // Deactivate all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(b => b.classList.remove('active'));

    // Show selected
    document.getElementById('tab-' + tabId).classList.add('active');

    // Activate selected button
    // Find button based on function argument
    event.currentTarget.classList.add('active');
  }
</script>
</body>
</html>`;

  // Trigger file downloading on client browser
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `C4_Mystery_Shop_${client.dealershipName.replace(/\s+/g, '_')}_vs_${competitor.dealershipName.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
