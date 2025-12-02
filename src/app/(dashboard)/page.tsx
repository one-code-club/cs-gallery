import { getSession } from '@/lib/actions'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SubmissionForm } from '@/components/feature/SubmissionForm'

export default async function HomePage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'ADMIN') redirect('/admin')
  if (session.role === 'TA') redirect('/voting')

  const submission = await prisma.submission.findUnique({
    where: { userId: session.ip }
  })

  return (
    <div className="max-w-lg mx-auto mt-10">
       <h1 className="text-3xl font-bold mb-6 text-center">Submit Your Work</h1>
       <SubmissionForm initialUrl={submission?.url} initialLocation={submission?.location} />
    </div>
  )
}

