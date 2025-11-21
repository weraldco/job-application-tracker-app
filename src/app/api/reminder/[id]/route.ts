import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		// get the id
		const { id } = await params;

		// check the user if login
		const session = await auth();

		// error message for not authorize user
		if (!session?.user.id) {
			return NextResponse.json({ error: 'Unauthorize user!' }, { status: 401 });
		}

		// get the data from request
		const body = await request.json();

		// get the data from the db using id
		const reminder = await prisma.reminder.findFirst({ where: { id } });

		// if job not existing response error
		if (!reminder)
			return NextResponse.json(
				{ error: 'Reminded not found!' },
				{ status: 404 }
			);
		// update the reminder
		const updateJob = await prisma.reminder.update({
			where: { id },
			data: {
				completed: body.completed,
			},
		});

		return NextResponse.json(updateJob, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Error updating reminder' },
			{ status: 500 }
		);
	}
};

export const DELETE = async (
	req: NextRequest,
	{ params }: { params: { id: string } }
) => {
	const { id } = params;
	const deleteReminder = await prisma.reminder.delete({ where: { id } });

	if (!deleteReminder)
		return NextResponse.json(
			{ error: 'Deleting reminder failed!' },
			{ status: 404 }
		);
	return NextResponse.json(deleteReminder, { status: 200 });
};
