import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { Client } from "@hubspot/api-client";
import { GoogleGenAI } from "@google/genai";
import cookieParser from "cookie-parser";

// Initialize Express
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// --- API Routes ---

// 1. Auth URL Construction
app.get("/api/auth/url", (req, res) => {
  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const redirectUri = `${process.env.APP_URL}/auth/callback`;
  
  if (!clientId) {
    return res.status(500).json({ error: "Missing HUBSPOT_CLIENT_ID" });
  }

  const scope = "crm.objects.deals.read crm.schemas.deals.read crm.objects.contacts.read crm.objects.companies.read";
  const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

  res.json({ url: authUrl });
});

// 2. Auth Callback
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  const redirectUri = `${process.env.APP_URL}/auth/callback`;

  if (!code || !clientId || !clientSecret) {
    return res.status(400).send("Missing code or configuration");
  }

  try {
    // Use fetch for token exchange to avoid library version issues
    const tokenRes = await fetch("https://api.hubapi.com/oauth/v1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code as string,
      }),
    });

    if (!tokenRes.ok) {
      throw new Error(`Token exchange failed: ${tokenRes.statusText}`);
    }

    const tokenResponse = await tokenRes.json();

    // In a real app, store this securely (DB/Session). 
    // For this demo, we'll set it as a secure httpOnly cookie.
    res.cookie("hs_access_token", tokenResponse.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: tokenResponse.expires_in * 1000,
    });
    
    // Also set a flag accessible to JS to know we are logged in
    res.cookie("hs_authenticated", "true", {
      secure: true,
      sameSite: "none",
    });

    // Send success message to window opener
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. You can close this window.</p>
        </body>
      </html>
    `);
  } catch (e) {
    console.error("OAuth Error:", e);
    res.status(500).send("Authentication failed");
  }
});

// 3. User/Portal Info
app.get("/api/hubspot/me", async (req, res) => {
  const accessToken = req.cookies.hs_access_token;
  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  try {
    // HubSpot doesn't have a simple "me" endpoint for the user in the basic scope,
    // but we can check if the token works by listing pipelines or something simple.
    // Or we can just return "connected" if the token exists.
    // Ideally we'd use 'oauth/v1/access-tokens/{token}' to get info, but that requires the token.
    
    const hubspotClient = new Client({ accessToken });
    // Verify connectivity by fetching pipelines
    await hubspotClient.crm.pipelines.pipelinesApi.getAll("deals");
    
    res.json({ status: "connected" });
  } catch (e) {
    console.error("HubSpot API Error:", e);
    res.status(401).json({ error: "Invalid token" });
  }
});

// 4. Fetch Deals for Analysis
app.get("/api/hubspot/deals", async (req, res) => {
  const accessToken = req.cookies.hs_access_token;
  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  try {
    const hubspotClient = new Client({ accessToken });
    
    // Fetch deals with associations and properties
    const dealsResponse = await hubspotClient.crm.deals.basicApi.getPage(
      100, 
      undefined, 
      ["dealname", "amount", "dealstage", "pipeline", "closedate", "hs_lastmodifieddate", "hubspot_owner_id"]
    );

    res.json(dealsResponse.results);
  } catch (e) {
    console.error("HubSpot Deals Error:", e);
    res.status(500).json({ error: "Failed to fetch deals" });
  }
});

// 5. AI Analysis Endpoint
app.post("/api/ai/analyze-pipeline", async (req, res) => {
  const { deals } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  if (!deals || !Array.isArray(deals)) return res.status(400).json({ error: "Invalid deals data" });

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Role: You are an elite Revenue Operations Director and AI Pipeline Coach.
      Task: Analyze the provided sales pipeline data to detect risks, forecast revenue, and coach the sales team.
      
      Data Context:
      - The data is a list of deals from HubSpot.
      - 'dealstage' indicates progress.
      - 'hs_lastmodifieddate' indicates recent activity.
      - 'amount' is the deal value.
      
      Analysis Requirements:
      1. Pipeline Health: Calculate a score (0-100) based on deal velocity, stagnation (last modified date), and stage distribution.
      2. Forecast Confidence: Determine if the pipeline is reliable based on deal age and activity.
      3. Risk Detection: Identify specific deals that are stalled, have missing values, or are stuck in a stage too long.
      4. Deal Velocity: Analyze time-in-stage trends. Identify bottlenecks where deals sit too long.
      5. Executive Summary: Write a concise, high-impact briefing for the VP of Sales. Focus on "So What?" and "Now What?".
      6. Recommended Actions: specific, actionable steps to improve pipeline health.

      Input Data: ${JSON.stringify(deals.slice(0, 50))}

      Output Format (JSON):
      {
        "pipelineHealthScore": number,
        "forecastConfidence": "Low" | "Medium" | "High",
        "keyRisks": [
          { 
            "dealId": string, 
            "risk": string, 
            "severity": "High" | "Medium" | "Low",
            "coachingTip": "Specific advice for the rep on this deal"
          }
        ],
        "velocityAnalysis": {
          "stageBottlenecks": [
            { "stage": "string", "avgDays": number, "status": "Good" | "Warning" | "Critical" }
          ],
          "insight": "Brief analysis of the velocity trends"
        },
        "executiveSummary": "Markdown string",
        "recommendedActions": ["Action 1", "Action 2", "Action 3"]
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const responseText = result.text;
    if (!responseText) throw new Error("No response text");
    
    res.json(JSON.parse(responseText));
  } catch (e) {
    console.error("AI Analysis Error:", e);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

// 6. Demo Data Endpoint
app.get("/api/demo/data", (req, res) => {
  const demoDeals = Array.from({ length: 20 }).map((_, i) => {
    // Create varied created dates to simulate velocity
    const daysAgo = Math.floor(Math.random() * 120) + 5;
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    return {
      id: `demo-${i}`,
      properties: {
        dealname: [
          "Enterprise License Expansion - Acme Corp",
          "Q3 Renewal - Globex",
          "New Logo - Stark Industries",
          "Pilot Program - Wayne Enterprises",
          "Global Rollout - Cyberdyne",
          "SaaS Platform - Umbrella Corp",
          "Consulting Retainer - Massiv Dynamic",
          "Cloud Migration - Hooli",
          "Security Audit - Initech",
          "API Integration - Soylent Corp",
          "Strategic Partnership - Veidt Enterprises",
          "Infrastructure Upgrade - Tyrell Corp"
        ][i % 12] + (i > 11 ? ` ${i}` : ""),
        amount: (Math.floor(Math.random() * 80) + 15) * 1000,
        dealstage: ["appointmentscheduled", "qualifiedtobuy", "presentationscheduled", "decisionmakerbought", "contractsent", "closedwon"][Math.floor(Math.random() * 6)],
        pipeline: "default",
        closedate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        hs_lastmodifieddate: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
        hubspot_owner_id: "owner-1"
      },
      createdAt: createdAt,
      updatedAt: new Date().toISOString(),
      archived: false
    };
  });
  res.json(demoDeals);
});



// 7. Competitor Intel Analysis (New Feature)
app.post("/api/ai/analyze-competitors", async (req, res) => {
  const { deals } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Filter for high-value deals to analyze
    const highValueDeals = deals
      .filter((d: any) => Number(d.properties.amount) > 50000)
      .slice(0, 3); // Limit to top 3 for demo performance

    if (highValueDeals.length === 0) {
      return res.json({ competitorIntel: [] });
    }

    const prompt = `
      Role: You are a Competitive Intelligence Strategist.
      Task: For each of these high-value deals, identify likely competitors based on the deal name and industry context.
      Then, use Google Search to find ONE recent news item or strategic shift about that competitor that could be used as leverage in a sales conversation.
      
      Deals: ${JSON.stringify(highValueDeals.map((d: any) => ({ id: d.id, name: d.properties.dealname, amount: d.properties.amount })))}
      
      Output Format (JSON):
      {
        "competitorIntel": [
          {
            "dealId": "string (matching input id)",
            "competitorName": "string",
            "recentNews": "string (1 sentence summary of recent news)",
            "winStrategy": "string (1 sentence on how to position against this news)",
            "sourceUrl": "string (url from search result)"
          }
        ]
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const responseText = result.text;
    if (!responseText) throw new Error("No response text");
    
    res.json(JSON.parse(responseText));
  } catch (e) {
    console.error("Competitor Analysis Error:", e);
    res.status(500).json({ error: "Competitor analysis failed" });
  }
});

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
