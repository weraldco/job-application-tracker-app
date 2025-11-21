'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Job } from '@prisma/client';
import { format } from 'date-fns';
import {
	Calendar,
	DollarSign,
	Edit,
	ExternalLink,
	Loader2,
	MapPin,
	Trash2,
	X,
} from 'lucide-react';
import { useState } from 'react';
import { EditJobModal } from './edit-job-modal';
import { SkillsItem } from './skill-item';

interface JobDetailModalProps {
	job: Job;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (job: Job) => void;
}

export function JobDetailModal({
	job,
	isOpen,
	onClose,
	onUpdate,
}: JobDetailModalProps) {
	const [isEditing, setIsEditing] = useState(false);
	const statusColors = {
		APPLIED: 'bg-blue-100 text-blue-800',
		INTERVIEWING: 'bg-yellow-100 text-yellow-800',
		OFFER: 'bg-green-100 text-green-800',
		REJECTED: 'bg-red-100 text-red-800',
		WITHDRAWN: 'bg-gray-100 text-gray-800',
	};

	const handleClose = () => {
		onClose();
	};

	if (!isOpen) return null;
	return (
		<>
			<div className="fixed inset-0 bg-neutral-700/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
				{!isEditing ? (
					<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center space-x-3">
										<span>{job.title}</span>
										<Badge className={statusColors[job.status]}>
											{job.status}
										</Badge>
									</CardTitle>
									<CardDescription className="text-lg">
										{job.company}
									</CardDescription>
								</div>
								<div className="flex items-center space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsEditing(!isEditing)}
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button variant="outline" size="sm" onClick={onClose}>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Basic Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center space-x-2">
									<Calendar className="h-4 w-4 text-gray-500" />
									<span className="text-sm text-gray-600">
										Applied:{' '}
										{format(new Date(job.applicationDate), 'MMM dd, yyyy')}
									</span>
								</div>

								{job.location && (
									<div className="flex items-center space-x-2">
										<MapPin className="h-4 w-4 text-gray-500" />
										<span className="text-sm text-gray-600">
											{job.location}
										</span>
									</div>
								)}

								{job.salary && (
									<div className="flex items-center space-x-2">
										<span className="text-sm text-gray-600">
											Salary:{' '}
											{job.salary !== '0' ? (
												<span className="flex flex-row items-center">
													<DollarSign className="h-4 w-4 text-gray-500" />
													{job.salary}
												</span>
											) : (
												'not disclosed'
											)}
										</span>
									</div>
								)}

								{job.experienceNeeded !== null && (
									<div className="flex items-center space-x-2">
										<span className="text-sm text-gray-600">
											Experience: {job.experienceNeeded} years
										</span>
									</div>
								)}
							</div>

							{/* Job URL */}
							{job.jobUrl && (
								<div>
									<h3 className="font-medium mb-2">Job Posting</h3>
									<Button
										variant="outline"
										onClick={() => {
											if (job.jobUrl) window.open(job.jobUrl, '_blank');
										}}
										className="flex items-center space-x-2"
									>
										<ExternalLink className="h-4 w-4" />
										<span>View Original Posting</span>
									</Button>
								</div>
							)}

							{/* Skills Required */}
							{job.skillsRequired && (
								<div>
									<h3 className="font-medium mb-2">Required Skills</h3>
									<div className="text-sm text-gray-600 flex flex-row flex-wrap gap-2">
										{job.skillsRequired.split(',').map((skill, i) => (
											<SkillsItem key={i}>{skill}</SkillsItem>
										))}
									</div>
								</div>
							)}

							{/* Job Requirements */}
							{job.jobRequirements && (
								<div>
									<h3 className="font-medium mb-2">Job Requirements</h3>
									<p className="text-sm text-gray-600 whitespace-pre-wrap">
										{job.jobRequirements}
									</p>
								</div>
							)}

							{/* Notes */}
							{job.notes && (
								<div>
									<h3 className="font-medium mb-2">Notes</h3>
									<p className="text-sm text-gray-600 whitespace-pre-wrap">
										{job.notes}
									</p>
								</div>
							)}

							{/* Actions */}
							<div className="flex space-x-2 pt-4 border-t">
								<Button variant="outline" disabled className="flex-1">
									Add Event
								</Button>
								<Button variant="outline" className="flex-1">
									Add Reminder
								</Button>
								<Button variant="outline" disabled className="flex-1">
									Upload Document
								</Button>
							</div>
						</CardContent>
					</Card>
				) : (
					<EditJobModal
						job={job}
						isOpen={isOpen}
						onClose={onClose}
						setIsEditing={setIsEditing}
					/>
				)}
			</div>
		</>
	);
}
