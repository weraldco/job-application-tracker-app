import { prisma } from "@/lib/prisma"

async function createDemoUser() {
  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "demo@example.com" }
    })

    if (!existingUser) {
      const demoUser = await prisma.user.create({
        data: {
          email: "demo@example.com",
          name: "Demo User",
          emailVerified: new Date(),
        }
      })
      console.log("Demo user created:", demoUser)
    } else {
      console.log("Demo user already exists")
    }
  } catch (error) {
    console.error("Error creating demo user:", error)
  }
}

createDemoUser()
