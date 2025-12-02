'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { type Language, getTranslations, type TranslationKeys } from '@/lib/translations'

const LANGUAGE_COOKIE = 'gallery_language'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKeys
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return undefined
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

export function LanguageProvider({ 
  children, 
  initialLanguage = 'en' 
}: { 
  children: React.ReactNode
  initialLanguage?: Language 
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Read from cookie on mount
    const savedLang = getCookie(LANGUAGE_COOKIE) as Language | undefined
    if (savedLang && (savedLang === 'en' || savedLang === 'ja')) {
      setLanguageState(savedLang)
    }
    setMounted(true)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    setCookie(LANGUAGE_COOKIE, lang)
  }, [])

  const t = getTranslations(language)

  // Prevent hydration mismatch by using initial language until mounted
  const value = {
    language: mounted ? language : initialLanguage,
    setLanguage,
    t: mounted ? t : getTranslations(initialLanguage),
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

