'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Minus, Plus, ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n, useLocalizedField } from '@/lib/i18n'
import { useCart } from '@/lib/cart/context'
import type { Product, Category } from '@/lib/types/database'

type ProductDetailsProps = {
  product: Product & { category?: Category }
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { t } = useI18n()
  const { getName, getDescription } = useLocalizedField()
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const hasDiscount = product.sale_price && product.sale_price < product.price
  const displayPrice = hasDiscount ? product.sale_price : product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0

  const handleAddToCart = async () => {
    await addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const images = product.images?.length ? product.images : ['/placeholder.jpg']

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">{t('home')}</Link>
        <ChevronRight className="h-4 w-4" />
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug}`} className="hover:text-foreground">
              {getName(product.category)}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="text-foreground">{getName(product)}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/30">
            <Image
              src={images[selectedImage]}
              alt={getName(product)}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {hasDiscount && (
              <span className="sale-badge absolute left-4 top-4 rounded bg-[var(--sale)] px-3 py-1.5 text-sm font-semibold text-white">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                >
                  <Image
                    src={image}
                    alt={`${getName(product)} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{getName(product)}</h1>
            {product.sku && (
              <p className="mt-1 text-sm text-muted-foreground">SKU: {product.sku}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {displayPrice?.toLocaleString()} {t('currency')}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.price.toLocaleString()} {t('currency')}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-sm text-[var(--success)]">
                You save {(product.price - product.sale_price!).toLocaleString()} {t('currency')}
              </p>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--success)]/10">
                  <Check className="h-4 w-4 text-[var(--success)]" />
                </span>
                <span className="text-sm">
                  {t('inStock')}
                  {product.stock <= 10 && (
                    <span className="ml-1 text-[var(--sale)]">
                      - Only {product.stock} left!
                    </span>
                  )}
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">{t('outOfStock')}</span>
            )}
          </div>

          {/* Quantity & Add to cart */}
          {product.stock > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="lg"
                className="flex-1 gap-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                onClick={handleAddToCart}
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Added!</span>
                    <span className="sm:hidden">Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">{t('addToCart')}</span>
                    <span className="sm:hidden">Add</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Description */}
          {getDescription(product) && (
            <div className="space-y-2 border-t pt-6">
              <h2 className="font-semibold">{t('description')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {getDescription(product)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
