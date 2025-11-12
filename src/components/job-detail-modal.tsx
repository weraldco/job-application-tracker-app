"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Job } from "@prisma/client"
import { format } from "date-fns"
import { Calendar, DollarSign, Edit, ExternalLink, Loader2, MapPin, Trash2, X } from "lucide-react"
import { useState } from "react"

interface JobDetailModalProps {
  job: Job
  isOpen: boolean
  onClose: () => void
  onUpdate: (job: Job) => void
}


export function JobDetailModal({ job, isOpen, onClose, onUpdate }: JobDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Job>(job)
  const statusColors = {
    APPLIED: "bg-blue-100 text-blue-800",
    INTERVIEWING: "bg-yellow-100 text-yellow-800",
    OFFER: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    WITHDRAWN: "bg-gray-100 text-gray-800",
  }

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
      console.log(formData)
    }
  const handleClose = () => {
    onClose()
  }
  if (!isOpen) return null
  console.log(formData)
  console.log(isEditing)
  return (
    <>
        <div className="fixed inset-0 bg-neutral-700/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      {!isEditing ? 
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-3">
                <span>{job.title}</span>
                <Badge className={statusColors[job.status]}>
                  {job.status}
                </Badge>
              </CardTitle>
              <CardDescription className="text-lg">{job.company}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Applied: {format(new Date(job.applicationDate), "MMM dd, yyyy")}
              </span>
            </div>
            
            {job.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{job.location}</span>
              </div>
            )}
            
            {job.salary && (
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{job.salary}</span>
              </div>
            )}
            
            {job.experienceNeeded && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Experience: {job.experienceNeeded} years
                </span>
              </div>
            )}
          </div>

          {/* Job URL */}
          {job.jobUrl && (
            <div>
              <h3 className="font-medium mb-2">Job Posting</h3>
              <Button
                variant="outline"
                onClick={() => {
                  if (job.jobUrl) window.open(job.jobUrl, "_blank")
                  }}
                className="flex items-center space-x-2"
                >
                <ExternalLink className="h-4 w-4" />
                <span>View Original Posting</span>
              </Button>
            </div>
          )}

          {/* Skills Required */}
          {job.skillsRequired && (
            <div>
              <h3 className="font-medium mb-2">Required Skills</h3>
              <p className="text-sm text-gray-600">{job.skillsRequired}</p>
            </div>
          )}

          {/* Job Requirements */}
          {job.jobRequirements && (
            <div>
              <h3 className="font-medium mb-2">Job Requirements</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.jobRequirements}</p>
            </div>
          )}

          {/* Notes */}
          {job.notes && (
            <div>
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              Add Event
            </Button>
            <Button variant="outline" className="flex-1">
              Add Reminder
            </Button>
            <Button variant="outline" className="flex-1">
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card> :  <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
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
                  value={formData.applicationDate instanceof Date ? formData.applicationDate.toISOString().split('T')[0] : formData.applicationDate}
                  onChange={(e) => setFormData({ ...formData, applicationDate: new Date(e.target.value) })}
                  required
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                <Input
                  id="location"
                  value={formData.location ?? ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="salary" className="text-sm font-medium text-gray-700">Salary</Label>
                <Input
                  id="salary"
                  value={Number(formData.salary)}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="experienceNeeded" className="text-sm font-medium text-gray-700">Years of Experience</Label>
                <Input
                  id="experienceNeeded"
                  type="number"
                  value={Number(formData.experienceNeeded)}
                  onChange={(e) => setFormData({ ...formData, experienceNeeded: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="jobUrl" className="text-sm font-medium text-gray-700">Job URL</Label>
              <Input
                id="jobUrl"
                type="url"
                value={formData.jobUrl ?? ""}
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
                value={formData.notes ?? ""} 
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
              <Button type="button" variant="outline" onClick={()=>{setIsEditing(false)}} className="px-6 bg-blue-400">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
        </Card>
        }
    </div>
    </>
  )
}
