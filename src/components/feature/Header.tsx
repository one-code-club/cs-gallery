import { getSession } from '@/lib/actions'
import { HeaderClient } from './HeaderClient'

export async function Header() {
  const session = await getSession()
  
  return <HeaderClient session={session} />
}
