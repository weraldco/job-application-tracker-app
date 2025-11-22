import { useToast } from '@/hooks/use-toast';
import { Job, Reminder, ReminderType } from '@prisma/client';

import { Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { CreateReminderInput } from './reminders-panel';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
interface ReminderT {
	isOpen: boolean;
	data: Job[];
	onClose: () => void;
	onReminderAdded: (data: CreateReminderInput) => void;
}

const ReminderAddModal = ({
	isOpen,
	data,
	onClose,
	onReminderAdded,
}: ReminderT) => {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		dueDate: new Date().toISOString().split('T')[0],
		completed: false,
		type: '',
		jobId: '',
	});
	const { toast } = useToast();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [reminderType, setReminderType] = useState<string>('Interview Prep');
	const [jobTitle, setJobTitle] = useState(data[0].title);
	const [dueDate, setDueDate] = useState<Date | null>(null);
	const typeMap: Record<string, ReminderType> = {
		'Interview Prep': 'INTERVIEW_PREP',
		Deadline: 'APPLICATION_DEADLINE',
		'Follow up': 'FOLLOW_UP',
		'Thank you note': 'THANK_YOU_NOTE',
		Other: 'OTHER',
	};
	function formatDateForInput(date: Date | null) {
		if (!date) return '';
		return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
	}
	const handleReminderTypeChange = (reminder: string) => {
		setReminderType(reminder as ReminderType);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		if (jobTitle !== '') {
			console.log('test', data.find((i) => i.title === jobTitle)?.id ?? null);
		} else {
			console.log('No jobTitle', 'INTERVIEW_PREP');
		}

		const selectedJob = data.find((i) => i.title === jobTitle);
		if (!selectedJob) {
			console.error('No job found for title', jobTitle);
			return;
		}
		try {
			const newReminder: CreateReminderInput = {
				title: formData.title,
				description: formData.description,
				dueDate: dueDate,
				completed: formData.completed,
				type:
					reminderType === undefined
						? 'INTERVIEW_PREP'
						: typeMap[reminderType as string],
				jobId: selectedJob.id,
			};
			onReminderAdded(newReminder);
			console.log(newReminder);
			toast({
				title: 'Success',
				description: 'Reminder added successfully!',
			});
			onClose();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to add new reminder',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 bg-neutral-700/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
			<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
				<CardHeader className="flex flex-row items-center justify-between">
					<h2 className="text-xl">Adding New Reminder</h2>
					<button onClick={onClose}>
						<X></X>
					</button>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-3">
							<Label
								htmlFor="title"
								className="text-sm font-medium text-gray-700"
							>
								Reminder For what Job Posting *
							</Label>
							<div className="relative">
								<select
									value={jobTitle ? jobTitle : 'Choose a job title..'}
									onChange={(e) => setJobTitle(e.target.value)}
									className="text-sm border rounded px-2 py-1 bg-white cursor-pointer w-full"
									onClick={(e) => e.stopPropagation()}
								>
									{data.map((d, i) => (
										<option key={i} value={d.title}>
											{d.title}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="space-y-3">
							<Label
								htmlFor="title"
								className="text-sm font-medium text-gray-700"
							>
								Reminder Title *
							</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								required
								className="mt-1"
								placeholder="Enter your reminder title.."
							/>
						</div>
						<div className="space-y-3">
							<Label
								htmlFor="title"
								className="text-sm font-medium text-gray-700"
							>
								Reminder Description *
							</Label>
							<Textarea
								id="skillsRequired"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								rows={3}
								className="mt-1"
								placeholder="Enter your reminder description.."
							/>
						</div>
						<div className="flex flex-row items-center gap-20">
							<div className="space-y-3">
								<Label
									htmlFor="title"
									className="text-sm font-medium text-gray-700"
								>
									Reminder Type *
								</Label>
								<div className="relative">
									<select
										value={reminderType ? reminderType : ''}
										onChange={(e) => handleReminderTypeChange(e.target.value)}
										className="text-sm border rounded px-2 py-1 bg-white cursor-pointer"
										onClick={(e) => e.stopPropagation()}
									>
										{Object.entries(typeMap).map(([key, val]) => (
											<option key={key} value={key}>
												{key}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="space-y-3">
								<Label
									htmlFor="title"
									className="text-sm font-medium text-gray-700"
								>
									Reminder Due *
								</Label>
								<div>
									<input
										type="datetime-local"
										value={formatDateForInput(dueDate)}
										onChange={(e) =>
											setDueDate(
												e.target.value ? new Date(e.target.value) : null
											)
										}
									></input>
								</div>
							</div>
						</div>
						<div className=" flex flex-row gap-4">
							<Button
								type="submit"
								disabled={isSubmitting}
								className="flex-1 bg-blue-500 hover:bg-blue-400 acrive:bg-blue-600 duration-200 text-white"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Adding...
									</>
								) : (
									'Add new reminder'
								)}
							</Button>
							<button className="bg-blue-500 hover:bg-blue-400 acrive:bg-blue-600 duration-200 text-white px-4 py-1 rounded	">
								Cancel
							</button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ReminderAddModal;
