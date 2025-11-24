import { getSession, getSubmissionsForTA } from '@/lib/actions'
import { redirect } from 'next/navigation'
import { VotingInterface } from '@/components/feature/VotingInterface'

export default async function VotingPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'TA') redirect('/') // Redirect Student/Admin to their home

  const submissions = await getSubmissionsForTA()
  const maxVotes = parseInt(process.env.VOTE_MAX || '5', 10)

  return <VotingInterface initialData={submissions} maxVotes={maxVotes} />
}

