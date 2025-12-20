'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { addReview, likeReview } from '@/app/features/social/socialSlice'
import { FiStar, FiThumbsUp, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface ReviewsProps {
  contentId: string
}

export default function Reviews({ contentId }: ReviewsProps) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const { reviews } = useAppSelector((state) => state.social)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [showForm, setShowForm] = useState(false)

  const contentReviews = reviews[contentId] || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in to write a review')
      return
    }
    if (!comment.trim()) {
      toast.error('Please write a comment')
      return
    }

    dispatch(
      addReview({
        id: Date.now().toString(),
        contentId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar || '',
        rating,
        comment,
        likes: 0,
        timestamp: new Date().toISOString(),
      })
    )

    toast.success('Review added!')
    setComment('')
    setRating(5)
    setShowForm(false)
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <button
          onClick={() => {
            if (!user) {
              toast.error('Please sign in to write a review')
              return
            }
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Write Review
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-dark-100 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`${
                    star <= rating ? 'text-yellow-400' : 'text-gray-400'
                  } hover:text-yellow-400 transition-colors`}
                >
                  <FiStar className="w-6 h-6 fill-current" />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-400">{rating}/5</span>
            </div>
          </div>
          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              rows={4}
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-dark-200 hover:bg-dark-300 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {contentReviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          contentReviews.map((review) => (
            <div key={review.id} className="p-4 bg-dark-100 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  {review.userAvatar ? (
                    <img src={review.userAvatar} alt={review.userName} className="w-full h-full rounded-full" />
                  ) : (
                    <FiUser className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.userName}</p>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(review.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-2">{review.comment}</p>
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error('Please sign in to like reviews')
                        return
                      }
                      dispatch(likeReview({ contentId, reviewId: review.id }))
                    }}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      review.isLiked ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
                    }`}
                  >
                    <FiThumbsUp className="w-4 h-4" />
                    <span>{review.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

