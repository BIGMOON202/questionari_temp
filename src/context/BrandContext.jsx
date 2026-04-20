import { createContext, useContext } from 'react'

export const BrandContext = createContext(null)

export function useBrand() {
  const ctx = useContext(BrandContext)
  if (!ctx) {
    throw new Error('useBrand must be used within a brand route')
  }
  return ctx
}
