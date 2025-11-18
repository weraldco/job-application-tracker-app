'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@prisma/client';
import { Check, Loader2, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

interface JobSummarizerModalProps {
	isOpen: boolean;
	onClose: () => void;
	onJobAdded: (job: Job) => void;
}

export interface SummarizedJob {
	title: string;
	company: string;
	applicationDate: Date;
	jobUrl?: string;
	skillsRequired: string[];
	jobRequirements: string[];
	experienceNeeded: number | null;
	notes?: string;
	location?: string;
	salary?: string;
}

export function JobSummarizerModal({
	isOpen,
	onClose,
	onJobAdded,
}: JobSummarizerModalProps) {
	const [textData, setTextData] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [summarizedJob, setSummarizedJob] = useState<SummarizedJob | null>(
		null
	);

	const [file, setFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [isJobDescription, setIsJobDescription] = useState(false);
	const [isJobFile, setIsJobFile] = useState(false);

	const { toast } = useToast();

	const handleSummarize = async () => {
		const formData = new FormData();

		if (file) {
			formData.append('file', file);
		}
		if (textData) {
			formData.append('textData', textData);
		}
		setIsLoading(true);
		try {
			const response = await fetch('/api/ai/summarize-job', {
				method: 'POST',
				body: formData,
			});
			if (response.ok) {
				const data = await response.json();
				setSummarizedJob(data);
				toast({
					title: 'Success',
					description: 'Job posting summarized successfully!',
				});
			} else {
				const error = await response.json();
				toast({
					title: 'Error',
					description: error.message || 'Failed to summarize job posting',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to summarize job posting',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
			setIsJobDescription(false);
			setIsJobFile(false);
		}
	};

	const handleSubmit = async () => {
		if (!summarizedJob) return;
		console.log(summarizedJob);
		setIsSubmitting(true);
		try {
			const response = await fetch('/api/jobs', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...summarizedJob,
					applicationDate: new Date().toISOString(),
					jobUrl: summarizedJob?.jobUrl ? summarizedJob.jobUrl : '',
					skillsRequired: summarizedJob.skillsRequired.join(','),
					jobRequirements: summarizedJob.jobRequirements.join(','),
					salary: String(summarizedJob.salary),
				}),
			});
			if (response.ok) {
				const job = await response.json();
				onJobAdded(job);
				toast({
					title: 'Success',
					description: 'Job application added successfully!',
				});
				handleClose();
			} else {
				toast({
					title: 'Error',
					description: 'Failed to add job application',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to add job application',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setTextData('');
		setSummarizedJob(null);
		setIsLoading(false);
		setIsSubmitting(false);
		onClose();
	};

	const handleCancel = () => {
		console.log('Cancelling...');
		setTextData('');
		setFile(null);
		setSummarizedJob(null);
	};

	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 bg-neutral-700/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
			<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
				<CardHeader>
					<CardTitle className="flex items-center space-x-2 justify-between">
						<div className="flex items-center gap-2">
							<Sparkles className="h-5 w-5" />
							<span>AI Job Summarizer</span>
						</div>
						<button
							className="bg-neutral-100 rounded hover:bg-neutral-200 duration-200"
							onClick={handleClose}
						>
							<X />
						</button>
					</CardTitle>
					<CardDescription>
						Paste a job posting URL or text to automatically extract key
						information
					</CardDescription>
				</CardHeader>
				{!isJobDescription && !isJobFile && summarizedJob === null && (
					<CardContent>
						<div className=" w-full flex items-center justify-evenly">
							<button
								className="summarizer-btn"
								onClick={() => {
									setIsJobDescription(true);
									setIsJobFile(false);
								}}
							>
								Using Job Description
							</button>
							<button
								className="summarizer-btn"
								onClick={() => {
									setIsJobDescription(false);
									setIsJobFile(true);
								}}
							>
								Using Job File (PDF,Images,Docx)
							</button>
						</div>
					</CardContent>
				)}
				<CardContent className="space-y-6">
					{isJobDescription && (
						<>
							<div className="space-y-2">
								<Label htmlFor="url">Job Posting Text Description</Label>
								<Textarea
									id="url"
									placeholder="Paste the job posting URL or copy the full job description text here..."
									value={textData}
									onChange={(e) => setTextData(e.target.value)}
									rows={4}
								/>
							</div>

							<div className="flex flex-row items-center justify-evenly gap-4">
								<Button
									onClick={handleSummarize}
									disabled={isLoading || !textData}
									className="w-full bg-blue-400 duration-200 hover:bg-blue-500 active:bg-blue-600 text-white"
								>
									{isLoading ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Analyzing...
										</>
									) : (
										<>
											<Sparkles className="h-4 w-4 mr-2" />
											Summarize Job Posting
										</>
									)}
								</Button>
								<Button
									className="px-10 bg-blue-400 duration-200 hover:bg-blue-500 active:bg-blue-600 text-white"
									onClick={() => {
										setIsJobDescription(false);
										setTextData('');
									}}
								>
									Cancel
								</Button>
							</div>
						</>
					)}
					{isJobFile && (
						<>
							<div>
								<input
									type="file"
									accept=".png,.jpg,.jpeg,.pdf,.docx"
									onChange={(e) => setFile(e.target.files?.[0] ?? null)}
								/>
							</div>
							<div className="flex flex-row items-center justify-evenly gap-4">
								<Button
									onClick={handleSummarize}
									disabled={isLoading || !file}
									className="w-full bg-blue-400 duration-200 hover:bg-blue-500 active:bg-blue-600 text-white"
								>
									{isLoading ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Analyzing...
										</>
									) : (
										<>
											<Sparkles className="h-4 w-4 mr-2" />
											Summarize Job Posting
										</>
									)}
								</Button>
								<Button
									className="px-10 bg-blue-400 duration-200 hover:bg-blue-500 active:bg-blue-600 text-white"
									onClick={() => {
										setIsJobFile(false);
										setFile(null);
									}}
								>
									Cancel
								</Button>
							</div>
						</>
					)}

					{summarizedJob && (
						<div className="space-y-4 border-t pt-4">
							<div className="flex items-center space-x-2 text-green-600">
								<Check className="h-4 w-4" />
								<span className="font-medium">Job Information Extracted</span>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="title">Job Title</Label>
									<Input
										id="title"
										value={summarizedJob.title}
										onChange={(e) =>
											setSummarizedJob({
												...summarizedJob,
												title: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="company">Company</Label>
									<Input
										id="company"
										value={summarizedJob.company}
										onChange={(e) =>
											setSummarizedJob({
												...summarizedJob,
												company: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="location">Location</Label>
									<Input
										id="location"
										value={summarizedJob.location || ''}
										onChange={(e) =>
											setSummarizedJob({
												...summarizedJob,
												location: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="salary">Salary</Label>
									<Input
										id="salary"
										value={summarizedJob.salary || 0}
										onChange={(e) =>
											setSummarizedJob({
												...summarizedJob,
												salary: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="experience">Years of Experience</Label>
									<Input
										id="experience"
										type="number"
										value={summarizedJob.experienceNeeded || 0}
										onChange={(e) =>
											setSummarizedJob({
												...summarizedJob,
												experienceNeeded: e.target.value
													? parseInt(e.target.value)
													: null,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="skills">Required Skills</Label>
									<Textarea
										id="skills"
										value={summarizedJob.skillsRequired}
										onChange={(e) =>
											setSummarizedJob({
												...summarizedJob,
												skillsRequired: e.target.value.split(','),
											})
										}
										rows={3}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="requirements">Job Requirements</Label>
								<Textarea
									id="requirements"
									value={summarizedJob.jobRequirements}
									onChange={(e) =>
										setSummarizedJob({
											...summarizedJob,
											jobRequirements: e.target.value.split(','),
										})
									}
									rows={4}
								/>
							</div>

							<div className="flex space-x-2">
								<Button
									onClick={handleSubmit}
									disabled={isSubmitting}
									className="flex-1 bg-blue-500 text-white hover:bg-blue-400 duration-200 active:bg-blue-600"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Adding Job...
										</>
									) : (
										'Add Job Application'
									)}
								</Button>
								<Button
									variant="outline"
									className="bg-neutral-100 duration-200 hover:bg-neutral-200 active:bg-neutral-300"
									onClick={handleCancel}
								>
									Cancel
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
