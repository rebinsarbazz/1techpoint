'use client'

import Link from 'next/link'
import { ArrowRight, Smartphone, Laptop, Headphones, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { motion } from 'framer-motion'

const categories = [
  {
    href: '/category/mobile-phones',
    label: 'Mobile Phones',
    icon: Smartphone,
    image: '/categories/mobile.jpg',
  },
  {
    href: '/category/laptops',
    label: 'Laptops',
    icon: Laptop,
    image: '/categories/laptop.jpg',
  },
  {
    href: '/category/audio',
    label: 'Audio',
    icon: Headphones,
    image: '/categories/audio.jpg',
  },
  {
    href: '/category/gaming',
    label: 'Gaming',
    icon: Gamepad2,
    image: '/categories/gaming.jpg',
  },
]

export function HeroSection() {
  const { t, dir } = useI18n()

  const isRTL = dir === 'rtl'
  const heroImage = isRTL ? '/1-rtl.jpg' : '/1.jpg'

  return (
    <section className="relative overflow-hidden min-h-[95vh]">

      {/* Background */}
      <div className="absolute inset-0">
        <motion.img
          src={heroImage}
          alt="Hero background"
          className="h-full w-full object-cover"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent" />

        {/* Direction-aware color tint */}
        <div
          className={`absolute inset-0 ${
            isRTL
              ? 'bg-[linear-gradient(225deg,oklch(0.6_0.2_140/0.25),oklch(0.5_0.2_280/0.25))]'
              : 'bg-[linear-gradient(135deg,oklch(0.6_0.2_140/0.25),oklch(0.5_0.2_280/0.25))]'
          }`}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6))]" />

        {/* Bottom glass fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent backdrop-blur-md" />
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/80">
        <span className="text-xs tracking-widest uppercase">
          Scroll
        </span>

        <div className="h-10 w-[2px] overflow-hidden rounded-full bg-white/30">
          <motion.div
            className="h-4 w-full bg-white"
            animate={{ y: [0, 40, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">

          {/* LEFT SIDE */}
          <div className="flex flex-col justify-center text-white">

            {/* Categories */}
            <div className="grid grid-cols-2 gap-5">
              {categories.map((item, index) => {
                const Icon = item.icon

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                    }}
                  >
                    <Link href={item.href} className="group relative block overflow-hidden rounded-2xl">

                      {/* Background Image */}
                      <img
                        src={item.image}
                        alt={item.label}
                        className="absolute inset-0 h-full w-full object-cover scale-110 transition-transform duration-500 group-hover:scale-125"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                      {/* Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />

                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center justify-center p-6">

                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 3 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Icon className="h-10 w-10 text-white" />
                        </motion.div>

                        <span className="mt-3 font-medium text-white">
                          {item.label}
                        </span>

                        <span className="mt-2 h-[2px] w-12 bg-white/70 transition-all duration-300 group-hover:w-0 group-hover:opacity-0" />

                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                asChild
                className="group relative overflow-hidden rounded-xl bg-white text-black hover:bg-white/90 shadow-lg"
              >
                <Link href="/products">
                  <span className="relative z-10 flex items-center">
                    {t('allProducts')}
                    <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </span>

                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                </Link>
              </Button>

              <Button
                size="lg"
                asChild
                className="rounded-xl border border-white/20 bg-accent/50 backdrop-blur-md text-white hover:bg-accent/70 transition-all"
              >
                <Link href="/category/mobile-phones">
                  {t('bestSellers')}
                </Link>
              </Button>
            </motion.div>

          </div>

        </div>
      </div>

      {/* Decorative glows */}
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[oklch(0.8_0.25_140/0.2)] blur-3xl" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[oklch(0.7_0.25_280/0.2)] blur-3xl" />
    </section>
  )
}