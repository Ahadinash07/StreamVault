'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import {
  FiArrowLeft,
  FiHeart,
  FiShare,
  FiBookmark,
  FiMessageSquare,
  FiEye,
  FiClock,
  FiUser,
  FiCalendar,
  FiTag,
  FiThumbsUp,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { setCurrentArticle, likeArticle, bookmarkArticle, addComment, likeComment } from '@/app/features/news/newsSlice'

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const { articles, currentArticle, userInteractions } = useAppSelector((state) => state.news)

  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  const articleId = params.id as string
  const article = articles.find(a => a.id === articleId) || currentArticle

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      setReadingProgress(Math.min(scrolled, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Set current article on mount
  useEffect(() => {
    if (article && article.id !== currentArticle?.id) {
      dispatch(setCurrentArticle(article))
    }
  }, [article, currentArticle, dispatch])

  // Handle like article
  const handleLikeArticle = () => {
    if (!isAuthenticated || !user) return
    dispatch(likeArticle({ articleId: article!.id, userId: user.id }))
  }

  // Handle bookmark article
  const handleBookmarkArticle = () => {
    if (!isAuthenticated) return
    dispatch(bookmarkArticle(article!.id))
  }

  // Handle share article
  const handleShareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article!.title,
        text: article!.excerpt,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Show toast notification
    }
  }

  // Handle add comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !user || !newComment.trim()) return

    dispatch(addComment({
      articleId: article!.id,
      comment: {
        userId: user.id,
        username: user.name,
        avatar: user.avatar || 'https://picsum.photos/seed/default/100/100',
        content: newComment.trim()
      }
    }))
    setNewComment('')
  }

  // Handle like comment
  const handleLikeComment = (commentId: string) => {
    if (!isAuthenticated || !user) return
    dispatch(likeComment({ commentId, userId: user.id, articleId: article!.id }))
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get related articles
  const relatedArticles = articles
    .filter(a => a.id !== articleId && (
      a.category === article?.category ||
      a.tags.some(tag => article?.tags.includes(tag))
    ))
    .slice(0, 3)

  if (!article) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
              <p className="text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
              <Link
                href="/gaming/news"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Back to News
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isLiked = userInteractions.likedArticles.includes(article.id)
  const isBookmarked = userInteractions.bookmarkedArticles.includes(article.id)

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-800">
        <div
          className="h-full bg-purple-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="pt-20">
        {/* Back Navigation */}
        <div className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back to News
            </button>
          </div>
        </div>

        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Article Header */}
          <header className="mb-8">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-full">
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium text-white">{article.author.name}</div>
                  <div className="text-sm">{article.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  {formatDate(article.publishedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  {article.readTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <FiEye className="w-4 h-4" />
                  {article.views.toLocaleString()} views
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <FiTag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Article Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </header>

          {/* Article Actions */}
          <div className="flex items-center justify-between mb-8 p-4 bg-gray-900 rounded-lg">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLikeArticle}
                disabled={!isAuthenticated}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{article.likes}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiMessageSquare className="w-5 h-5" />
                <span>{article.comments.length}</span>
              </button>

              <button
                onClick={handleShareArticle}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiShare className="w-5 h-5" />
                Share
              </button>
            </div>

            <button
              onClick={handleBookmarkArticle}
              disabled={!isAuthenticated}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none mb-12">
            <div
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: article.content.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-800 pt-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Comments ({article.comments.length})</h3>

                {/* Add Comment Form */}
                {isAuthenticated && user ? (
                  <form onSubmit={handleAddComment} className="mb-8">
                    <div className="flex gap-4">
                      <Image
                        src={user.avatar || 'https://picsum.photos/seed/default/100/100'}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8 bg-gray-900 rounded-lg mb-8">
                    <FiMessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Sign in to join the conversation</p>
                    <Link
                      href="/login"
                      className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                  {article.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Image
                        src={comment.avatar}
                        alt={comment.username}
                        width={40}
                        height={40}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-white">{comment.username}</span>
                          <span className="text-gray-400 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{comment.content}</p>
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          disabled={!isAuthenticated}
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            comment.likedBy.includes(user?.id || '')
                              ? 'text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <FiThumbsUp className="w-4 h-4" />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-gray-800 pt-8">
              <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/gaming/news/${relatedArticle.id}`}
                    className="group block bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={relatedArticle.thumbnail}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {relatedArticle.title}
                      </h4>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{formatDate(relatedArticle.publishedAt)}</span>
                        <span>•</span>
                        <span>{relatedArticle.readTime} min read</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}
