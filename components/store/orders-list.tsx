'use client'

import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n'
import type { Order, OrderItem, OrderStatus } from '@/lib/types/database'

type OrdersListProps = {
  orders: (Order & { items: OrderItem[] })[]
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function OrdersList({ orders }: OrdersListProps) {
  const { t } = useI18n()

  const getStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pending: t('statusPending'),
      confirmed: t('statusConfirmed'),
      processing: t('statusProcessing'),
      shipped: t('statusShipped'),
      delivered: t('statusDelivered'),
      cancelled: t('statusCancelled'),
    }
    return labels[status]
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold">{t('noOrders')}</h2>
        <p className="mt-2 text-muted-foreground">
          Start shopping to see your orders here
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t('allProducts')}
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">{t('orderHistory')}</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-sm text-muted-foreground">
                        #{order.id.slice(0, 8)}
                      </p>
                      <Badge className={statusColors[order.status]}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:gap-8">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {order.items?.length || 0} items
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {order.total.toLocaleString()} {t('currency')}
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
