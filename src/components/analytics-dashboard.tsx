"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Briefcase, Calendar, Target } from "lucide-react"

export function AnalyticsDashboard() {
  // Mock data for demo
  const statusData = [
    { name: "Applied", value: 12, color: "#3B82F6" },
    { name: "Interviewing", value: 4, color: "#F59E0B" },
    { name: "Offer", value: 2, color: "#10B981" },
    { name: "Rejected", value: 6, color: "#EF4444" },
  ]

  const monthlyData = [
    { month: "Jan", applications: 3 },
    { month: "Feb", applications: 5 },
    { month: "Mar", applications: 8 },
    { month: "Apr", applications: 6 },
    { month: "May", applications: 4 },
    { month: "Jun", applications: 7 },
  ]

  const metrics = [
    { label: "Total Applications", value: "24", icon: Briefcase },
    { label: "Interview Rate", value: "25%", icon: Calendar },
    { label: "Offer Rate", value: "8%", icon: Target },
    { label: "Response Rate", value: "42%", icon: TrendingUp },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Analytics Dashboard</span>
        </CardTitle>
        <CardDescription>
          Track your job search performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <metric.icon className="h-6 w-6 mx-auto text-gray-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Status Distribution */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Application Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Applications */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
