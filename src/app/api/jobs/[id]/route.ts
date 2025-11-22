import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const job = await prisma.job.findFirst({
			where: {
				id: params.id,
				userId: session.user.id,
			},
			include: {
				events: true,
				reminders: true,
				attachments: true,
			},
		});

		if (!job) {
			return NextResponse.json({ error: 'Job not found' }, { status: 404 });
		}

		return NextResponse.json(job);
	} catch (error) {
		console.error('Error fetching job:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// get the id of the data item
		const { id } = await params;

		// check if the user login
		const session = await auth();

		// response error once not login or authorized
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// get all the request data
		const body = await request.json();
		const { events, reminders, attachments, ...jobData } = body;
		// get the data from the database
		const job = await prisma.job.findFirst({
			where: {
				id: id,
				userId: session.user.id,
			},
		});

		// if not in db response error not found
		if (!job) {
			return NextResponse.json({ error: 'Job not found' }, { status: 404 });
		}

		// if founded then update the job
		const updatedJob = await prisma.job.update({
			where: { id },
			data: jobData,
		});
		console.log(updatedJob);
		// return response at updatedjob.
		return NextResponse.json(updatedJob, { status: 201 });
	} catch (error) {
		console.error('Error updating job:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await auth();

		if (!session?.user.id)
			return NextResponse.json({ error: 'Deleting data in unauthorized' });
		const { id } = await params;
		const deleteJob = await prisma.job.delete({ where: { id } });
		return NextResponse.json(deleteJob, { status: 201 });
	} catch (error) {
		console.error('Error deleting job:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
