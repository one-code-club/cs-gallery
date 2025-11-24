'use client'

import { submitUrl } from '@/lib/actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useActionState } from 'react'

type SubmissionResult = Awaited<ReturnType<typeof submitUrl>>

export function SubmissionForm({ initialUrl }: { initialUrl?: string | null }) {
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
            </div>
        )}
      </CardContent>
    </Card>
  )
}

