'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import {
  FiShoppingCart,
  FiChevronLeft,
  FiStar,
  FiHeart,
  FiPackage,
  FiGift,
  FiZap,
  FiSettings,
  FiAward,
  FiCheck,
  FiX
} from 'react-icons/fi'
import { motion } from 'framer-motion'

interface StoreItem {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  currency: 'coins' | 'premium'
  category: 'cosmetic' | 'boost' | 'subscription' | 'bundle'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  image: string
  isPopular?: boolean
  isNew?: boolean
  isLimited?: boolean
  owned?: boolean
  discount?: number
  tags: string[]
  benefits?: string[]
}

const mockStoreItems: StoreItem[] = [
  {
    id: 'item-1',
    name: 'Golden Avatar Frame',
    description: 'Show off your status with this exclusive golden frame around your avatar',
    price: 500,
    currency: 'coins',
    category: 'cosmetic',
    rarity: 'epic',
    image: 'https://picsum.photos/seed/golden-frame/200/200',
    isPopular: true,
    isLimited: true,
    tags: ['avatar', 'exclusive', 'limited'],
    benefits: ['Exclusive golden border', 'Shows prestige', 'Limited availability']
  },
  {
    id: 'item-2',
    name: 'XP Boost (24h)',
    description: 'Double XP earned from all games for 24 hours',
    price: 200,
    currency: 'coins',
    category: 'boost',
    rarity: 'rare',
    image: 'https://picsum.photos/seed/xp-boost/200/200',
    isNew: true,
    tags: ['boost', 'xp', 'temporary'],
    benefits: ['2x XP for 24 hours', 'All games included', 'Instant activation']
  },
  {
    id: 'item-3',
    name: 'Champion Title Pack',
    description: 'Unlock 5 exclusive champion titles for your profile',
    price: 750,
    currency: 'coins',
    category: 'cosmetic',
    rarity: 'legendary',
    image: 'https://picsum.photos/seed/title-pack/200/200',
    tags: ['titles', 'profile', 'champion'],
    benefits: ['5 unique titles', 'Champion-themed', 'Profile customization']
  },
  {
    id: 'item-4',
    name: 'Premium Subscription (Monthly)',
    description: 'Unlock premium features and exclusive content',
    price: 999,
    currency: 'premium',
    category: 'subscription',
    rarity: 'legendary',
    image: 'https://picsum.photos/seed/premium/200/200',
    isPopular: true,
    tags: ['premium', 'subscription', 'monthly'],
    benefits: ['Ad-free experience', 'Early access to new games', 'Exclusive tournaments', 'Premium support']
  },
  {
    id: 'item-5',
    name: 'Cosmetic Bundle',
    description: 'Complete set of avatar frames, titles, and profile themes',
    price: 1500,
    originalPrice: 2000,
    currency: 'coins',
    category: 'bundle',
    rarity: 'epic',
    image: 'https://picsum.photos/seed/bundle/200/200',
    discount: 25,
    tags: ['bundle', 'cosmetic', 'complete'],
    benefits: ['10 avatar frames', '15 profile titles', '5 theme packs', '25% savings']
  },
  {
    id: 'item-6',
    name: 'Speed Boost Potion',
    description: 'Temporarily increase game speed by 50% for 1 hour',
    price: 150,
    currency: 'coins',
    category: 'boost',
    rarity: 'common',
    image: 'https://picsum.photos/seed/speed-potion/200/200',
    tags: ['boost', 'speed', 'temporary'],
    benefits: ['50% speed increase', '1 hour duration', 'All games compatible']
  },
  {
    id: 'item-7',
    name: 'Legendary Emote Pack',
    description: '12 exclusive emotes for use in games and chat',
    price: 1200,
    currency: 'coins',
    category: 'cosmetic',
    rarity: 'legendary',
    image: 'https://picsum.photos/seed/emotes/200/200',
    isLimited: true,
    tags: ['emotes', 'chat', 'legendary'],
    benefits: ['12 unique emotes', 'Chat integration', 'Game reactions']
  },
  {
    id: 'item-8',
    name: 'Tournament Pass',
    description: 'Entry pass for all premium tournaments this month',
    price: 800,
    currency: 'coins',
    category: 'boost',
    rarity: 'epic',
    image: 'https://picsum.photos/seed/tournament-pass/200/200',
    tags: ['tournament', 'access', 'monthly'],
    benefits: ['All premium tournaments', 'Monthly access', 'Priority matchmaking']
  }
]

export default function GamingStorePage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [cart, setCart] = useState<string[]>([])

  const categories = [
    { id: 'all', label: 'All Items', icon: FiPackage },
    { id: 'cosmetic', label: 'Cosmetic', icon: FiSettings },
    { id: 'boost', label: 'Boosts', icon: FiZap },
    { id: 'subscription', label: 'Subscriptions', icon: FiAward },
    { id: 'bundle', label: 'Bundles', icon: FiGift }
  ]

  const rarities = [
    { id: 'all', label: 'All Rarities' },
    { id: 'common', label: 'Common', color: 'text-gray-400' },
    { id: 'rare', label: 'Rare', color: 'text-blue-400' },
    { id: 'epic', label: 'Epic', color: 'text-purple-400' },
    { id: 'legendary', label: 'Legendary', color: 'text-yellow-400' }
  ]

  const filteredItems = mockStoreItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
    const rarityMatch = selectedRarity === 'all' || item.rarity === selectedRarity
    return categoryMatch && rarityMatch
  })

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-500 bg-gray-500/10',
      rare: 'border-blue-500 bg-blue-500/10',
      epic: 'border-purple-500 bg-purple-500/10',
      legendary: 'border-yellow-500 bg-yellow-500/10'
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      cosmetic: FiSettings,
      boost: FiZap,
      subscription: FiAward,
      bundle: FiGift
    }
    return icons[category as keyof typeof icons] || FiPackage
  }

  const addToCart = (itemId: string) => {
    if (!cart.includes(itemId)) {
      setCart([...cart, itemId])
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(id => id !== itemId))
  }

  const cartTotal = cart.reduce((total, itemId) => {
    const item = mockStoreItems.find(i => i.id === itemId)
    return total + (item?.price || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-900/20 via-yellow-900/20 to-orange-900/20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiShoppingCart className="w-12 h-12 text-yellow-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  StreamVault Store
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Customize your experience with exclusive items, boosts, and premium features
              </p>

              <div className="flex justify-center gap-8 text-gray-400 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{mockStoreItems.length}</div>
                  <div className="text-sm">Items Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {mockStoreItems.filter(item => item.isLimited).length}
                  </div>
                  <div className="text-sm">Limited Items</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {mockStoreItems.filter(item => item.discount).length}
                  </div>
                  <div className="text-sm">On Sale</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/gaming"
                  className="inline-flex items-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <FiChevronLeft className="w-5 h-5 mr-2" />
                  Back to Gaming
                </Link>
                {cart.length > 0 && (
                  <button className="inline-flex items-center px-8 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-colors">
                    <FiShoppingCart className="w-5 h-5 mr-2" />
                    Cart ({cart.length}) - {cartTotal} coins
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex bg-dark-100 rounded-lg p-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>

            <div className="flex bg-dark-100 rounded-lg p-1">
              {rarities.map((rarity) => (
                <button
                  key={rarity.id}
                  onClick={() => setSelectedRarity(rarity.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedRarity === rarity.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  {rarity.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Items */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Items</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStoreItems.filter(item => item.isPopular || item.isNew || item.isLimited).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-dark-100 rounded-lg border-2 p-6 transition-all hover:scale-105 ${
                    item.owned ? 'border-green-500 bg-green-900/10' : getRarityColor(item.rarity)
                  }`}
                >
                  <div className="relative mb-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {item.isPopular && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">POPULAR</span>
                      )}
                      {item.isNew && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">NEW</span>
                      )}
                      {item.isLimited && (
                        <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">LIMITED</span>
                      )}
                    </div>
                    {item.discount && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        -{item.discount}%
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(item.category)({ className: "w-4 h-4 text-gray-400" })}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{item.description}</p>

                  {item.benefits && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Benefits:</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {item.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center gap-1">
                            <FiCheck className="w-3 h-3 text-green-400" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {item.originalPrice && (
                        <span className="text-gray-500 line-through text-sm">
                          {item.originalPrice} {item.currency}
                        </span>
                      )}
                      <span className="text-yellow-400 font-bold text-lg">
                        {item.price} {item.currency}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded capitalize ${
                      item.rarity === 'common' ? 'bg-gray-600' :
                      item.rarity === 'rare' ? 'bg-blue-600' :
                      item.rarity === 'epic' ? 'bg-purple-600' :
                      'bg-yellow-600'
                    }`}>
                      {item.rarity}
                    </span>
                  </div>

                  {item.owned ? (
                    <div className="text-center py-2">
                      <span className="text-green-400 font-semibold">Owned</span>
                    </div>
                  ) : cart.includes(item.id) ? (
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FiX className="w-4 h-4" />
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Items */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">All Items</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-dark-100 rounded-lg border-2 p-4 transition-all hover:scale-105 ${
                    item.owned ? 'border-green-500 bg-green-900/10' : getRarityColor(item.rarity)
                  }`}
                >
                  <div className="relative mb-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={150}
                      height={150}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    {item.discount && (
                      <div className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 py-0.5 rounded">
                        -{item.discount}%
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-yellow-400 font-bold">
                      {item.price} {item.currency}
                    </span>
                    <span className={`text-xs px-1 py-0.5 rounded capitalize ${
                      item.rarity === 'common' ? 'bg-gray-600' :
                      item.rarity === 'rare' ? 'bg-blue-600' :
                      item.rarity === 'epic' ? 'bg-purple-600' :
                      'bg-yellow-600'
                    }`}>
                      {item.rarity}
                    </span>
                  </div>

                  {item.owned ? (
                    <div className="text-center py-1">
                      <span className="text-green-400 text-xs font-semibold">Owned</span>
                    </div>
                  ) : cart.includes(item.id) ? (
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1 px-2 rounded transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-1 px-2 rounded transition-colors"
                    >
                      Add to Cart
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <FiShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No items found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="fixed bottom-4 right-4 bg-dark-100 border border-dark-200 rounded-lg p-4 shadow-lg">
              <h3 className="text-white font-semibold mb-2">Cart Summary</h3>
              <div className="text-sm text-gray-400 mb-3">
                {cart.length} item{cart.length > 1 ? 's' : ''} • {cartTotal} coins
              </div>
              <div className="flex gap-2">
                <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded transition-colors">
                  Checkout
                </button>
                <button
                  onClick={() => setCart([])}
                  className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}