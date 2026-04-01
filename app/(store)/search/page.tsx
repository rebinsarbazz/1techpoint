'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ProductCard } from '@/components/store/product-card'
import { useI18n } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types/database'

// Separate component that uses useSearchParams
function SearchContent() {
  const { t, locale } = useI18n()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      
      const nameField = `name_${locale}`
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .or(`name_en.ilike.%${query}%,name_ku.ilike.%${query}%,name_ar.ilike.%${query}%,sku.ilike.%${query}%`)
        .limit(20)

      setResults(data || [])
      setIsLoading(false)
    }

    const debounce = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounce)
  }, [query, locale, supabase])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">{t('search')}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 pl-10 text-lg"
            autoFocus
          />
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : query.trim() ? (
          <>
            <p className="mb-6 text-muted-foreground">
              {results.length} {t('searchResults').toLowerCase()} for &quot;{query}&quot;
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                {t('noResults')}
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            Start typing to search products...
          </div>
        )}
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
          <p className="text-muted-foreground">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}