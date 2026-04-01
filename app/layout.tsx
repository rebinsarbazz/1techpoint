import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import localFont from 'next/font/local'
import { I18nProvider } from '@/lib/i18n'
import { CartProvider } from '@/lib/cart/context'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

// Arabic font - using local font files
const notoNaskhArabic = localFont({
  src: [
    {
      path: '../public/fonts/arabic.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/arabic-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-arabic',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

// Kurdish/Arabic font - using local font files
const notoNaskhKurdish = localFont({
  src: [
    {
      path: '../public/fonts/kurdish.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-kurdish',
  display: 'swap',
  fallback: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
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
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4f46e5' },
    { media: '(prefers-color-scheme: dark)', color: '#6366f1' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} ${notoNaskhArabic.variable} ${notoNaskhKurdish.variable} font-sans antialiased`}>
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