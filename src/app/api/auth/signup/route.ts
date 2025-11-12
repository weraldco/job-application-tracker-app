import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { z } from "zod"

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => issue.message)
      return NextResponse.json(
        { error: errorMessages.join(", ") },
        { status: 400 },
      )
    }

    const { email, name, password } = parsed.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      )
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("[SIGNUP_POST]", error)
    return NextResponse.json(
      { error: "Unexpected error while creating account" },
      { status: 500 },
    )
  }
}

