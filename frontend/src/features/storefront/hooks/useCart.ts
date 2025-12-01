import { useState, useEffect } from 'react'
import { PublicProduct } from '@/types/public'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  size: string | null
  color: string | null
  quantity: number
  image?: string
}

interface AddToCartParams {
  product: PublicProduct
  size: string | null
  color: string | null
  quantity: number
}

const CART_STORAGE_KEY = 'mywabiz_cart'

export function useCart(storeSlug: string) {
  const storageKey = `${CART_STORAGE_KEY}_${storeSlug}`

  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on mount
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Failed to load cart:', error)
      return []
    }
  })

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save cart:', error)
    }
  }, [items, storageKey])

  const addItem = ({ product, size, color, quantity }: AddToCartParams) => {
    const itemId = `${product.id}_${size || 'no-size'}_${color || 'no-color'}`

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === itemId)

      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          size,
          color,
          quantity,
          image: product.thumbnail_url || product.image_urls[0],
        }
        return [...prevItems, newItem]
      }
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem(storageKey)
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal: getSubtotal(),
    itemCount: getItemCount(),
  }
}
