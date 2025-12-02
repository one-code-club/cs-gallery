'use client'

import { useLanguage } from '@/components/language-provider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const isJapanese = language === 'ja'

  const handleToggle = (checked: boolean) => {
    setLanguage(checked ? 'ja' : 'en')
  }

  return (
    <div className="flex items-center gap-2">
      <span 
        className={cn(
          "text-sm font-medium transition-colors",
          !isJapanese ? "text-foreground" : "text-muted-foreground"
        )}
      >
        EN
      </span>
      <Switch
        checked={isJapanese}
        onCheckedChange={handleToggle}
        aria-label="Toggle language"
      />
      <span 
        className={cn(
          "text-sm font-medium transition-colors",
          isJapanese ? "text-foreground" : "text-muted-foreground"
        )}
      >
        日本語
      </span>
    </div>
  )
}
