import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const jobs = await prisma.job.groupBy({
			by: ['status'],
			_count: { status: true },
		});

		const monthly = await prisma.job.groupBy({
			by: ['createdAt'],
			_count: { createdAt: true },
		});

		const result = jobs.reduce((acc, job) => {
			acc[job.status] = job._count.status;
			return acc;
		}, {} as Record<string, number>);

		const total = jobs.reduce((acc, job) => {
			return acc + job._count.status;
		}, 0);

		const monthData = monthly.reduce((acc, job) => {
			const date = new Date(job.createdAt);

			const month = date.toLocaleDateString('en-US', { month: 'long' });
			acc[month] = (acc[month] || 0) + job._count.createdAt;
			return acc;
		}, {} as Record<string, number>);

		return NextResponse.json({
			statusData: result,
			total: total,
			monthData: monthData,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch analytics' },
			{ status: 500 }
		);
	}
}
