import { getSession, getAdminData } from '@/lib/actions'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/feature/AdminDashboard'

export default async function AdminPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'ADMIN') redirect('/')

  const { users } = await getAdminData()

  return <AdminDashboard initialUsers={users} />
}

