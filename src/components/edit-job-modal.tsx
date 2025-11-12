"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Job } from "@prisma/client"
import { Loader2, X } from "lucide-react"
import { useState } from "react"

interface EditJobModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EditJobModal({ isOpen, onClose}: EditJobModalProps) {
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

      // if the response is okay, then proceed converting 
      // the response as json format
      if (response.ok) {
        // converting response into json
        const job = await response.json()
        // the function action, update or add new job.
        onJobAdded(job)

        // have a toast where indicate that if the execution success
        toast({
          title: "Success",
          description: "Job application added successfully!",
        })
        
        // close the modal or the form
        handleClose()

      } else {
        // have a tose
        toast({
          title: "Error",
          description: "Failed to add job application",
          variant: "destructive",
        })
      }
    } 
    catch (error) {
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
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
    </>
   
  )
}
