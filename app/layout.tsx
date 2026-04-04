import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/lib/i18n'
import { CartProvider } from '@/lib/cart/context'
import { headers } from 'next/headers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'First Tech Point - Shop Electronics, Mobiles & Home Appliances',
    template: '%s | First Tech Point',
  },
  description: 'Shop the latest electronics, mobile phones, laptops, TVs, gaming consoles, and home appliances at First Tech Point. Fast delivery across Iraq with Cash on Delivery, FastPay, and FIB payment options.',
  keywords: ['electronics', 'mobile phones', 'laptops', 'TVs', 'gaming', 'home appliances', 'Iraq', 'online shopping', 'First Tech Point'],
  authors: [{ name: 'Rebin Sarbaz' }],
  creator: 'Rebin Sarbaz',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_IQ', 'ku_IQ'],
    siteName: 'First Tech Point',
    title: 'First Tech Point - Shop Electronics, Mobiles & Home Appliances',
    description: 'Shop the latest electronics, mobile phones, laptops, TVs, gaming consoles, and home appliances at First Tech Point.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'First Tech Point',
    description: 'Shop the latest electronics at First Tech Point',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#22C55E' },
    { media: '(prefers-color-scheme: dark)', color: '#22C55E' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language') || ''
  const isRTL = acceptLanguage.includes('ar') || acceptLanguage.includes('ku')
  
  return (
    <html 
      lang={isRTL ? 'ar' : 'en'} 
      dir={isRTL ? 'rtl' : 'ltr'} 
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansArabic.variable}`}
    >
      <body className={`${isRTL ? 'font-kurdish' : 'font-sans'} antialiased`}>
        <I18nProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}