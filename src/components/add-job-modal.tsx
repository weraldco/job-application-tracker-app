"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Job } from "@prisma/client"

interface AddJobModalProps {
  isOpen: boolean
  onClose: () => void
  onJobAdded: (job: Job) => void
}

export function AddJobModal({ isOpen, onClose, onJobAdded }: AddJobModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    applicationDate: new Date().toISOString().split('T')[0],
    jobUrl: "",
    skillsRequired: "",
    jobRequirements: "",
    experienceNeeded: "",
    notes: "",
    salary: "",
    location: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          applicationDate: new Date(formData.applicationDate).toISOString(),
          experienceNeeded: formData.experienceNeeded ? parseInt(formData.experienceNeeded) : null,
        }),
      })

      if (response.ok) {
        const job = await response.json()
        onJobAdded(job)
        toast({
          title: "Success",
          description: "Job application added successfully!",
        })
        handleClose()
      } else {
        toast({
          title: "Error",
          description: "Failed to add job application",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add job application",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      title: "",
      company: "",
      applicationDate: new Date().toISOString().split('T')[0],
      jobUrl: "",
      skillsRequired: "",
      jobRequirements: "",
      experienceNeeded: "",
      notes: "",
      salary: "",
      location: "",
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-neutral-700/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Add Job Application</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Enter the details of your job application
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleClose} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="applicationDate" className="text-sm font-medium text-gray-700">Application Date *</Label>
                <Input
                  id="applicationDate"
                  type="date"
                  value={formData.applicationDate}
                  onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="salary" className="text-sm font-medium text-gray-700">Salary</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="experienceNeeded" className="text-sm font-medium text-gray-700">Years of Experience</Label>
                <Input
                  id="experienceNeeded"
                  type="number"
                  value={formData.experienceNeeded}
                  onChange={(e) => setFormData({ ...formData, experienceNeeded: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="jobUrl" className="text-sm font-medium text-gray-700">Job URL</Label>
              <Input
                id="jobUrl"
                type="url"
                value={formData.jobUrl}
                onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="skillsRequired" className="text-sm font-medium text-gray-700">Required Skills</Label>
              <Textarea
                id="skillsRequired"
                value={formData.skillsRequired}
                onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="jobRequirements" className="text-sm font-medium text-gray-700">Job Requirements</Label>
              <Textarea
                id="jobRequirements"
                value={formData.jobRequirements}
                onChange={(e) => setFormData({ ...formData, jobRequirements: e.target.value })}
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-400">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Job Application"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} className="px-6 bg-blue-400">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
