'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from './LanguageToggle'
import { useLanguage } from '@/components/language-provider'
import { logout } from '@/lib/actions'

type Session = {
  deviceId: string
  role: 'STUDENT' | 'TA' | 'ADMIN'
  nickname: string
} | null

export function HeaderClient({ session }: { session: Session }) {
  const { t } = useLanguage()

  return (
    <header className="border-b bg-card text-card-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="font-bold text-lg">
          <Link href="/">{t.header.title}</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageToggle />
          {session ? (
            <>
              <span className="text-sm font-medium">
                {session.nickname}
              </span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/gallery">{t.header.gallery}</Link>
              </Button>
              {(session.role === 'TA' || session.role === 'ADMIN') && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/voting">{t.header.vote}</Link>
                </Button>
              )}
              <form action={logout}>
                  <Button variant="outline" size="sm">{t.header.logout}</Button>
              </form>
            </>
          ) : (
             <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t.header.login}</Link>
              </Button>
          )}
        </div>
      </div>
    </header>
  )
}

