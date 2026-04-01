'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, CreditCard, Truck, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useI18n, useLocalizedField } from '@/lib/i18n'
import { useCart } from '@/lib/cart/context'
import { createClient } from '@/lib/supabase/client'
import type { PaymentMethod, Profile } from '@/lib/types/database'

export default function CheckoutPage() {
  const { t } = useI18n()
  const { getName } = useLocalizedField()
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cod' as PaymentMethod,
  })

  const shippingFee = subtotal >= 100000 ? 0 : 5000
  const total = subtotal + shippingFee

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setFormData(prev => ({
            ...prev,
            fullName: profile.full_name || '',
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
          }))
        }
      }
    }
    loadProfile()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      setError('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    if (items.length === 0) {
      setError('Your cart is empty')
      setIsLoading(false)
      return
    }

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          status: 'pending',
          total,
          subtotal,
          shipping_fee: shippingFee,
          shipping_name: formData.fullName,
          shipping_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          payment_method: formData.paymentMethod,
          payment_status: formData.paymentMethod === 'cod' ? 'pending' : 'pending',
          notes: formData.notes || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: getName(item.product),
        quantity: item.quantity,
        price: item.product.sale_price ?? item.product.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      await clearCart()

      // Redirect to success page
      router.push(`/checkout/success?order=${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold">{t('cartEmpty')}</h2>
          <Button asChild className="mt-6">
            <Link href="/products">{t('continueShipping')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">{t('checkout')}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping info */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <CardTitle>{t('shippingInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('fullName')} *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+964 750 123 4567"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">{t('city')} *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Erbil, Baghdad, Sulaymaniyah..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{t('address')} *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Street, building, floor, apartment..."
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">{t('notes')}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special instructions..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment method */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>{t('paymentMethod')}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as PaymentMethod }))}
                  className="space-y-3"
                >
                  <label className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-secondary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                    <RadioGroupItem value="cod" id="cod" />
                    <Banknote className="h-6 w-6 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{t('cod')}</p>
                      <p className="text-sm text-muted-foreground">{t('codDesc')}</p>
                    </div>
                  </label>
                  
                  <label className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-secondary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                    <RadioGroupItem value="fastpay" id="fastpay" />
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">FP</div>
                    <div className="flex-1">
                      <p className="font-medium">{t('fastpay')}</p>
                      <p className="text-sm text-muted-foreground">{t('fastpayDesc')}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Coming Soon</span>
                  </label>
                  
                  <label className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-secondary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                    <RadioGroupItem value="fib" id="fib" />
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-green-600 text-xs font-bold text-white">FIB</div>
                    <div className="flex-1">
                      <p className="font-medium">{t('fib')}</p>
                      <p className="text-sm text-muted-foreground">{t('fibDesc')}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Coming Soon</span>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t('orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="max-h-64 space-y-3 overflow-y-auto">
                  {items.map((item) => {
                    const price = item.product.sale_price ?? item.product.price
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-secondary/30">
                          {item.product.images?.[0] && (
                            <Image
                              src={item.product.images[0]}
                              alt={getName(item.product)}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="line-clamp-1 font-medium">{getName(item.product)}</p>
                          <p className="text-muted-foreground">
                            {item.quantity} x {price.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {(price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cartSubtotal')}</span>
                    <span>{subtotal.toLocaleString()} {t('currency')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('shipping')}</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-[var(--success)]">{t('freeShipping')}</span>
                      ) : (
                        `${shippingFee.toLocaleString()} ${t('currency')}`
                      )}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>{t('cartTotal')}</span>
                  <span className="text-lg">{total.toLocaleString()} {t('currency')}</span>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? t('loading') : t('placeOrder')}
                </Button>

                {!userId && (
                  <p className="text-center text-xs text-muted-foreground">
                    <Link href="/auth/login" className="text-primary hover:underline">
                      {t('login')}
                    </Link>
                    {' '}to save your order history
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
