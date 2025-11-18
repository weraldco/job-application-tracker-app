'use client';

import { JobDetailModal } from '@/components/job-detail-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job, JobStatus } from '@prisma/client';
import { format } from 'date-fns';
import {
	Calendar,
	DollarSign,
	Edit,
	ExternalLink,
	MapPin,
	MoreVertical,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { EditJobModal } from './edit-job-modal';

interface JobCardProps {
	job: Job;
	onUpdate: (job: Job) => void;
	onDelete: (jobId: string) => void;
}

const statusColors = {
	APPLIED: 'bg-blue-100 text-blue-800',
	INTERVIEWING: 'bg-yellow-100 text-yellow-800',
	OFFER: 'bg-green-100 text-green-800',
	REJECTED: 'bg-red-100 text-red-800',
	WITHDRAWN: 'bg-gray-100 text-gray-800',
};

export function JobCard({ job, onUpdate, onDelete }: JobCardProps) {
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isEditJobOpen, setIsEditJobOpen] = useState(false);

	const handleStatusChange = async (newStatus: JobStatus) => {
		try {
			const response = await fetch(`/api/jobs/${job.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status: newStatus }),
			});

			if (response.ok) {
				const updatedJob = await response.json();
				onUpdate(updatedJob);
			}
		} catch (error) {
			console.error('Failed to update job status:', error);
		}
	};

	const handleDelete = async () => {
		if (confirm('Are you sure you want to delete this job application?')) {
			try {
				const response = await fetch(`/api/jobs/${job.id}`, {
					method: 'DELETE',
				});

				if (response.ok) {
					onDelete(job.id);
				}
			} catch (error) {
				console.error('Failed to delete job:', error);
			}
		}
	};

	return (
		<>
			<div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer  ">
				<div className="flex items-start justify-between ">
					<div
						className="flex-1 w-full "
						onClick={() => setIsDetailModalOpen(true)}
					>
						<div className="flex items-center space-x-3 mb-2">
							<h3 className="text-lg font-semibold text-gray-900">
								{job.title}
							</h3>
							<Badge className={statusColors[job.status]}>{job.status}</Badge>
						</div>

						<p className="text-gray-600 mb-3">{job.company}</p>

						<div className="flex items-center space-x-4 text-sm text-gray-500">
							<div className="flex items-center space-x-1">
								<Calendar className="h-4 w-4" />
								<span>
									{format(new Date(job.applicationDate), 'MMM dd, yyyy')}
								</span>
							</div>

							{job.location && (
								<div className="flex items-center space-x-1">
									<MapPin className="h-4 w-4" />
									<span>{job.location}</span>
								</div>
							)}

							{job.salary && (
								<div className="flex items-center space-x-1">
									<DollarSign className="h-4 w-4" />
									<span>{job.salary}</span>
								</div>
							)}
						</div>

						{job.skillsRequired && (
							<div className="mt-3  w-full flex flex-row items-start">
								<span className="font-medium">Skills:</span>
								<div className="flex flex-wrap text-sm gap-2">
									{job.skillsRequired.split(',').map((skill, i) => (
										<SkillsItem key={i}>{skill}</SkillsItem>
									))}
								</div>
							</div>
						)}

						{job.experienceNeeded !== null && (
							<div className="mt-2">
								<p className="text-sm text-gray-600">
									<span className="font-medium">Experience:</span>
									{job.experienceNeeded ? job.experienceNeeded : 0} years
								</p>
							</div>
						)}
					</div>

					<div className="flex items-center space-x-2 ml-4">
						{job.jobUrl && (
							<Button
								variant="outline"
								className="cursor-pointer"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									window.open(job.jobUrl ?? undefined, '_blank');
								}}
							>
								<ExternalLink className="h-4 w-4" />
							</Button>
						)}

						<div className="relative">
							<select
								value={job.status}
								onChange={(e) =>
									handleStatusChange(e.target.value as JobStatus)
								}
								className="text-sm border rounded px-2 py-1 bg-white cursor-pointer"
								onClick={(e) => e.stopPropagation()}
							>
								<option value="APPLIED">Applied</option>
								<option value="INTERVIEWING">Interviewing</option>
								<option value="OFFER">Offer</option>
								<option value="REJECTED">Rejected</option>
								<option value="WITHDRAWN">Withdrawn</option>
							</select>
						</div>

						<Button
							variant="outline"
							size="sm"
							className="cursor-pointer"
							onClick={(e) => {
								e.stopPropagation();
								handleDelete();
							}}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			<JobDetailModal
				job={job}
				isOpen={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
				onUpdate={onUpdate}
			/>
		</>
	);
}

const SkillsItem = ({ children }: { children: React.ReactNode }) => {
	return <div className="bg-red-50 px-2 py-1 rounded">{children}</div>;
};
