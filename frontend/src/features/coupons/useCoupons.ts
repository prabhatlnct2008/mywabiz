import { useState, useEffect } from 'react'
import { couponsApi } from '@/api/coupons'
import { Coupon, CouponCreate, CouponUpdate } from '@/types/coupon'

export const useCoupons = (storeId: string) => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCoupons = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await couponsApi.list(storeId)
      setCoupons(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  const createCoupon = async (data: CouponCreate) => {
    setError(null)
    try {
      const newCoupon = await couponsApi.create(storeId, data)
      setCoupons([...coupons, newCoupon])
      return newCoupon
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to create coupon'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  const updateCoupon = async (couponId: string, data: CouponUpdate) => {
    setError(null)
    try {
      const updated = await couponsApi.update(storeId, couponId, data)
      setCoupons(coupons.map((c) => (c.id === couponId ? updated : c)))
      return updated
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to update coupon'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  const deleteCoupon = async (couponId: string) => {
    setError(null)
    try {
      await couponsApi.delete(storeId, couponId)
      setCoupons(coupons.filter((c) => c.id !== couponId))
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to delete coupon'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  useEffect(() => {
    if (storeId) {
      fetchCoupons()
    }
  }, [storeId])

  return {
    coupons,
    loading,
    error,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    refetch: fetchCoupons,
  }
}
