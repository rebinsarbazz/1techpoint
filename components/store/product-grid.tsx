'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ProductCard } from './product-card'
import { useI18n, useLocalizedField, type TranslationKey } from '@/lib/i18n'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Product, Category } from '@/lib/types/database'

type ProductGridProps = {
  products: Product[]
  title?: TranslationKey
  category?: Category
  showFilters?: boolean
}

export function ProductGrid({ products, title, category, showFilters }: ProductGridProps) {
  const { t } = useI18n()
  const { getName } = useLocalizedField()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || 'featured'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  const displayTitle = category ? getName(category) : title ? t(title) : t('allProducts')

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{displayTitle}</h1>
          <p className="mt-1 text-muted-foreground">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {showFilters && (
          <div className="flex items-center gap-4">
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg text-muted-foreground">{t('noResults')}</p>
        </div>
      )}
    </div>
  )
}
