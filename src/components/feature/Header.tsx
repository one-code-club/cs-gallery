import { getSession, logout } from '@/lib/actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export async function Header() {
  const session = await getSession()
  
  return (
    <header className="border-b bg-card text-card-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="font-bold text-lg">
          <Link href="/">Gallery - CS in English</Link>
        </div>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm font-medium">
                {session.nickname}
              </span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/gallery">Gallery</Link>
              </Button>
              {(session.role === 'TA' || session.role === 'ADMIN') && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/voting">Vote</Link>
                </Button>
              )}
              <form action={logout}>
                  <Button variant="outline" size="sm">Logout</Button>
              </form>
            </>
          ) : (
             <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
          )}
        </div>
      </div>
    </header>
  )
}

