"use client"

import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function Header() {
  const { data: session } = useSession()

  const userName = session?.user?.name ?? session?.user?.email ?? "User"

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Job Tracker</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">{userName}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
