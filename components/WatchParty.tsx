'use client'

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { createWatchParty, joinWatchParty, updateWatchParty } from '@/app/features/social/socialSlice'
import { FiUsers, FiPlay, FiPause, FiX, FiCopy, FiShare2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { Movie, Series } from '@/types/content'

interface WatchPartyProps {
  content: Movie | Series
  episodeId?: string
  seasonId?: string
  onClose: () => void
}

export default function WatchParty({ content, episodeId, seasonId, onClose }: WatchPartyProps) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const { watchParties } = useAppSelector((state) => state.social)
  const [partyCode, setPartyCode] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [participants, setParticipants] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      const code = `SV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      setPartyCode(code)
      
      const party = {
        id: code,
        hostId: user.id,
        hostName: user.name,
        contentId: content.id,
        contentTitle: content.title,
        contentType: content.type,
        episodeId,
        seasonId,
        participants: [user.id],
        isActive: true,
        currentTime: 0,
        isPlaying: false,
        createdAt: new Date().toISOString(),
      }
      
      dispatch(createWatchParty(party))
      setIsHost(true)
      setParticipants([user.id])
    }
  }, [user, content.id, content.title, content.type, episodeId, dispatch])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(partyCode)
    toast.success('Party code copied!')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Watch ${content.title} with me on StreamVault!`,
        text: `Join my watch party! Code: ${partyCode}`,
        url: window.location.href,
      })
    } else {
      handleCopyCode()
    }
  }

  const handlePlayPause = () => {
    const party = watchParties.find((p) => p.id === partyCode)
    if (party && isHost) {
      dispatch(updateWatchParty({
        id: partyCode,
        isPlaying: !party.isPlaying,
      }))
      toast.success(party.isPlaying ? 'Paused for all' : 'Playing for all')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100 border border-dark-200 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Watch Party</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-200 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-2">Party Code</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 px-4 py-3 bg-dark-200 rounded-lg font-mono text-xl font-bold text-center">
                {partyCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <FiCopy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-2">Watching</p>
            <p className="text-lg font-semibold">{content.title}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Participants</p>
              <div className="flex items-center space-x-1">
                <FiUsers className="w-4 h-4" />
                <span>{participants.length}</span>
              </div>
            </div>
            <div className="space-y-2">
              {participants.map((id) => (
                <div
                  key={id}
                  className="flex items-center space-x-2 p-2 bg-dark-200 rounded"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-xs font-semibold">
                      {id === user?.id ? 'You' : id.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm">
                    {id === user?.id ? 'You (Host)' : `User ${id.slice(0, 4)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isHost && (
            <div className="flex space-x-2">
              <button
                onClick={handlePlayPause}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {watchParties.find((p) => p.id === partyCode)?.isPlaying ? (
                  <>
                    <FiPause className="w-5 h-5" />
                    <span>Pause All</span>
                  </>
                ) : (
                  <>
                    <FiPlay className="w-5 h-5" />
                    <span>Play All</span>
                  </>
                )}
              </button>
            </div>
          )}

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors"
          >
            <FiShare2 className="w-5 h-5" />
            <span>Share Party</span>
          </button>

          <p className="text-xs text-gray-500 text-center">
            Share the party code with friends to watch together!
          </p>
        </div>
      </div>
    </div>
  )
}

