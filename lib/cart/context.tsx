'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product, CartItem } from '@/lib/types/database'

type CartContextItem = {
  id: string
  product: Product
  quantity: number
}

type CartContextType = {
  items: CartContextItem[]
  isLoading: boolean
  itemCount: number
  subtotal: number
  addItem: (product: Product, quantity?: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncWithDatabase: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

const CART_STORAGE_KEY = 'electromall-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartContextItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  // Calculate derived values
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.sale_price ?? item.product.price
    return sum + (price * item.quantity)
  }, 0)

  // Load cart from localStorage or database
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUserId(user.id)
          // Load from database for authenticated users
          const { data: cartItems } = await supabase
            .from('cart_items')
            .select('*, product:products(*)')
            .eq('user_id', user.id)

          if (cartItems) {
            const loadedItems: CartContextItem[] = cartItems
              .filter(item => item.product)
              .map(item => ({
                id: item.id,
                product: item.product as Product,
                quantity: item.quantity,
              }))
            setItems(loadedItems)
          }
        } else {
          // Load from localStorage for guests
          const savedCart = localStorage.getItem(CART_STORAGE_KEY)
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart)
              setItems(parsedCart)
            } catch {
              localStorage.removeItem(CART_STORAGE_KEY)
            }
          }
        }
      } catch (error) {
        console.error('Failed to load cart:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [supabase])

  // Save to localStorage when items change (for guests)
  useEffect(() => {
    if (!userId && !isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, userId, isLoading])

  const addItem = useCallback(async (product: Product, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id)
      
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        }
        return updated
      }
      
      return [...prev, { id: crypto.randomUUID(), product, quantity }]
    })

    // Sync to database if authenticated
    if (userId) {
      const existingItem = items.find(item => item.product.id === product.id)
      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity, updated_at: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('product_id', product.id)
      } else {
        await supabase
          .from('cart_items')
          .insert({ user_id: userId, product_id: product.id, quantity })
      }
    }
  }, [userId, items, supabase])

  const removeItem = useCallback(async (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))

    if (userId) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
    }
  }, [userId, supabase])

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(productId)
    }

    setItems(prev => prev.map(item => 
      item.product.id === productId 
        ? { ...item, quantity } 
        : item
    ))

    if (userId) {
      await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('product_id', productId)
    }
  }, [userId, removeItem, supabase])

  const clearCart = useCallback(async () => {
    setItems([])

    if (userId) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
    } else {
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }, [userId, supabase])

  const syncWithDatabase = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUserId(user.id)

    // Merge localStorage cart with database cart
    const localItems = [...items]
    
    for (const item of localItems) {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', item.product.id)
        .single()

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + item.quantity })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('cart_items')
          .insert({ user_id: user.id, product_id: item.product.id, quantity: item.quantity })
      }
    }

    // Clear localStorage
    localStorage.removeItem(CART_STORAGE_KEY)

    // Reload from database
    const { data: cartItems } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id)

    if (cartItems) {
      const loadedItems: CartContextItem[] = cartItems
        .filter(item => item.product)
        .map(item => ({
          id: item.id,
          product: item.product as Product,
          quantity: item.quantity,
        }))
      setItems(loadedItems)
    }
  }, [items, supabase])

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      syncWithDatabase,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
