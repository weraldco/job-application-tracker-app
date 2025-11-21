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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import { useState } from 'react';

interface EditJobModalProps {
	job: Job;
	isOpen: boolean;
	onClose: () => void;
	setIsEditing: (b: boolean) => void;
}

export function EditJobModal({
	job,
	isOpen,
	onClose,
	setIsEditing,
}: EditJobModalProps) {
	const [formData, setFormData] = useState<Job>(job);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const updateJobMutation = useMutation({
		mutationFn: async (payload: { id: string; data: Job }) => {
			return await fetch(`/api/jobs/${payload.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload.data),
			}).then((res) => res.json());
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['job-data'] });
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		updateJobMutation.mutate({ id: formData.id, data: formData });
		setIsEditing(false);
	};

	if (!isOpen) return null;

	return (
		<>
			<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
				<CardContent className="p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-3">
								<Label
									htmlFor="title"
									className="text-sm font-medium text-gray-700"
								>
									Job Title *
								</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									required
									className="mt-1"
								/>
							</div>

							<div className="space-y-3">
								<Label
									htmlFor="company"
									className="text-sm font-medium text-gray-700"
								>
									Company *
								</Label>
								<Input
									id="company"
									value={formData.company}
									onChange={(e) =>
										setFormData({ ...formData, company: e.target.value })
									}
									required
									className="mt-1"
								/>
							</div>

							<div className="space-y-3">
								<Label
									htmlFor="applicationDate"
									className="text-sm font-medium text-gray-700"
								>
									Application Date *
								</Label>
								<Input
									id="applicationDate"
									type="date"
									value={
										formData.applicationDate
											? new Date(formData.applicationDate)
													.toISOString()
													.split('T')[0]
											: ''
									}
									onChange={(e) =>
										setFormData({
											...formData,
											applicationDate: new Date(e.target.value),
										})
									}
									required
									className="mt-1"
								/>
							</div>

							<div className="space-y-3">
								<Label
									htmlFor="location"
									className="text-sm font-medium text-gray-700"
								>
									Location
								</Label>
								<Input
									id="location"
									value={formData.location ?? ''}
									onChange={(e) =>
										setFormData({ ...formData, location: e.target.value })
									}
									className="mt-1"
								/>
							</div>

							<div className="space-y-3">
								<Label
									htmlFor="salary"
									className="text-sm font-medium text-gray-700"
								>
									Salary
								</Label>
								<Input
									id="salary"
									value={Number(formData.salary)}
									onChange={(e) =>
										setFormData({ ...formData, salary: e.target.value })
									}
									className="mt-1"
								/>
							</div>

							<div className="space-y-3">
								<Label
									htmlFor="experienceNeeded"
									className="text-sm font-medium text-gray-700"
								>
									Years of Experience
								</Label>
								<Input
									id="experienceNeeded"
									type="number"
									value={Number(formData.experienceNeeded)}
									onChange={(e) =>
										setFormData({
											...formData,
											experienceNeeded: Number(e.target.value),
										})
									}
									className="mt-1"
								/>
							</div>
						</div>

						<div className="space-y-3">
							<Label
								htmlFor="jobUrl"
								className="text-sm font-medium text-gray-700"
							>
								Job URL
							</Label>
							<Input
								id="jobUrl"
								type="url"
								value={formData.jobUrl ?? ''}
								onChange={(e) =>
									setFormData({ ...formData, jobUrl: e.target.value })
								}
								className="mt-1"
							/>
						</div>

						<div className="space-y-3">
							<Label
								htmlFor="skillsRequired"
								className="text-sm font-medium text-gray-700"
							>
								Required Skills
							</Label>
							<Textarea
								id="skillsRequired"
								value={formData.skillsRequired}
								onChange={(e) =>
									setFormData({ ...formData, skillsRequired: e.target.value })
								}
								rows={3}
								className="mt-1"
							/>
						</div>

						<div className="space-y-3">
							<Label
								htmlFor="jobRequirements"
								className="text-sm font-medium text-gray-700"
							>
								Job Requirements
							</Label>
							<Textarea
								id="jobRequirements"
								value={formData.jobRequirements}
								onChange={(e) =>
									setFormData({ ...formData, jobRequirements: e.target.value })
								}
								rows={4}
								className="mt-1"
							/>
						</div>

						<div className="space-y-3">
							<Label
								htmlFor="notes"
								className="text-sm font-medium text-gray-700"
							>
								Notes
							</Label>
							<Textarea
								id="notes"
								value={formData.notes ?? ''}
								onChange={(e) =>
									setFormData({ ...formData, notes: e.target.value })
								}
								rows={3}
								className="mt-1"
							/>
						</div>

						<div className="flex space-x-3 pt-4 border-t border-gray-200">
							<Button
								type="submit"
								disabled={isSubmitting}
								className="flex-1 bg-blue-400"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Updating...
									</>
								) : (
									'Update Job Application'
								)}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsEditing(false);
								}}
								className="px-6 bg-blue-400"
							>
								Cancel
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
