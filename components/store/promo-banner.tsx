'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n, useLocalizedField } from '@/lib/i18n'
import type { Product } from '@/lib/types/database'

type PromoBannerProps = {
  products: Product[]
}

export function PromoBanner({ products }: PromoBannerProps) {
  const { t } = useI18n()
  const { getName } = useLocalizedField()

  if (products.length === 0) return null

  const mainProduct = products[0]
  const discountPercent = mainProduct.sale_price 
    ? Math.round(((mainProduct.price - mainProduct.sale_price) / mainProduct.price) * 100)
    : 0

  return (
    <section className="relative overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/sale-tag.jpg" // 👈 change this to your image
          alt="Promo background"
          fill
          priority
          className="object-cover"
        />

        {/* Dark overlay (better text readability) */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          
          {/* Left Content */}
          <div className="text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium backdrop-blur">
              <Percent className="h-4 w-4" />
              <span>{t('onSale')}</span>
            </div>

            <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
              {t("text1")} <span className="text-sale">{discountPercent}%</span> {t("text2")}
            </h2>

            <p className="mt-4 text-lg text-white/80">
              {t("text3")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products?sale=true">
                  Shop Sale
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Products */}
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group overflow-hidden rounded-xl bg-white/10 backdrop-blur transition-all hover:bg-white/20"
              >
                <div className="aspect-square p-4">
                  {product.images?.[0] && (
                    <div className="relative h-full w-full">
                      <Image
                        src={product.images[0]}
                        alt={getName(product)}
                        fill
                        className="object-contain transition-transform rounded-lg group-hover:scale-105"
                        sizes="(max-width: 640px) 40vw, 20vw"
                      />
                    </div>
                  )}
                </div>

                <div className="p-3 text-center text-white">
                  <p className="line-clamp-1 text-sm font-medium">
                    {getName(product)}
                  </p>

                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="font-bold">
                      {product.sale_price?.toLocaleString()} {t('currency')}
                    </span>
                    <span className="text-sm text-white/60 line-through">
                      {product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}