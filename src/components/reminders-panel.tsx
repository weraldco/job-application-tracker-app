"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Plus, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"

export function RemindersPanel() {
  // Mock data for demo
  const reminders = [
    {
      id: "1",
      title: "Follow up with TechCorp",
      description: "Send thank you email after interview",
      dueDate: new Date("2024-01-15"),
      completed: false,
      type: "FOLLOW_UP" as const,
    },
    {
      id: "2",
      title: "Prepare for Google interview",
      description: "Review system design concepts",
      dueDate: new Date("2024-01-20"),
      completed: false,
      type: "INTERVIEW_PREP" as const,
    },
    {
      id: "3",
      title: "Submit application to StartupXYZ",
      description: "Application deadline approaching",
      dueDate: new Date("2024-01-12"),
      completed: true,
      type: "APPLICATION_DEADLINE" as const,
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "FOLLOW_UP":
        return "bg-blue-100 text-blue-800"
      case "INTERVIEW_PREP":
        return "bg-yellow-100 text-yellow-800"
      case "APPLICATION_DEADLINE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "FOLLOW_UP":
        return "Follow Up"
      case "INTERVIEW_PREP":
        return "Interview Prep"
      case "APPLICATION_DEADLINE":
        return "Deadline"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Reminders</span>
        </CardTitle>
        <CardDescription>
          Stay on top of your job search tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>

        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-3 border rounded-lg ${
                reminder.completed ? "bg-gray-50 opacity-60" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-medium ${reminder.completed ? "line-through" : ""}`}>
                      {reminder.title}
                    </h4>
                    <Badge className={getTypeColor(reminder.type)}>
                      {getTypeLabel(reminder.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{format(reminder.dueDate, "MMM dd, yyyy")}</span>
                  </div>
                </div>
                <div className="ml-2">
                  {reminder.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Button size="sm" variant="outline">
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {reminders.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No reminders yet</p>
            <p className="text-sm">Add reminders to stay organized</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
