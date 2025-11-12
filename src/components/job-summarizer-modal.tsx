"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Job } from "@prisma/client"
import { Check, Loader2, Sparkles } from "lucide-react"
import { useState } from "react"

interface JobSummarizerModalProps {
  isOpen: boolean
  onClose: () => void
  onJobAdded: (job: Job) => void
}

interface SummarizedJob {
  title: string
  company: string
  skillsRequired: string
  jobRequirements: string
  experienceNeeded: number | null
  location?: string
  salary?: string
}

export function JobSummarizerModal({ isOpen, onClose, onJobAdded }: JobSummarizerModalProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [summarizedJob, setSummarizedJob] = useState<SummarizedJob | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSummarize = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job posting URL or text",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/summarize-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (response.ok) {
        const data = await response.json()
        setSummarizedJob(data)
        toast({
          title: "Success",
          description: "Job posting summarized successfully!",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to summarize job posting",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to summarize job posting",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      console.log('summarize', summarizedJob)
    }
  }

  const handleSubmit = async () => {
    if (!summarizedJob) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...summarizedJob,
          applicationDate: new Date().toISOString(),
          jobUrl: url,
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
    setUrl("")
    setSummarizedJob(null)
    setIsLoading(false)
    setIsSubmitting(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-neutral-700/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Job Summarizer</span>
          </CardTitle>
          <CardDescription>
            Paste a job posting URL or text to automatically extract key information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">Job Posting URL or Text</Label>
            <Textarea
              id="url"
              placeholder="Paste the job posting URL or copy the full job description text here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            onClick={handleSummarize}
            disabled={isLoading || !url.trim()}
            className="w-full bg-blue-400 duration-200 hover:bg-blue-500 active:bg-blue-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Summarize Job Posting
              </>
            )}
          </Button>

          {summarizedJob && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="font-medium">Job Information Extracted</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={summarizedJob.title}
                    onChange={(e) => setSummarizedJob({ ...summarizedJob, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={summarizedJob.company}
                    onChange={(e) => setSummarizedJob({ ...summarizedJob, company: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={summarizedJob.location || ""}
                    onChange={(e) => setSummarizedJob({ ...summarizedJob, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    value={summarizedJob.salary || ""}
                    onChange={(e) => setSummarizedJob({ ...summarizedJob, salary: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={summarizedJob.experienceNeeded || ""}
                    onChange={(e) => setSummarizedJob({ 
                      ...summarizedJob, 
                      experienceNeeded: e.target.value ? parseInt(e.target.value) : null 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills</Label>
                  <Textarea
                    id="skills"
                    value={summarizedJob.skillsRequired}
                    onChange={(e) => setSummarizedJob({ ...summarizedJob, skillsRequired: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Job Requirements</Label>
                <Textarea
                  id="requirements"
                  value={summarizedJob.jobRequirements}
                  onChange={(e) => setSummarizedJob({ ...summarizedJob, jobRequirements: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Job...
                    </>
                  ) : (
                    "Add Job Application"
                  )}
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
