import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Header } from "@/components/header"
import { JobTracker } from "@/components/job-tracker"
import { RemindersPanel } from "@/components/reminders-panel"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Application Tracker</h1>
          <p className="text-gray-600 mt-2">Manage and track your job applications efficiently</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <JobTracker />
          </div>
          <div className="space-y-6">
            <AnalyticsDashboard />
            <RemindersPanel />
          </div>
        </div>
      </main>
    </div>
  )
}
