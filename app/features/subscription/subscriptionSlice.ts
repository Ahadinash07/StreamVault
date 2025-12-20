import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type PlanType = 'free' | 'basic' | 'standard' | 'premium'

interface Subscription {
  plan: PlanType
  startDate: string
  endDate: string | null
  isActive: boolean
  autoRenew: boolean
}

interface SubscriptionState {
  subscription: Subscription | null
  loading: boolean
  error: string | null
}

const initialState: SubscriptionState = {
  subscription: null,
  loading: false,
  error: null,
}

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.subscription = action.payload
    },
    updatePlan: (state, action: PayloadAction<PlanType>) => {
      if (state.subscription) {
        state.subscription.plan = action.payload
      } else {
        state.subscription = {
          plan: action.payload,
          startDate: new Date().toISOString(),
          endDate: null,
          isActive: true,
          autoRenew: true,
        }
      }
    },
    cancelSubscription: (state) => {
      if (state.subscription) {
        state.subscription.autoRenew = false
        state.subscription.endDate = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString()
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setSubscription,
  updatePlan,
  cancelSubscription,
  setLoading,
  setError,
} = subscriptionSlice.actions

export default subscriptionSlice.reducer

