import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobs = await prisma.job.findMany({
      where: { userId: session.user.id },
      include: {
        events: true,
        reminders: true,
        attachments: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      company,
      applicationDate,
      status = "APPLIED",
      jobUrl,
      skillsRequired,
      jobRequirements,
      experienceNeeded,
      notes,
      salary,
      location,
    } = body

    const job = await prisma.job.create({
      data: {
        title,
        company,
        applicationDate: new Date(applicationDate),
        status,
        jobUrl,
        skillsRequired,
        jobRequirements,
        experienceNeeded,
        notes,
        salary,
        location,
        userId: session.user.id,
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
