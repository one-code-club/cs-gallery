'use client'

import { login } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
      try {
        const result = await login(formData);
        if (result?.error) return { error: result.error };
        return { error: '' };
      } catch (e) {
        return { error: 'An unexpected error occurred' }
      }
  }, initialState)

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Gallery Login</CardTitle>
          <CardDescription className="text-center">Enter your nickname to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input 
                id="nickname" 
                name="nickname" 
                placeholder="Display Name" 
                required 
                disabled={isPending}
              />
            </div>
            {state.error && (
              <div className="text-sm text-red-500 font-medium">
                {state.error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

