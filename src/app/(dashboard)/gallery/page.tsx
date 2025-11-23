import { getSession, getGalleryData } from '@/lib/actions'
import { redirect } from 'next/navigation'
import { GalleryView } from '@/components/feature/GalleryView'

export default async function GalleryPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const data = await getGalleryData()
  return <GalleryView initialData={data} />
}

