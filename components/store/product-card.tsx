'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useI18n, useLocalizedField } from '@/lib/i18n'
import { useCart } from '@/lib/cart/context'
import type { Product } from '@/lib/types/database'
import { motion } from 'framer-motion'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useI18n()
  const { getName, getDescription } = useLocalizedField()
  const { addItem } = useCart()

  const hasDiscount = product.sale_price && product.sale_price < product.price
  const displayPrice = hasDiscount ? product.sale_price : product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="group"
      >
        <Card className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-sm hover:shadow-xl transition-all duration-300">

          {/* IMAGE */}
          <div className="relative aspect-square overflow-hidden">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={getName(product)}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}

            {/* Discount */}
            {hasDiscount && (
              <div className="absolute top-3 left-3 rounded-xl bg-red-500 px-2 py-1 text-xs font-semibold text-white shadow">
                -{discountPercent}%
              </div>
            )}
          </div>

          {/* CONTENT */}
        <div className="p-4 flex flex-col gap-2">

          {/* Name */}
          <h3 className="text-sm font-semibold line-clamp-1">
            {getName(product)}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {getDescription(product)}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-primary">
              {displayPrice?.toLocaleString()} {t('currency')}
            </span>

            {hasDiscount && (
              <span className="text-xs text-muted-foreground text-sale line-through">
                {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Button */}
          {product.stock > 0 ? (
            <Button
              onClick={handleAddToCart}
              className="mt-2 w-full rounded-xl"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('addToCart')}
            </Button>
          ) : (
            <div className="mt-2 text-center text-sm font-medium text-red-500">
              {t('outOfStock')}
            </div>
          )}

        </div>
        </Card>
      </motion.div>
    </Link>
  )
}