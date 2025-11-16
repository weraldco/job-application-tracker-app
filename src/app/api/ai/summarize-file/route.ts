/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Create OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const apiKey = process.env.GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

async function callApiWithBackoff(payload: any, retries = 5, delay = 1000) {
	console.log('Sending payload:', JSON.stringify(payload, null, 2));
	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		if (response.status === 429 && retries > 0) {
			console.warn(`Rate limit exceeded. Retrying in ${delay}ms..`);
			await new Promise((res) => setTimeout(res, delay));
			return callApiWithBackoff(payload, retries - 1, delay * 2);
		}
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`API call failed: ${error.message}`);
		} else {
			throw new Error('API call failed: Unknown error');
		}
	}
}

export async function POST(request: NextRequest) {
	const formData = await request.json();

	const file = formData.get('file') as File | null;
	const textData = formData.get('textData') as string | null;

	let extractedText = '';

	if (textData && !file) {
		extractedText = textData;
	}
	// if (!textData) {
	// 	return NextResponse.json({ error: 'URL is required' }, { status: 400 });
	// }

	if (!process.env.GEMINI_API_KEY) {
		return NextResponse.json(
			{ error: 'Gemini API key not configured' },
			{ status: 500 }
		);
	}

	const prompt = `
                    You are a job posting details extractor. Your task is to extract the key information from the provided job posting text. 
                    The output should be a JSON object with the following fields:
                    - title: The title of the job.
                    - company: The name of the company.
                    - jobDetails: A summary of the job description. Keep it concise, but include key responsibilities.
                    - jobRequirements: A summary of the candidate requirements, such as qualifications and experience.
                    - skillRequired: A list of specific skills required for the role.
                    - experienceNeeded: number of years of experience
                    - location: Location of the company, address of the company.
                    - salary: A salary of this job posting
                    Provided job posting text:
                    ${textData}
                `;
	const chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];

	const payload = {
		contents: chatHistory,
		generationConfig: {
			responseMimeType: 'application/json',
			responseSchema: {
				type: 'object',
				properties: {
					title: { type: 'string' },
					company: { type: 'string' },
					jobDetails: { type: 'string' },
					jobRequirements: { type: 'array', items: { type: 'string' } },
					skillRequired: { type: 'array', items: { type: 'string' } },
					experienceNeeded: { type: 'number' },
					location: { type: 'string' },
					salary: { type: 'number' },
				},
				required: ['title', 'company', 'jobDetails'],
			},
		},
	};

	try {
		const result = await callApiWithBackoff(payload);

		const candidate = result?.candidates?.[0]?.content?.parts?.[0];

		if (!candidate?.text) {
			return NextResponse.json(
				{ error: 'No response from Gemini' },
				{ status: 500 }
			);
		}
		let structureData;
		try {
			structureData =
				typeof candidate.text === 'string'
					? JSON.parse(candidate.text)
					: candidate.text;
		} catch {
			structureData = candidate.text;
		}

		return NextResponse.json(structureData);
	} catch (error) {
		console.error('Gemini API error:', error);
		return NextResponse.json(
			{ error: 'Something went wrong with Gemini API' },
			{ status: 500 }
		);
	}
}
