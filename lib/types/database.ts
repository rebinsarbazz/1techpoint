// Database types for ElectroMall

export type Category = {
  id: string
  name_en: string
  name_ku: string
  name_ar: string
  slug: string
  image_url: string | null
  parent_id: string | null
  sort_order: number
  created_at: string
}

export type Product = {
  id: string
  name_en: string
  name_ku: string
  name_ar: string
  description_en: string | null
  description_ku: string | null
  description_ar: string | null
  price: number
  sale_price: number | null
  stock: number
  sku: string | null
  category_id: string | null
  images: string[]
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentMethod = 'cod' | 'fastpay' | 'fib'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type Order = {
  id: string
  user_id: string | null
  status: OrderStatus
  total: number
  subtotal: number
  shipping_fee: number
  shipping_name: string
  shipping_phone: string
  shipping_address: string
  shipping_city: string
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  price: number
  created_at: string
  product?: Product
}

export type CartItem = {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

// Helper type for localized fields
export type Locale = 'en' | 'ku' | 'ar'

export function getLocalizedField<T extends { name_en: string; name_ku: string; name_ar: string }>(
  item: T,
  field: 'name',
  locale: Locale
): string {
  const key = `${field}_${locale}` as keyof T
  return item[key] as string
}

export function getLocalizedDescription<T extends { description_en: string | null; description_ku: string | null; description_ar: string | null }>(
  item: T,
  locale: Locale
): string | null {
  const key = `description_${locale}` as keyof T
  return item[key] as string | null
}
