'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VideoPlayer from '@/components/VideoPlayer'
import { useAppSelector, useAppDispatch } from '../hooks'
import { joinWatchParty, updateWatchParty } from '../features/social/socialSlice'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

function WatchPartyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const partyCode = searchParams.get('code')
  const { user } = useAppSelector((state) => state.user)
  const { watchParties } = useAppSelector((state) => state.social)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  const party = watchParties.find((p) => p.id === partyCode)

  useEffect(() => {
    if (!partyCode) {
      router.push('/')
      return
    }
    if (!user) {
      toast.error('Please sign in to join watch party')
      router.push('/login')
      return
    }
    if (party && !party.participants.includes(user.id)) {
      dispatch(joinWatchParty({ partyId: partyCode, userId: user.id }))
      toast.success('Joined watch party!')
    }
  }, [partyCode, user, party, dispatch, router])

  if (!party) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-gray-400 text-lg">Watch party not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const content =
    party.contentType === 'movie'
      ? movies.find((m) => m.id === party.contentId)
      : series.find((s) => s.id === party.contentId)

  if (!content) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-gray-400 text-lg">Content not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const episode =
    party.contentType === 'series' && party.episodeId
      ? series
          .find((s) => s.id === party.contentId)
          ?.seasons.find((se) => se.id === party.seasonId)
          ?.episodes.find((e) => e.id === party.episodeId)
      : undefined

  const season =
    party.contentType === 'series' && party.seasonId
      ? series
          .find((s) => s.id === party.contentId)
          ?.seasons.find((se) => se.id === party.seasonId)
      : undefined

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <VideoPlayer
        content={content}
        episode={episode}
        season={season}
        onClose={() => router.push('/')}
      />
      <Footer />
    </div>
  )
}

export default function WatchPartyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Loading watch party...</div>
        </div>
      </div>
    }>
      <WatchPartyContent />
    </Suspense>
  )
}

