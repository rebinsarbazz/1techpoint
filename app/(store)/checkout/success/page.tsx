'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderItem } from '@/lib/types/database'

// Separate component that uses useSearchParams
function SuccessContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState<(Order & { items: OrderItem[] }) | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return

      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('id', orderId)
        .single()

      if (data) {
        setOrder(data as Order & { items: OrderItem[] })
      }
    }
    loadOrder()
  }, [orderId, supabase])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)]/10">
            <CheckCircle2 className="h-10 w-10 text-[var(--success)]" />
          </div>
        </div>

        <h1 className="text-2xl font-bold md:text-3xl">Thank You for Your Order!</h1>
        <p className="mt-2 text-muted-foreground">
          Your order has been placed successfully. We&apos;ll send you a confirmation soon.
        </p>

        {order && (
          <Card className="mt-8 text-left">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('orderNumber')}</span>
                  <span className="font-mono text-sm">#{order.id.slice(0, 8)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('orderStatus')}</span>
                  <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    {t('statusPending')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('paymentMethod')}</span>
                  <span className="capitalize">{order.payment_method === 'cod' ? t('cod') : order.payment_method}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('orderTotal')}</span>
                  <span className="text-lg font-bold">{order.total.toLocaleString()} {t('currency')}</span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-secondary/50 p-4">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Shipping To</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_name}<br />
                      {order.shipping_phone}<br />
                      {order.shipping_address}<br />
                      {order.shipping_city}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/orders">
              {t('orders')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">{t('continueShipping')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)]/10">
              <CheckCircle2 className="h-10 w-10 text-[var(--success)]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">Loading your order...</h1>
          <p className="mt-2 text-muted-foreground">Please wait while we confirm your order.</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}