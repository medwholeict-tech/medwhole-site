'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface FormField {
  fieldId: string
  label: string
  fieldType: string
  placeholder?: string
  options?: string[]
  required?: boolean
  helpText?: string
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

interface EventRegistrationFormProps {
  eventId: string
  eventTitle: string
  fields: FormField[]
  submitButtonText?: string
  successMessage?: string
}

export function EventRegistrationForm({
  eventId,
  eventTitle,
  fields,
  submitButtonText = 'Register Now',
  successMessage = 'Thank you for registering! We will send you a confirmation email shortly.',
}: EventRegistrationFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [antiBotToken, setAntiBotToken] = useState('')
  const honeypotRef = useRef<HTMLInputElement>(null)

  // Fetch a signed anti-bot token when the form mounts. The server requires
  // this token and a minimum time-on-page before accepting a submission.
  useEffect(() => {
    let cancelled = false
    fetch('/api/anti-bot/token?action=event-registration')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.token) setAntiBotToken(data.token)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }))
    }
  }

  const validateField = (field: FormField, value: any): string => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} is required`
    }

    if (value && field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return `${field.label} must be at least ${field.validation.minLength} characters`
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return `${field.label} must not exceed ${field.validation.maxLength} characters`
      }
      if (field.validation.pattern) {
        const regex = new RegExp(field.validation.pattern)
        if (!regex.test(value)) {
          return `${field.label} format is invalid`
        }
      }
    }

    // Built-in validations
    if (field.fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    if (field.fieldType === 'phone' && value) {
      const phoneRegex = /^[\d\s()+-]+$/
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number'
      }
    }

    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    fields.forEach(field => {
      const error = validateField(field, formData[field.fieldId])
      if (error) {
        newErrors[field.fieldId] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Format data for submission
      const submissionData = fields.map(field => ({
        fieldId: field.fieldId,
        label: field.label,
        value: Array.isArray(formData[field.fieldId]) 
          ? formData[field.fieldId].join(', ')
          : formData[field.fieldId] || '',
      }))

      const response = await fetch('/api/event-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          formData: submissionData,
          website: honeypotRef.current?.value ?? '',
          antiBotToken,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit registration')
      }

      setIsSuccess(true)
      setFormData({})
    } catch (error) {
      console.error('Registration error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit registration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="border border-grey-azure bg-parchment shadow-none">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-4 max-w-md mx-auto">
            <div className="inline-flex border border-pine-teal p-4">
              <CheckCircle2 className="h-12 w-12 text-pine-teal" />
            </div>
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="font-heading text-2xl text-dark-azure">Registration successful</h3>
              <p className="leading-relaxed text-graphite">{successMessage}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-grey-azure shadow-none">
      <CardHeader className="space-y-1 border-b border-grey-azure bg-parchment pb-6">
        <CardTitle className="text-2xl">Event Registration</CardTitle>
        <CardDescription className="text-base">Complete the form below to register for {eventTitle}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field: real users never see or fill this */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              ref={honeypotRef}
            />
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {fields.map((field, index) => (
            <div 
              key={field.fieldId} 
              className="space-y-2 animate-in fade-in slide-in-from-left-5 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Label htmlFor={field.fieldId} className="text-sm font-semibold flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-destructive text-base">*</span>}
              </Label>

              {field.fieldType === 'text' && (
                <Input
                  id={field.fieldId}
                  type="text"
                  placeholder={field.placeholder}
                  value={formData[field.fieldId] || ''}
                  onChange={(e) => handleChange(field.fieldId, e.target.value)}
                  className={`transition-all duration-200 ${errors[field.fieldId] ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                />
              )}

              {field.fieldType === 'email' && (
                <Input
                  id={field.fieldId}
                  type="email"
                  placeholder={field.placeholder}
                  value={formData[field.fieldId] || ''}
                  onChange={(e) => handleChange(field.fieldId, e.target.value)}
                  className={`transition-all duration-200 ${errors[field.fieldId] ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                />
              )}

              {field.fieldType === 'phone' && (
                <Input
                  id={field.fieldId}
                  type="tel"
                  placeholder={field.placeholder}
                  value={formData[field.fieldId] || ''}
                  onChange={(e) => handleChange(field.fieldId, e.target.value)}
                  className={`transition-all duration-200 ${errors[field.fieldId] ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                />
              )}

              {field.fieldType === 'number' && (
                <Input
                  id={field.fieldId}
                  type="number"
                  placeholder={field.placeholder}
                  value={formData[field.fieldId] || ''}
                  onChange={(e) => handleChange(field.fieldId, e.target.value)}
                  className={`transition-all duration-200 ${errors[field.fieldId] ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                />
              )}

              {field.fieldType === 'date' && (
                <Input
                  id={field.fieldId}
                  type="date"
                  value={formData[field.fieldId] || ''}
                  onChange={(e) => handleChange(field.fieldId, e.target.value)}
                  className={`transition-all duration-200 ${errors[field.fieldId] ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                />
              )}

              {field.fieldType === 'textarea' && (
                <Textarea
                  id={field.fieldId}
                  placeholder={field.placeholder}
                  value={formData[field.fieldId] || ''}
                  onChange={(e) => handleChange(field.fieldId, e.target.value)}
                  rows={4}
                  className={`transition-all duration-200 ${errors[field.fieldId] ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                />
              )}

              {field.fieldType === 'select' && field.options && (
                <Select
                  value={formData[field.fieldId] || ''}
                  onValueChange={(value) => handleChange(field.fieldId, value)}
                >
                  <SelectTrigger className={`transition-all duration-200 ${errors[field.fieldId] ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder={field.placeholder || 'Select an option'} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.fieldType === 'radio' && field.options && (
                <RadioGroup
                  value={formData[field.fieldId] || ''}
                  onValueChange={(value) => handleChange(field.fieldId, value)}
                  className={`space-y-3 p-4 rounded-[4px] border bg-card transition-all duration-200 ${errors[field.fieldId] ? 'border-destructive' : 'border-border'}`}
                >
                  {field.options.map((option) => (
                    <div key={option} className="flex items-center space-x-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                      <RadioGroupItem value={option} id={`${field.fieldId}-${option}`} />
                      <Label htmlFor={`${field.fieldId}-${option}`} className="font-normal cursor-pointer flex-1">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {field.fieldType === 'checkbox' && field.options && (
                <div className={`space-y-3 p-4 rounded-[4px] border bg-card transition-all duration-200 ${errors[field.fieldId] ? 'border-destructive' : 'border-border'}`}>
                  {field.options.map((option) => (
                    <div key={option} className="flex items-center space-x-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                      <Checkbox
                        id={`${field.fieldId}-${option}`}
                        checked={(formData[field.fieldId] || []).includes(option)}
                        onCheckedChange={(checked) => {
                          const current = formData[field.fieldId] || []
                          const updated = checked
                            ? [...current, option]
                            : current.filter((v: string) => v !== option)
                          handleChange(field.fieldId, updated)
                        }}
                      />
                      <Label htmlFor={`${field.fieldId}-${option}`} className="font-normal cursor-pointer flex-1">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {field.helpText && (
                <p className="text-xs text-muted-foreground flex items-start gap-1.5 mt-1.5">
                  <span className="text-primary mt-0.5">ℹ</span>
                  <span>{field.helpText}</span>
                </p>
              )}

              {errors[field.fieldId] && (
                <p className="text-xs text-destructive flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="h-3 w-3" />
                  {errors[field.fieldId]}
                </p>
              )}
            </div>
          ))}

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full shadow-none border border-transparent" 
              size="lg" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  {submitButtonText}
                  <svg 
                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
