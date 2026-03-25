"use client"

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from "react"
import { Product } from "@/data/products"

export interface CartItem {
  key: string
  product: Product
  colorIdx: number
  styleId: string
  styleLabel: string
  sizeMeters: number
  unitPrice: number
  qty: number
}

interface AddItemOptions {
  qty?: number
  styleId?: string
  styleLabel?: string
  sizeMeters?: number
  unitPrice?: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  wishlist: number[]
  toast: string | null
}

type CartAction =
  | {
      type: "ADD_ITEM"
      payload: {
        product: Product
        colorIdx: number
        qty: number
        styleId: string
        styleLabel: string
        sizeMeters: number
        unitPrice: number
      }
    }
  | { type: "REMOVE_ITEM"; payload: { key: string } }
  | { type: "UPDATE_QTY"; payload: { key: string; qty: number } }
  | { type: "TOGGLE_CART" }
  | { type: "CLOSE_CART" }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_WISHLIST"; payload: { id: number } }
  | { type: "SHOW_TOAST"; payload: { message: string } }
  | { type: "HIDE_TOAST" }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, colorIdx, qty, styleId, styleLabel, sizeMeters, unitPrice } = action.payload
      const key = `${product.id}-${colorIdx}-${styleId}-${sizeMeters.toFixed(2)}`
      const existing = state.items.find((i) => i.key === key)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === key ? { ...i, qty: i.qty + qty } : i
          ),
        }
      }
      return {
        ...state,
        items: [
          ...state.items,
          { key, product, colorIdx, styleId, styleLabel, sizeMeters, unitPrice, qty },
        ],
      }
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.key !== action.payload.key) }
    case "UPDATE_QTY": {
      const newQty = action.payload.qty
      if (newQty <= 0) {
        return { ...state, items: state.items.filter((i) => i.key !== action.payload.key) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === action.payload.key ? { ...i, qty: newQty } : i
        ),
      }
    }
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }
    case "CLOSE_CART":
      return { ...state, isOpen: false }
    case "CLEAR_CART":
      return { ...state, items: [] }
    case "TOGGLE_WISHLIST": {
      const id = action.payload.id
      const exists = state.wishlist.includes(id)
      return {
        ...state,
        wishlist: exists
          ? state.wishlist.filter((wid) => wid !== id)
          : [...state.wishlist, id],
      }
    }
    case "SHOW_TOAST":
      return { ...state, toast: action.payload.message }
    case "HIDE_TOAST":
      return { ...state, toast: null }
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (product: Product, colorIdx: number, options?: AddItemOptions) => void
  removeItem: (key: string) => void
  updateQty: (key: string, qty: number) => void
  toggleCart: () => void
  closeCart: () => void
  clearCart: () => void
  toggleWishlist: (id: number) => void
  isWishlisted: (id: number) => boolean
  showToast: (message: string) => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    wishlist: [],
    toast: null,
  })

  const addItem = useCallback((product: Product, colorIdx: number, options: AddItemOptions = {}) => {
    const qty = options.qty ?? 1
    const styleId = options.styleId ?? "standard"
    const styleLabel = options.styleLabel ?? "Standard Weave"
    const sizeMeters = Math.max(0.5, Number(options.sizeMeters ?? 1))
    const unitPrice = Number((options.unitPrice ?? product.price * sizeMeters).toFixed(2))

    dispatch({ type: "ADD_ITEM", payload: { product, colorIdx, qty, styleId, styleLabel, sizeMeters, unitPrice } })
  }, [])

  const removeItem = useCallback((key: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { key } })
  }, [])

  const updateQty = useCallback((key: string, qty: number) => {
    dispatch({ type: "UPDATE_QTY", payload: { key, qty } })
  }, [])

  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), [])
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), [])
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), [])

  const toggleWishlist = useCallback((id: number) => {
    dispatch({ type: "TOGGLE_WISHLIST", payload: { id } })
  }, [])

  const isWishlisted = useCallback(
    (id: number) => state.wishlist.includes(id),
    [state.wishlist]
  )

  const showToast = useCallback((message: string) => {
    dispatch({ type: "SHOW_TOAST", payload: { message } })
    setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2800)
  }, [])

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0)

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQty,
        toggleCart,
        closeCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        showToast,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
