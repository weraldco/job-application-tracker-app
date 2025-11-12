import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper: fetch text content from a URL
async function fetchPageContent(url: string): Promise<string> {
  try {
    // Use ScraperAPI to fetch LinkedIn or other protected pages
    const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
    if (!SCRAPER_API_KEY) throw new Error("Missing ScraperAPI key");

    const apiUrl = `https://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);

    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

    const html = await res.text();

    // Basic text cleaning
    const cleanText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return cleanText.slice(0, 15000);
  } catch (error) {
    console.error("Error fetching page:", error);
    throw new Error("Failed to fetch page content");
  }
}


export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Fetch job posting HTML content
    const pageText = await fetchPageContent(url);

    // Use OpenAI to extract and summarize job details
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4o" if you have access
      messages: [
        {
          role: "system",
          content:
            "You are a job posting summarizer. Extract clear, structured information from job listings.",
        },
        {
          role: "user",
          content: `
Extract key details from the following job posting:

${pageText}

Provide a JSON object with the following keys:
{
  "title": string,
  "company": string,
  "skillsRequired": string,
  "jobRequirements": string,
  "experienceNeeded": string,
  "location": string,
  "salary": string,
  "summary": string
}
If a field is not found, use an empty string.
`,
        },
      ],
      temperature: 0.3,
    });

    const rawOutput = completion.choices[0].message?.content || "{}";

    let structuredData;
    try {
      structuredData = JSON.parse(rawOutput);
    } catch {
      structuredData = { summary: rawOutput };
    }

    return NextResponse.json(structuredData);
  } catch (error) {
    console.error("Error summarizing job:", error);
    return NextResponse.json(
      { error: "Failed to summarize job posting" },
      { status: 500 }
    );
  }
}
