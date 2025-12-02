'use client'

import { useLanguage } from '@/components/language-provider'

type TitleKey = 'submission' | 'gallery' | 'voting' | 'admin'

const titleKeys: Record<TitleKey, (t: any) => string> = {
  submission: (t) => t.submission.pageTitle,
  gallery: (t) => t.gallery.title,
  voting: (t) => t.voting.title,
  admin: (t) => t.admin.title,
}

export function PageTitle({ titleKey, className }: { titleKey: TitleKey; className?: string }) {
  const { t } = useLanguage()
  
  return (
    <h1 className={className}>
      {titleKeys[titleKey](t)}
    </h1>
  )
}

