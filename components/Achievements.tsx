'use client'

import { useState, useEffect } from 'react'
import { useAppSelector } from '@/app/hooks'
import { FiAward, FiStar } from 'react-icons/fi'

export default function Achievements() {
  const [mounted, setMounted] = useState(false)
  const { achievements, totalPoints, level } = useAppSelector((state) => state.achievements)
  const unlocked = achievements.filter((a) => a.unlockedAt)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || unlocked.length === 0) return null

  return (
    <div className="mb-8 md:mb-12">
      <div className="flex items-center justify-between mb-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Your Achievements</h2>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <FiStar className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold">{totalPoints}</span>
            </div>
            <p className="text-xs text-gray-400">Points</p>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <FiAward className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold">Level {level}</span>
            </div>
            <p className="text-xs text-gray-400">Level</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 sm:px-6 lg:px-8">
        {unlocked.slice(0, 10).map((achievement) => (
          <div
            key={achievement.id}
            className="bg-dark-100 border border-dark-200 rounded-lg p-4 text-center group hover:border-blue-500 transition-colors"
          >
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{achievement.title}</h3>
            <p className="text-xs text-gray-400 mb-2 line-clamp-2">{achievement.description}</p>
            <div className="flex items-center justify-center space-x-1 text-xs text-yellow-400">
              <FiAward className="w-3 h-3" />
              <span>{achievement.points} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

