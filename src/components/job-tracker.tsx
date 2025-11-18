'use client';

import { AddJobModal } from '@/components/add-job-modal';
import { JobCard } from '@/components/job-card';
import { JobSummarizerModal } from '@/components/job-summarizer-modal';
import { Button } from '@/components/ui/button';
import { Job, JobStatus } from '@prisma/client';
import { Plus, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function JobTracker() {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isSummarizerModalOpen, setIsSummarizerModalOpen] = useState(false);
	const [filter, setFilter] = useState<JobStatus | 'ALL'>('ALL');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchJobs();
	}, []);

	const fetchJobs = async () => {
		try {
			const response = await fetch('/api/jobs');
			if (response.ok) {
				const data = await response.json();
				setJobs(data);
			}
		} catch (error) {
			console.error('Failed to fetch jobs:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleJobAdded = (newJob: Job) => {
		setJobs((prev) => [newJob, ...prev]);
		setIsAddModalOpen(false);
	};

	const handleJobUpdated = (updatedJob: Job) => {
		setJobs((prev) =>
			prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
		);
	};

	const handleJobDeleted = (jobId: string) => {
		setJobs((prev) => prev.filter((job) => job.id !== jobId));
	};

	const filteredJobs =
		filter === 'ALL' ? jobs : jobs.filter((job) => job.status === filter);

	const statusCounts = {
		APPLIED: jobs.filter((job) => job.status === 'APPLIED').length,
		INTERVIEWING: jobs.filter((job) => job.status === 'INTERVIEWING').length,
		OFFER: jobs.filter((job) => job.status === 'OFFER').length,
		REJECTED: jobs.filter((job) => job.status === 'REJECTED').length,
	};

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow p-6">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
					<div className="space-y-3">
						<div className="h-20 bg-gray-200 rounded"></div>
						<div className="h-20 bg-gray-200 rounded"></div>
						<div className="h-20 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow">
			<div className="p-6 border-b">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold text-gray-900">
						Job Applications
					</h2>
					<div className="flex space-x-2">
						<Button
							onClick={() => setIsSummarizerModalOpen(true)}
							className="flex items-center space-x-2"
						>
							<Sparkles className="h-4 w-4" />
							<span>AI Summarize</span>
						</Button>
						<Button
							onClick={() => setIsAddModalOpen(true)}
							className="flex items-center space-x-2"
						>
							<Plus className="h-4 w-4" />
							<span>Add Job</span>
						</Button>
					</div>
				</div>

				{/* Status Filter */}
				<div className="flex space-x-2 mb-4">
					<Button
						variant={filter === 'ALL' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setFilter('ALL')}
					>
						All ({jobs.length})
					</Button>
					<Button
						variant={filter === 'APPLIED' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setFilter('APPLIED')}
					>
						Applied ({statusCounts.APPLIED})
					</Button>
					<Button
						variant={filter === 'INTERVIEWING' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setFilter('INTERVIEWING')}
					>
						Interviewing ({statusCounts.INTERVIEWING})
					</Button>
					<Button
						variant={filter === 'OFFER' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setFilter('OFFER')}
					>
						Offer ({statusCounts.OFFER})
					</Button>
					<Button
						variant={filter === 'REJECTED' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setFilter('REJECTED')}
					>
						Rejected ({statusCounts.REJECTED})
					</Button>
				</div>
			</div>

			<div className="p-6">
				{filteredJobs.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<Plus className="h-12 w-12 mx-auto" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No jobs found
						</h3>
						<p className="text-gray-500 mb-4">
							{filter === 'ALL'
								? 'Start tracking your job applications by adding your first job.'
								: `No jobs with status "${filter.toLowerCase()}".`}
						</p>
						<Button onClick={() => setIsAddModalOpen(true)}>
							Add Your First Job
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						{filteredJobs.map((job) => (
							<JobCard
								key={job.id}
								job={job}
								onUpdate={handleJobUpdated}
								onDelete={handleJobDeleted}
							/>
						))}
					</div>
				)}
			</div>

			<AddJobModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onJobAdded={handleJobAdded}
			/>

			<JobSummarizerModal
				isOpen={isSummarizerModalOpen}
				onClose={() => setIsSummarizerModalOpen(false)}
				onJobAdded={handleJobAdded}
			/>
		</div>
	);
}
