import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      authorize: async (credentials) => {
        const parsedCredentials = credentialsSchema.safeParse(credentials)
        if (!parsedCredentials.success) {
          return null
        }

        const { email, password } = parsedCredentials.data

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user?.hashedPassword) {
          return null
        }

        const isValid = await compare(password, user.hashedPassword)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.name = user.name
        token.email = user.email
      }
      return token
    },
  },
} satisfies NextAuthConfig

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig)
export const { GET, POST } = handlers

