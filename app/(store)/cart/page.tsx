'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useI18n, useLocalizedField } from '@/lib/i18n'
import { useCart } from '@/lib/cart/context'

export default function CartPage() {
  const { t } = useI18n()
  const { getName } = useLocalizedField()
  const { items, itemCount, subtotal, isLoading, updateQuantity, removeItem } = useCart()

  const total = subtotal

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold">{t('cartEmpty')}</h2>
          <p className="mt-2 text-muted-foreground">
            Add items to your cart to see them here
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">{t('continueShipping')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">{t('shoppingCart')}</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const price = item.product.sale_price ?? item.product.price
              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product image */}
                      <Link href={`/product/${item.product.id}`} className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-secondary/30">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={getName(item.product)}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </Link>

                      {/* Product info */}
                      <div className="flex flex-1 flex-col">
                        <Link href={`/product/${item.product.id}`} className="font-medium hover:text-primary">
                          {getName(item.product)}
                        </Link>
                        
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <span className="font-semibold text-primary">
                            {price.toLocaleString()} {t('currency')}
                          </span>
                          {item.product.sale_price && (
                            <span className="text-muted-foreground line-through">
                              {item.product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          {/* Quantity controls */}
                          <div className="flex items-center rounded-md border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Remove button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Order summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>{t('orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('cartSubtotal')} ({itemCount} items)</span>
                <span>{subtotal.toLocaleString()} {t('currency')}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>{t('cartTotal')}</span>
                <span className="text-lg">{total.toLocaleString()} {t('currency')}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">{t('proceedToCheckout')}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/products">{t('continueShipping')}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
