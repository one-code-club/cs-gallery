'use client'

import { login } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useActionState, useEffect, useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import { LanguageToggle } from '@/components/feature/LanguageToggle'

const initialState = {
  error: '',
  errorKey: '' as string,
}

// デバイスIDを取得または生成する関数
function getOrCreateDeviceId(): string {
  const STORAGE_KEY = 'gallery_device_id'
  
  // 既存のデバイスIDを取得
  let deviceId = localStorage.getItem(STORAGE_KEY)
  
  if (!deviceId) {
    // 新しいUUIDを生成
    deviceId = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, deviceId)
  }
  
  return deviceId
}

export default function LoginPage() {
  const { t } = useLanguage()
  const [deviceId, setDeviceId] = useState<string>('')
  
  // クライアント側でのみデバイスIDを取得
  useEffect(() => {
    setDeviceId(getOrCreateDeviceId())
  }, [])
  
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
      try {
        const result = await login(formData);
        if (result?.error) return { error: result.error, errorKey: result.errorKey || '' };
        return { error: '', errorKey: '' };
      } catch (e) {
        return { error: t.login.unexpectedError, errorKey: '' }
      }
  }, initialState)

  // Translate error message based on errorKey if available
  const getErrorMessage = () => {
    if (!state.error) return ''
    if (state.errorKey) {
      const errorMessages: Record<string, string> = {
        nicknameRequired: t.errors.nicknameRequired,
        invalidNickname: t.errors.invalidNickname,
        databaseError: t.errors.databaseError,
        deviceIdRequired: t.errors.deviceIdRequired || 'Device ID is required',
      }
      return errorMessages[state.errorKey] || state.error
    }
    return state.error
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t.login.title}</CardTitle>
          <CardDescription className="text-center">{t.login.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {/* 隠しフィールドでデバイスIDを送信 */}
            <input type="hidden" name="deviceId" value={deviceId} />
            <div className="space-y-2">
              <Label htmlFor="nickname">{t.login.nicknameLabel}</Label>
              <Input 
                id="nickname" 
                name="nickname" 
                placeholder={t.login.nicknamePlaceholder}
                required 
                disabled={isPending || !deviceId}
              />
            </div>
            {state.error && (
              <div className="text-sm text-red-500 font-medium">
                {getErrorMessage()}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isPending || !deviceId}>
              {isPending ? t.login.submitting : t.login.submitButton}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
