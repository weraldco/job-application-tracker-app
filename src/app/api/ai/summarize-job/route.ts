/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';
import mammoth from 'mammoth';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
// pdf-parse will be dynamically imported where needed to avoid default export typing issues

// Create OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const apiKey = process.env.GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

async function callApiWithBackoff(payload: any, retries = 5, delay = 1000) {
	// console.log('Sending payload:', JSON.stringify(payload, null, 2));
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
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const textData = formData.get('textData') as string | null;

		let extractedText = '';

		// DEBUGGING CHECKING IF THE DATA IS STORED IN FORM DATA
		console.log('textdata', textData);
		console.log('file', file);
		// IF TEXTDATA IS PROVIDED
		if (textData && !file) {
			extractedText = textData;
		}

		// IF FILE IS PROVIDED
		if (file) {
			const buffer = Buffer.from(await file.arrayBuffer());

			// A. IMAGE (OCR using Gemini Vision)
			if (file.type.startsWith('image/')) {
				const base64 = buffer.toString('base64');

				const visionPayload = {
					contents: [
						{
							parts: [
								{ text: 'Extract ALL text from this job posting screenshot.' },
								{
									inlineData: {
										mimeType: file.type,
										data: base64,
									},
								},
							],
						},
					],
				};

				const visionResult = await callApiWithBackoff(visionPayload);

				extractedText =
					visionResult?.candidates?.[0]?.content?.parts?.[0]?.text || '';

				if (!extractedText) {
					return NextResponse.json(
						{ error: 'Failed to extract text from image.' },
						{ status: 500 }
					);
				}
			}

			// B. PDF
			if (file.type === 'application/pdf') {
				console.log('PDF');
			}

			// C. DOCX
			else if (
				file.type ===
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			) {
				const result = await mammoth.extractRawText({ buffer });
				extractedText = result.value || '';
				if (!extractedText.trim()) {
					return NextResponse.json(
						{ error: 'Could not extract text from DOCX.' },
						{ status: 400 }
					);
				}
			}

			// Unsupported file
			else {
				return NextResponse.json(
					{ error: 'Unsupported file type.' },
					{ status: 400 }
				);
			}
		}

		// FINAL SAFETY CHECK
		if (!extractedText.trim()) {
			return NextResponse.json(
				{ error: 'No text found to summarize.' },
				{ status: 400 }
			);
		}

		// ============== 3. Build Prompt for Job Extractor ==============
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
                    ${extractedText}
		`;

		const payload = {
			contents: [{ role: 'user', parts: [{ text: prompt }] }],
			generationConfig: {
				responseMimeType: 'application/json',
				responseSchema: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						company: { type: 'string' },
						jobDetails: { type: 'string' },
						jobRequirements: { type: 'array', items: { type: 'string' } },
						skillsRequired: { type: 'array', items: { type: 'string' } },
						experienceNeeded: { type: 'number' },
						location: { type: 'string' },
						salary: { type: 'number' },
					},
					// required: ['title', 'company', 'jobDetails'],
				},
			},
		};

		// ============== 4. CALL GEMINI ==============
		const result = await callApiWithBackoff(payload);

		const candidate = result?.candidates?.[0]?.content?.parts?.[0];
		if (!candidate?.text) {
			return NextResponse.json(
				{ error: 'Structured JSON not returned by Gemini.' },
				{ status: 500 }
			);
		}

		// Parse the JSON result
		const structuredData =
			typeof candidate.text === 'string'
				? JSON.parse(candidate.text)
				: candidate.text;

		return NextResponse.json(structuredData);
	} catch (error: any) {
		console.error('Error:', error);
		return NextResponse.json(
			{ error: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}
