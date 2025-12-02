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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useActionState, useEffect, useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import { formatMessage } from '@/lib/translations'
import { LOCATIONS, getLocationLabel } from '@/lib/locations'
import confetti from 'canvas-confetti'

type SubmissionResult = Awaited<ReturnType<typeof submitUrl>>

export function SubmissionForm({ initialUrl, initialLocation }: { initialUrl?: string | null; initialLocation?: string | null }) {
  const { t } = useLanguage()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  const [state, formAction, isPending] = useActionState<SubmissionResult | undefined, FormData>(
    async (_prev, formData) => {
      return await submitUrl(formData)
    },
    undefined
  )

  // Check if state has error
  const hasError = state && 'error' in state
  const hasSuccess = state && 'success' in state

  // Show success modal and confetti when submission is successful
  useEffect(() => {
    if (hasSuccess) {
      setShowSuccessModal(true)
      // Fire confetti!
      const duration = 3000
      const end = Date.now() + duration

      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4']
      
      const frame = () => {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: colors,
        })
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: colors,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [hasSuccess])

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
    <>
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

    {/* Success Modal */}
    <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
      <DialogContent className="sm:max-w-md text-center" showCloseButton={false}>
        <DialogHeader className="items-center">
          <div className="text-6xl mb-4 animate-bounce">🎊</div>
          <DialogTitle className="text-2xl text-center">
            {t.submission.successModalTitle}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {t.submission.successModalMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-4">
          <Button 
            onClick={() => setShowSuccessModal(false)}
            className="px-8 py-2 text-lg"
          >
            {t.submission.successModalButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
