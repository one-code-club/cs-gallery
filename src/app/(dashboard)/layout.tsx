import { Header } from '@/components/feature/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  )
}

