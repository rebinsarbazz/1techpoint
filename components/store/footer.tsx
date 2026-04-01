'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

export function Footer() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Newsletter */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              {/* Logo */}
              <img
                src="/logo.png"
                alt="Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <span>{t('siteName')}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('siteDescription')}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('subscribeNewsletter')}</p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  {t('subscribe')}
                </Button>
              </form>
            </div>
          </div>

          {/* Social & Payment */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('followUs')}</h3>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Methods</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded border border-border bg-background px-2 py-1">Cash on Delivery</span>
                <span className="rounded border border-border bg-background px-2 py-1">FastPay</span>
                <span className="rounded border border-border bg-background px-2 py-1">FIB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© {currentYear} {t('siteName')}. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  )
}
