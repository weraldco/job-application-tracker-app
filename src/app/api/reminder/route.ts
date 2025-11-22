import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const reminder = await prisma.reminder.findMany({
			where: { userId: session.user.id },
			orderBy: { createdAt: 'desc' },
		});

		const jobs = await prisma.job.findMany({
			where: { userId: session.user.id },
		});

		return NextResponse.json({ reminder: reminder, jobs: jobs });
	} catch (error) {
		console.error('Error fetching jobs:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const body = await request.json();

		const { title, description, dueDate, completed, type, jobId } = body;
		const reminder = await prisma.reminder.create({
			data: {
				title,
				description,
				dueDate,
				completed,
				type,
				userId: session.user.id,
				jobId,
			},
		});
		return NextResponse.json(reminder);
	} catch (error) {
		return NextResponse.json({
			error: `Error adding new reminder in backenndm, ${error}`,
		});
	}
}
