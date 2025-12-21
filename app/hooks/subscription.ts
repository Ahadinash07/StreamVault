'use client'

import { useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import {
  selectCurrentSubscription,
  selectSubscriptionLimits,
  selectCanAccessContent,
  selectUpgradePromptVisible,
  showUpgradePrompt,
  hideUpgradePrompt
} from '../features/subscription/subscriptionSlice'

export type ContentType = 'movie' | 'series' | 'gaming'

export const useSubscription = () => {
  const dispatch = useAppDispatch()
  const subscription = useAppSelector(selectCurrentSubscription)
  const limits = useAppSelector(selectSubscriptionLimits)

  return {
    subscription,
    limits,
    isPremium: subscription?.planId !== 'free',
    isActive: subscription?.status === 'active'
  }
}

export const useContentAccess = (contentId: string, contentType: ContentType) => {
  const dispatch = useAppDispatch()
  const canAccess = useAppSelector(state => selectCanAccessContent(state, contentId, contentType))
  const subscription = useAppSelector(selectCurrentSubscription)

  const requestAccess = useCallback(() => {
    if (!canAccess) {
      dispatch(showUpgradePrompt(true))
    }
  }, [canAccess, dispatch])

  return {
    canAccess,
    requestAccess,
    subscription
  }
}

export const useSubscriptionLimits = () => {
  const limits = useAppSelector(selectSubscriptionLimits)
  const subscription = useAppSelector(selectCurrentSubscription)

  return {
    limits,
    subscription,
    hasReachedLimit: (limitType: keyof typeof limits) => {
      // This would be implemented based on actual usage tracking
      // For now, return false for premium users
      return subscription?.planId === 'free' && limits[limitType] !== -1
    }
  }
}

export const useUpgradePrompt = () => {
  const dispatch = useAppDispatch()
  const isVisible = useAppSelector(selectUpgradePromptVisible)

  const show = useCallback(() => {
    dispatch(showUpgradePrompt(true))
  }, [dispatch])

  const hide = useCallback(() => {
    dispatch(hideUpgradePrompt())
  }, [dispatch])

  return {
    isVisible,
    show,
    hide
  }
}