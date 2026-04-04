'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'
import { useI18n, type TranslationKey } from '@/lib/i18n'
import type { Product } from '@/lib/types/database'

type FeaturedProductsProps = {
  products: Product[]
  title: TranslationKey
  showViewAll?: boolean
}

export function FeaturedProducts({ products, title, showViewAll = true }: FeaturedProductsProps) {
  const { t } = useI18n()

  if (products.length === 0) return null

  return (
    <div>
        <div className="mb-8 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold md:text-3xl">{t(title)}</h2>
        <div className="mt-3 h-[3px] w-24 rounded-full bg-primary" />
        </div>
        <div className="mb-6 flex items-center justify-between">
        {showViewAll && (
          <Button variant="destructive" asChild>
            <Link href="/products" className="gap-2">
            <ArrowRight className="h-4 w-4" />
              {t('viewAll')}
              
            </Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-7">
        {products.slice(0, 7).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
