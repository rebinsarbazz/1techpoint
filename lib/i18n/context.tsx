'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { type Locale, type TranslationKey, translations, defaultLocale, isRTL, localeNames } from './translations'

type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
  isRTL: boolean
  localeNames: Record<Locale, string>
  dir: 'ltr' | 'rtl'
}

const I18nContext = createContext<I18nContextType | null>(null)

const LOCALE_STORAGE_KEY = 'electromall-locale'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load locale from localStorage on mount
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (savedLocale && ['en', 'ku', 'ar'].includes(savedLocale)) {
      setLocaleState(savedLocale)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      // Update document direction and lang
      document.documentElement.lang = locale
      document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr'
    }
  }, [locale, mounted])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
  }, [])

  const t = useCallback((key: TranslationKey): string => {
    return translations[locale][key] || translations.en[key] || key
  }, [locale])

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    isRTL: isRTL(locale),
    localeNames,
    dir: isRTL(locale) ? 'rtl' : 'ltr',
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <I18nContext.Provider value={{ ...value, locale: defaultLocale, isRTL: false, dir: 'ltr' }}>
        {children}
      </I18nContext.Provider>
    )
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// Helper hook for getting localized product/category fields
export function useLocalizedField() {
  const { locale } = useI18n()
  
  const getName = useCallback(<T extends { name_en: string; name_ku: string; name_ar: string }>(item: T): string => {
    const key = `name_${locale}` as keyof T
    return item[key] as string
  }, [locale])

  const getDescription = useCallback(<T extends { description_en: string | null; description_ku: string | null; description_ar: string | null }>(item: T): string | null => {
    const key = `description_${locale}` as keyof T
    return item[key] as string | null
  }, [locale])

  return { getName, getDescription }
}
