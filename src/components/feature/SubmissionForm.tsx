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

type SubmissionResult = Awaited<ReturnType<typeof submitUrl>>

const LOCATIONS = [
  'Zoom Online',
  'Kawasaki',
  'Kumamoto',
  'Noto',
  'Hakui',
] as const

export function SubmissionForm({ initialUrl, initialLocation }: { initialUrl?: string | null; initialLocation?: string | null }) {
  const [state, formAction, isPending] = useActionState<SubmissionResult | undefined, FormData>(
    async (_prev, formData) => {
      return await submitUrl(formData)
    },
    undefined
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter your URL</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Input 
              name="url" 
              placeholder="Enter a URL for your work" 
              defaultValue={initialUrl || ''}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select name="location" required defaultValue={initialLocation || ''}>
              <SelectTrigger id="location" disabled={isPending}>
                <SelectValue placeholder="Select your location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {state?.error && (
             <p className="text-red-500 text-sm">{state.error}</p>
          )}
          {state?.success && (
             <p className="text-green-500 text-sm">Submission saved!</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Submitting...' : (initialUrl ? 'Update Submission' : 'Submit')}
          </Button>
        </form>
        
        {initialUrl && (
            <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Current Submission:</p>
                <a href={initialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                    {initialUrl}
                </a>
                {initialLocation && (
                  <p className="text-sm text-muted-foreground mt-1">Location: {initialLocation}</p>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  )
}

