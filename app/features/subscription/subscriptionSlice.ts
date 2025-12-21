import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type PlanType = 'free' | 'basic' | 'standard' | 'premium'
export type PaymentMethod = 'card' | 'paypal' | 'bank' | 'crypto'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface SubscriptionPlan {
  id: PlanType
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  description: string
  features: string[]
  maxScreens: number
  maxDownloads: number
  hasAds: boolean
  has4K: boolean
  hasHDR: boolean
  hasOfflineViewing: boolean
  hasExclusiveContent: boolean
  popular?: boolean
}

export interface PaymentMethodData {
  id: string
  type: PaymentMethod
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  cardBrand?: string
  email?: string
  isDefault: boolean
}

export interface Transaction {
  id: string
  amount: number
  currency: string
  status: PaymentStatus
  plan: PlanType
  paymentMethod: PaymentMethodData
  timestamp: string
  description: string
  invoiceUrl?: string
}

export interface Subscription {
  id: string
  planId: PlanType
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  paymentMethod: PaymentMethodData | null
  autoRenew: boolean
  trialEnd?: string
}

export interface SubscriptionState {
  // Current subscription
  subscription: Subscription | null

  // Available plans
  plans: SubscriptionPlan[]

  // Payment methods
  paymentMethods: PaymentMethodData[]

  // Transaction history
  transactions: Transaction[]

  // Payment processing
  currentPayment: {
    planId: PlanType | null
    amount: number
    paymentMethod: PaymentMethodData | null
    status: PaymentStatus
    transactionId: string | null
  } | null

  // UI state
  loading: boolean
  error: string | null
  selectedPlan: PlanType | null
  showUpgradePrompt: boolean
  restrictedContent: string[] // Content IDs that require premium
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    description: 'Basic streaming with ads',
    features: [
      'Stream on 1 device',
      'Standard definition',
      'Ads included',
      'Limited content library'
    ],
    maxScreens: 1,
    maxDownloads: 0,
    hasAds: true,
    has4K: false,
    hasHDR: false,
    hasOfflineViewing: false,
    hasExclusiveContent: false
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 7.99,
    currency: 'USD',
    interval: 'month',
    description: 'Great value streaming',
    features: [
      'Stream on 2 devices',
      'HD available',
      'No ads on premium content',
      'Download on 1 device'
    ],
    maxScreens: 2,
    maxDownloads: 1,
    hasAds: false,
    has4K: false,
    hasHDR: false,
    hasOfflineViewing: true,
    hasExclusiveContent: false
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 12.99,
    currency: 'USD',
    interval: 'month',
    description: 'Most popular choice',
    features: [
      'Stream on 3 devices',
      'Full HD & 4K',
      'No ads',
      'Download on 3 devices',
      'HDR available'
    ],
    maxScreens: 3,
    maxDownloads: 3,
    hasAds: false,
    has4K: true,
    hasHDR: true,
    hasOfflineViewing: true,
    hasExclusiveContent: false,
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 17.99,
    currency: 'USD',
    interval: 'month',
    description: 'Ultimate entertainment experience',
    features: [
      'Stream on 5 devices',
      '4K Ultra HD & HDR',
      'No ads',
      'Download on 5 devices',
      'Exclusive content',
      'Priority support'
    ],
    maxScreens: 5,
    maxDownloads: 5,
    hasAds: false,
    has4K: true,
    hasHDR: true,
    hasOfflineViewing: true,
    hasExclusiveContent: true
  }
]

const initialState: SubscriptionState = {
  subscription: {
    id: 'sub-free',
    planId: 'free',
    status: 'active',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    paymentMethod: null,
    autoRenew: false
  },
  plans: subscriptionPlans,
  paymentMethods: [],
  transactions: [],
  currentPayment: null,
  loading: false,
  error: null,
  selectedPlan: null,
  showUpgradePrompt: false,
  restrictedContent: [
    'movie-premium-1',
    'movie-premium-2',
    'series-premium-1',
    'gaming-premium-1',
    'exclusive-content-1'
  ]
}

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    // Subscription management
    setSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.subscription = action.payload
    },
    updateSubscriptionPlan: (state, action: PayloadAction<PlanType>) => {
      if (state.subscription) {
        state.subscription.planId = action.payload
        state.subscription.currentPeriodStart = new Date().toISOString()
        // Set period end based on plan
        const plan = state.plans.find(p => p.id === action.payload)
        if (plan) {
          const endDate = new Date()
          endDate.setMonth(endDate.getMonth() + (plan.interval === 'year' ? 12 : 1))
          state.subscription.currentPeriodEnd = endDate.toISOString()
        }
      }
    },
    cancelSubscription: (state) => {
      if (state.subscription) {
        state.subscription.cancelAtPeriodEnd = true
        state.subscription.autoRenew = false
      }
    },
    reactivateSubscription: (state) => {
      if (state.subscription) {
        state.subscription.cancelAtPeriodEnd = false
        state.subscription.autoRenew = true
      }
    },

    // Payment methods
    addPaymentMethod: (state, action: PayloadAction<PaymentMethodData>) => {
      // Create a copy of the payment method to avoid mutating the action payload
      const paymentMethod = { ...action.payload }

      // Set as default if it's the first one or explicitly marked
      if (state.paymentMethods.length === 0 || paymentMethod.isDefault) {
        state.paymentMethods.forEach(method => method.isDefault = false)
        paymentMethod.isDefault = true
      }
      state.paymentMethods.push(paymentMethod)
    },
    removePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods = state.paymentMethods.filter(method => method.id !== action.payload)
    },
    setDefaultPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods.forEach(method => {
        method.isDefault = method.id === action.payload
      })
    },

    // Payment processing
    initiatePayment: (state, action: PayloadAction<{ planId: PlanType; paymentMethod: PaymentMethodData }>) => {
      const plan = state.plans.find(p => p.id === action.payload.planId)
      if (plan) {
        state.currentPayment = {
          planId: action.payload.planId,
          amount: plan.price,
          paymentMethod: action.payload.paymentMethod,
          status: 'pending',
          transactionId: `txn_${Date.now()}`
        }
        state.loading = true
        state.error = null
      }
    },
    processPayment: (state) => {
      if (state.currentPayment) {
        state.currentPayment.status = 'processing'
      }
    },
    completePayment: (state, action: PayloadAction<{ transaction: Transaction }>) => {
      if (state.currentPayment) {
        state.currentPayment.status = 'completed'
        state.transactions.unshift(action.payload.transaction)

        // Update subscription if payment was successful
        if (state.currentPayment.planId) {
          state.subscription = {
            id: `sub_${Date.now()}`,
            planId: state.currentPayment.planId,
            status: 'active',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: false,
            paymentMethod: state.currentPayment.paymentMethod,
            autoRenew: true
          }
        }

        state.currentPayment = null
        state.loading = false
      }
    },
    failPayment: (state, action: PayloadAction<string>) => {
      if (state.currentPayment) {
        state.currentPayment.status = 'failed'
        state.error = action.payload
        state.loading = false
      }
    },
    cancelPayment: (state) => {
      state.currentPayment = null
      state.loading = false
      state.error = null
    },

    // UI state
    setSelectedPlan: (state, action: PayloadAction<PlanType | null>) => {
      state.selectedPlan = action.payload
    },
    showUpgradePrompt: (state, action: PayloadAction<boolean>) => {
      state.showUpgradePrompt = action.payload
    },
    hideUpgradePrompt: (state) => {
      state.showUpgradePrompt = false
    },
    setRestrictedContent: (state, action: PayloadAction<string[]>) => {
      state.restrictedContent = action.payload
    },

    // Utility
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
})

// Selectors
export const selectCurrentSubscription = (state: { subscription: SubscriptionState }) =>
  state.subscription.subscription

export const selectCurrentPlan = (state: { subscription: SubscriptionState }) =>
  state.subscription.plans.find(plan => plan.id === state.subscription.subscription?.planId)

export const selectSubscriptionLimits = (state: { subscription: SubscriptionState }) => {
  const plan = state.subscription.plans.find(plan => plan.id === state.subscription.subscription?.planId)
  return plan ? {
    maxScreens: plan.maxScreens,
    maxDownloads: plan.maxDownloads,
    hasAds: plan.hasAds,
    has4K: plan.has4K,
    hasHDR: plan.hasHDR,
    hasOfflineViewing: plan.hasOfflineViewing,
    hasExclusiveContent: plan.hasExclusiveContent
  } : {
    maxScreens: 1,
    maxDownloads: 0,
    hasAds: true,
    has4K: false,
    hasHDR: false,
    hasOfflineViewing: false,
    hasExclusiveContent: false
  }
}

export const selectCanAccessContent = (state: { subscription: SubscriptionState }, contentId: string, contentType: 'movie' | 'series' | 'gaming') => {
  const subscription = state.subscription.subscription
  if (!subscription || subscription.status !== 'active') return false

  // Free users can only access non-restricted content
  if (subscription.planId === 'free') {
    return !state.subscription.restrictedContent.includes(contentId)
  }

  return true
}

export const selectUpgradePromptVisible = (state: { subscription: SubscriptionState }) =>
  state.subscription.showUpgradePrompt

export const {
  setSubscription,
  updateSubscriptionPlan,
  cancelSubscription,
  reactivateSubscription,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  initiatePayment,
  processPayment,
  completePayment,
  failPayment,
  cancelPayment,
  setSelectedPlan,
  showUpgradePrompt,
  hideUpgradePrompt,
  setRestrictedContent,
  setLoading,
  setError,
  clearError,
} = subscriptionSlice.actions

export default subscriptionSlice.reducer

