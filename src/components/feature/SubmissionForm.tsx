'use client'

import { submitUrl } from '@/lib/actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useActionState } from 'react'
import { useLanguage } from '@/components/language-provider'
import { formatMessage } from '@/lib/translations'
import { LOCATIONS, getLocationLabel } from '@/lib/locations'

type SubmissionResult = Awaited<ReturnType<typeof submitUrl>>

export function SubmissionForm({ initialUrl, initialLocation }: { initialUrl?: string | null; initialLocation?: string | null }) {
  const { t } = useLanguage()
  
  const [state, formAction, isPending] = useActionState<SubmissionResult | undefined, FormData>(
    async (_prev, formData) => {
      return await submitUrl(formData)
    },
    undefined
  )

  // Check if state has error
  const hasError = state && 'error' in state
  const hasSuccess = state && 'success' in state

  // Translate error message based on errorKey if available
  const getErrorMessage = () => {
    if (!hasError || !state.error) return ''
    if (state.errorKey) {
      const errorMessages: Record<string, string> = {
        unauthorized: t.errors.unauthorized,
        urlRequired: t.errors.urlRequired,
        locationRequired: t.errors.locationRequired,
        invalidLocation: t.errors.invalidLocation,
        failedToSubmit: t.errors.failedToSubmit,
      }
      // Handle urlMustContain with placeholder
      if (state.errorKey === 'urlMustContain' && state.errorParams?.text) {
        return formatMessage(t.errors.urlMustContain, { text: state.errorParams.text })
      }
      return errorMessages[state.errorKey] || state.error
    }
    return state.error
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.submission.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Input 
              name="url" 
              placeholder={t.submission.urlPlaceholder}
              defaultValue={initialUrl || ''}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t.submission.locationLabel}</Label>
            <Select name="location" required defaultValue={initialLocation || ''}>
              <SelectTrigger id="location" disabled={isPending}>
                <SelectValue placeholder={t.submission.locationPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {hasError && (
             <p className="text-red-500 text-sm">{getErrorMessage()}</p>
          )}
          {hasSuccess && (
             <p className="text-green-500 text-sm">{t.submission.successMessage}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t.submission.submitting : (initialUrl ? t.submission.updateButton : t.submission.submitButton)}
          </Button>
        </form>
        
        {initialUrl && (
            <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">{t.submission.currentSubmission}</p>
                <a href={initialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                    {initialUrl}
                </a>
                {initialLocation && (
                  <p className="text-sm text-muted-foreground mt-1">{t.submission.locationDisplay} {getLocationLabel(initialLocation)}</p>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  )
}
