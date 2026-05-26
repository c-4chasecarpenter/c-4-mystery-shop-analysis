import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Lazily initialize Gemini to prevent crash at startup if key is missing as per guidelines
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Real analysis will fail, using rich heuristics instead.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "DUMMY_KEY_FOR_BUILD",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

// Set request limits high so we can process PDFs passed as base64
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

// Standard healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', keyAvailable: !!process.env.GEMINI_API_KEY });
});

// Primary analysis handler
app.post('/api/analyze', async (req, res): Promise<any> => {
  try {
    const { clientInput, competitorInput, clientType, competitorType, clientName, competitorName } = req.body;

    if (!clientInput || !competitorInput) {
      return res.status(400).json({ error: "Please provide mystery shop inputs for both dealerships." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured on the server. Please add your Gemini API key inside the Secrets panel under Settings." 
      });
    }

    const ai = getAi();

    // Prepare inputs. They can be either raw text, or base64 PDF components.
    const systemPrompt = `You are an expert automotive retail performance analyst at C-4 Analytics.
Your role is to analyze raw mystery shop records (either submitted as PDFs or raw text copy) for a C-4 client dealership and an active competitor dealership.
You must extract all dealer response indicators, score them deterministically using the rubric, compile findings, and generate critical key takeaways.

Extract and analyze:
1. Dealership Info: Name, Shopper name, Submission date/timestamp, Vehicle year/make/model/trim, VIN, customer's comment / question from the lead submission slide, and overall Pass/Fail status.
2. Response Channels & times: Phone call, Auto email, Personal email, Text message. Determine elapsed minutes and whether it met target.
3. Scoring (out of 10 for each):
   - Response Speed: 4 channels in target = 9-10; 3 channels = 7-8; 2 channels = 5-6; 1 channel = 3-4; 0 channels = 1-2
     (Targets: Text 0-5m, Auto Email 0-5m, Phone Call 0-20m, Personal Email 0-20m)
   - Auto Email Quality: uses first name (0-2 pts), references vehicle (0-2 pts), includes VIN/price/inventory reference (0-2 pts), clear call to action/next steps (0-2 pts), clean formatting & grammar (0-2 pts).
   - Personal Email Quality: sent within 60 min window (0 or 5 pts), uses name & references vehicle (0-2 pts), rep signature with name, title, cell phone, email (0-1 pt), professional tone (0-1 pt), addresses custom buyer comments/questions from form (0-1 pt).
   - Text Quality: uses name (0-2 pts), salesperson identified (0-2 pts), references vehicle/inquiry (0-2 pts), engaging question/next step (0-2), clean grammar (0-2).
   - Call Response: within 5 mins = 9-10; 5-10 mins = 7-8; 10-20 mins = 5-6; 20+ mins or no call = 0-4.
4. Response Quality Scorecard indicators:
   - Auto Email Personalization: "Strong", "Generic", or "None"
   - Auto Email Vehicle Detail: "VIN + Price", "Price Only", "VIN Only", "None"
   - Auto Email CTA Quality: "2 CTAs", "Inventory Link", "None", or other concise desc
   - Text Personalization: "Name + Rep", "Name Only", "None", etc.
   - Text Content Value: "Engaging", "Opt-in Only", "None", etc.
   - Personal Email Received: time like "5 min", "12 min", or "Not in 60 min"
   - Grammar / Spelling: "Clean", "Minor Issues", or "Bad"
   - Overall Speed Rating: "PASS" or "FAIL" based on SLA speed.
5. Content Quality Findings:
   - Highlight CRM configuration errors, broken merge tags, cold outbound formatting, unaddressed guest queries, unfulfilled follow-up promises, and fast personal follow-up highlights.
   - For each finding, categorize as: 'positive' (green check), 'negative' (red X), or 'neutral' (warning / minor issue).
   - Findings must be 1 to 2 sentences max, citing specific times, names, or content. No hyphens, em dashes, or pipe '|' separators in descriptions.
6. Key Takeaways:
   - Provide 4 to 6 takeaways. The most critical takeaway MUST be first and have "fullWidth": true.
   - Each takeaway must have a priority level: "Critical", "Overhaul Needed", "Process Gap", "Bright Spot", or "Quick Fix", an emoji, and a bold title.
   - Bright Spot highlighting what client did well or did better than competitor.
   - No hyphens, em dashes, or pipe separators in any takeaway descriptions.

You MUST respond strictly with a valid JSON document conforming to the following structure:
{
  "client": {
    "dealershipName": "C-4 Client Dealership Name",
    "shopperName": "Shopper Name",
    "submissionTimestamp": "Date/Time of submission",
    "vehicle": { "year": "2026", "make": "Brand", "model": "Model", "trim": "Trim" },
    "vin": "VIN if present, otherwise null",
    "websiteUrl": "dealership website domain or null",
    "passed": true_or_false,
    "customerQuestion": "Actual comment or question text submitted by customer on the lead submission slide/form (e.g. asking about utility bed covers)",
    "responseQuality": {
      "autoEmailPersonalization": "Strong",
      "autoEmailVehicleDetail": "VIN + Price",
      "autoEmailCtaQuality": "2 CTAs",
      "textPersonalization": "None",
      "textContentValue": "Opt-in Only",
      "personalEmailReceived": "Not in 60 min",
      "grammarSpelling": "Minor Issues",
      "overallSpeedRating": "FAIL"
    },
    "channels": {
      "text": { "timestamp": "...", "minutesElapsed": 4, "passedTarget": true },
      "autoEmail": { "timestamp": "...", "minutesElapsed": 3, "passedTarget": true },
      "phoneCall": { "timestamp": "...", "minutesElapsed": 12, "passedTarget": true },
      "personalEmail": { "timestamp": "...", "minutesElapsed": 115, "passedTarget": false }
    },
    "messages": {
      "autoEmail": { "sender": "...", "recipient": "...", "subject": "...", "date": "...", "body": "Full body text" },
      "personalEmail": { "sender": "...", "recipient": "...", "subject": "...", "date": "...", "body": "Full body text" },
      "textMessage": { "senderPhone": "...", "date": "...", "body": "message text" },
      "phoneCall": { "timestamp": "...", "duration": "...", "details": "Summary of conversation" }
    },
    "scores": {
      "responseSpeed": 6,
      "autoEmailQuality": 7,
      "personalEmailQuality": 4,
      "textQuality": 8,
      "callResponse": 5
    },
    "findings": {
      "autoEmail": [ { "type": "positive", "text": "..." } ],
      "personalEmail": [ { "type": "negative", "text": "..." } ],
      "textMessage": [ { "type": "neutral", "text": "..." } ],
      "phoneCall": [ { "type": "negative", "text": "..." } ]
    }
  },
  "competitor": {
    // Exact same structure as client
  },
  "takeaways": [
    {
      "priority": "Critical",
      "emoji": "⏳",
      "title": "...",
      "description": "...",
      "fullWidth": true
    },
    {
      "priority": "Quick Fix",
      "emoji": "🔧",
      "title": "...",
      "description": "..."
    }
  ],
  "metadata": {
    "analysisDate": "..."
  }
}
Do not include any block quote formatting or code markup around the JSON outside the response content. Output only pure, parseable JSON.`;

    // Package parts for Gemini. Supporting Base64 files or raw text input.
    const clientPart = clientType === 'pdf' 
      ? { inlineData: { data: clientInput, mimeType: 'application/pdf' } }
      : { text: `CLIENT MYSTERY SHOP RAW TEXT AND HEADER DETAILS:\n${clientInput}` };

    const competitorPart = competitorType === 'pdf'
      ? { inlineData: { data: competitorInput, mimeType: 'application/pdf' } }
      : { text: `COMPETITOR MYSTERY SHOP RAW TEXT AND HEADER DETAILS:\n${competitorInput}` };

    const requestContent = {
      parts: [
        { text: `Analyze the following mystery shop results for our client named "${clientName || 'C-4 Dealer'}" and their competitor named "${competitorName || 'Active Competitor'}". Evaluate and return the JSON comparison exactly as described.` },
        clientPart,
        competitorPart
      ]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: requestContent,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    const textResult = response.text;
    if (!textResult) {
      throw new Error("Empty response received from analysis model.");
    }

    // Clean JSON if the model returns markdown codeblocks
    let cleanJson = textResult.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.substring(7);
    }
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.substring(3);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }
    cleanJson = cleanJson.trim();

    const parsedData = JSON.parse(cleanJson);
    res.json(parsedData);

  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ 
      error: error.message || "An unexpected error occurred during report parsing. Please double check file formatting / text inputs." 
    });
  }
});

async function startServer() {
  // Vite middleware setup if development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started on port ${PORT}`);
  });
}

startServer();
