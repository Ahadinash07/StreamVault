'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  FiPlay,
  FiUsers,
  FiStar,
  FiClock,
  FiTarget,
  FiHeart,
  FiShare,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
  FiTrendingUp,
  FiMessageCircle,
  FiThumbsUp,
  FiUser,
  FiCalendar,
  FiZap
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { addNotification } from '@/app/features/notifications/notificationsSlice'

interface Game {
  id: string
  title: string
  description: string
  genre: string
  rating: number
  players: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  image: string
  trailer: string
  featured: boolean
  new: boolean
  tags: string[]
  longDescription?: string
  developer?: string
  releaseDate?: string
  screenshots?: string[]
  reviews?: Review[]
  achievements?: Achievement[]
}

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
  helpful: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
}

const mockGames: Game[] = [
  {
    id: 'game-1',
    title: 'Stream Quest',
    description: 'An epic adventure game designed for streamers and viewers to play together',
    longDescription: 'Embark on an epic adventure through the streaming multiverse! Stream Quest combines the excitement of classic RPGs with modern streaming culture. Battle through levels inspired by popular shows, collect streaming-themed power-ups, and compete with friends in real-time multiplayer action. Features unique character classes based on streaming personalities and special events tied to real-world streaming milestones.',
    genre: 'Adventure',
    rating: 9.2,
    players: '1-4 Players',
    duration: '30-60 min',
    difficulty: 'Medium',
    developer: 'StreamVault Studios',
    releaseDate: '2024-12-01',
    image: 'https://picsum.photos/seed/game1/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    featured: true,
    new: true,
    tags: ['Multiplayer', 'Adventure', 'Co-op'],
    screenshots: [
      'https://picsum.photos/seed/game1-ss1/800/450',
      'https://picsum.photos/seed/game1-ss2/800/450',
      'https://picsum.photos/seed/game1-ss3/800/450',
      'https://picsum.photos/seed/game1-ss4/800/450'
    ],
    reviews: [
      {
        id: 'rev-1',
        userId: 'user-1',
        userName: 'StreamMaster2024',
        userAvatar: 'https://picsum.photos/seed/user1/40/40',
        rating: 10,
        comment: 'Absolutely incredible! The co-op mechanics are flawless and the streaming references are hilarious.',
        date: '2024-12-15',
        helpful: 24
      },
      {
        id: 'rev-2',
        userId: 'user-2',
        userName: 'GameReviewer',
        userAvatar: 'https://picsum.photos/seed/user2/40/40',
        rating: 9,
        comment: 'Great game with unique mechanics. The multiplayer sync is impressive.',
        date: '2024-12-10',
        helpful: 18
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'First Stream',
        description: 'Complete your first gaming session',
        icon: '🎮',
        unlocked: true,
        rarity: 'Common'
      },
      {
        id: 'ach-2',
        title: 'Social Butterfly',
        description: 'Play with 10 different friends',
        icon: '👥',
        unlocked: false,
        rarity: 'Rare'
      },
      {
        id: 'ach-3',
        title: 'Streaming Legend',
        description: 'Reach level 50 in Stream Quest',
        icon: '⭐',
        unlocked: false,
        rarity: 'Epic'
      }
    ]
  },
  {
    id: 'game-2',
    title: 'Movie Trivia Master',
    description: 'Test your movie knowledge with friends in this interactive trivia game',
    longDescription: 'Challenge your cinematic knowledge in this ultimate movie trivia experience! Featuring questions from classic films to modern blockbusters, Movie Trivia Master tests your knowledge across genres, directors, actors, and plot details. Play solo for personal improvement or compete with friends in heated multiplayer battles. Unlock special categories and earn achievements as you become a true movie expert.',
    genre: 'Trivia',
    rating: 8.8,
    players: '2-8 Players',
    duration: '15-30 min',
    difficulty: 'Easy',
    developer: 'CineMasters',
    releaseDate: '2024-10-15',
    image: 'https://picsum.photos/seed/game2/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    featured: true,
    new: false,
    tags: ['Trivia', 'Educational', 'Party'],
    screenshots: [
      'https://picsum.photos/seed/game2-ss1/800/450',
      'https://picsum.photos/seed/game2-ss2/800/450',
      'https://picsum.photos/seed/game2-ss3/800/450'
    ],
    reviews: [
      {
        id: 'rev-3',
        userId: 'user-3',
        userName: 'MovieBuff',
        userAvatar: 'https://picsum.photos/seed/user3/40/40',
        rating: 9,
        comment: 'Perfect for movie nights! The questions are well-researched and challenging.',
        date: '2024-11-20',
        helpful: 15
      }
    ],
    achievements: [
      {
        id: 'ach-4',
        title: 'Trivia Novice',
        description: 'Answer 50 questions correctly',
        icon: '🧠',
        unlocked: true,
        rarity: 'Common'
      },
      {
        id: 'ach-5',
        title: 'Cinephile',
        description: 'Complete all movie genres',
        icon: '🎬',
        unlocked: false,
        rarity: 'Rare'
      }
    ]
  },
  {
    id: 'game-3',
    title: 'Director\'s Cut',
    description: 'Create your own movie scenes and compete with other aspiring directors',
    longDescription: 'Step into the director\'s chair and create cinematic masterpieces! Director\'s Cut gives you the tools to craft compelling movie scenes, from dialogue writing to scene composition. Compete with other players in creative challenges, vote on the best scenes, and build your reputation as a virtual filmmaker. Features advanced editing tools, special effects, and collaboration modes for group projects.',
    genre: 'Creative',
    rating: 9.0,
    players: '1-6 Players',
    duration: '45-90 min',
    difficulty: 'Hard',
    developer: 'FilmForge',
    releaseDate: '2024-11-20',
    image: 'https://picsum.photos/seed/game3/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    featured: false,
    new: true,
    tags: ['Creative', 'Strategy', 'Educational'],
    screenshots: [
      'https://picsum.photos/seed/game3-ss1/800/450',
      'https://picsum.photos/seed/game3-ss2/800/450',
      'https://picsum.photos/seed/game3-ss3/800/450',
      'https://picsum.photos/seed/game3-ss4/800/450',
      'https://picsum.photos/seed/game3-ss5/800/450'
    ],
    reviews: [
      {
        id: 'rev-4',
        userId: 'user-4',
        userName: 'AspiringDirector',
        userAvatar: 'https://picsum.photos/seed/user4/40/40',
        rating: 10,
        comment: 'This game captures the essence of filmmaking perfectly. Highly recommended!',
        date: '2024-12-01',
        helpful: 32
      }
    ],
    achievements: [
      {
        id: 'ach-6',
        title: 'Scene Creator',
        description: 'Create your first movie scene',
        icon: '🎭',
        unlocked: true,
        rarity: 'Common'
      },
      {
        id: 'ach-7',
        title: 'Critic\'s Choice',
        description: 'Win 10 scene competitions',
        icon: '🏆',
        unlocked: false,
        rarity: 'Epic'
      }
    ]
  },
  {
    id: 'game-4',
    title: 'Binge Watch Challenge',
    description: 'Race against time to identify movie scenes and quotes',
    longDescription: 'Test your binge-watching skills in this fast-paced identification game! Race against the clock to identify movie scenes, quotes, soundtracks, and character voices. Features multiple difficulty levels, special power-ups, and multiplayer modes where you compete with friends. Perfect for movie enthusiasts who pride themselves on their encyclopedic knowledge of cinema.',
    genre: 'Puzzle',
    rating: 8.5,
    players: '1-4 Players',
    duration: '20-40 min',
    difficulty: 'Medium',
    developer: 'BingeGames',
    releaseDate: '2024-09-10',
    image: 'https://picsum.photos/seed/game4/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    featured: false,
    new: false,
    tags: ['Puzzle', 'Quick Play', 'Competitive'],
    screenshots: [
      'https://picsum.photos/seed/game4-ss1/800/450',
      'https://picsum.photos/seed/game4-ss2/800/450'
    ],
    reviews: [
      {
        id: 'rev-5',
        userId: 'user-5',
        userName: 'QuickDraw',
        userAvatar: 'https://picsum.photos/seed/user5/40/40',
        rating: 8,
        comment: 'Fast-paced and fun! Great for quick gaming sessions.',
        date: '2024-10-05',
        helpful: 12
      }
    ],
    achievements: [
      {
        id: 'ach-8',
        title: 'Speed Demon',
        description: 'Complete a round in under 30 seconds',
        icon: '⚡',
        unlocked: false,
        rarity: 'Rare'
      }
    ]
  },
  {
    id: 'game-5',
    title: 'Cinematic Puzzles',
    description: 'Solve intricate puzzles inspired by famous movie plots and scenes',
    longDescription: 'Dive into mind-bending puzzles inspired by cinematic masterpieces! Each level draws from famous movie plots, requiring you to think like a director and screenwriter. Connect plot points, solve mysteries, and uncover hidden narratives. Features beautiful artwork inspired by classic cinema and challenging logic puzzles that will test your movie knowledge and problem-solving skills.',
    genre: 'Puzzle',
    rating: 8.9,
    players: '1-2 Players',
    duration: '25-45 min',
    difficulty: 'Medium',
    developer: 'PuzzleCinema',
    releaseDate: '2024-08-25',
    image: 'https://picsum.photos/seed/game5/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    featured: true,
    new: false,
    tags: ['Puzzle', 'Brain Teaser', 'Movie-themed'],
    screenshots: [
      'https://picsum.photos/seed/game5-ss1/800/450',
      'https://picsum.photos/seed/game5-ss2/800/450',
      'https://picsum.photos/seed/game5-ss3/800/450'
    ],
    achievements: [
      {
        id: 'ach-9',
        title: 'Plot Master',
        description: 'Solve 100 cinematic puzzles',
        icon: '🧩',
        unlocked: false,
        rarity: 'Epic'
      }
    ]
  },
  {
    id: 'game-6',
    title: 'Streaming Legends',
    description: 'Build your streaming empire and compete with other content creators',
    longDescription: 'Build and manage your own streaming empire in this strategic business simulation! Start as a small streamer and grow into a legendary content creator. Manage your schedule, build your audience, compete with other streamers, and make strategic decisions that affect your success. Features realistic streaming mechanics, market trends, and competitive multiplayer modes.',
    genre: 'Strategy',
    rating: 9.1,
    players: '1-8 Players',
    duration: '60-120 min',
    difficulty: 'Hard',
    developer: 'StreamSim',
    releaseDate: '2024-12-10',
    image: 'https://picsum.photos/seed/game6/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    featured: false,
    new: true,
    tags: ['Strategy', 'Business', 'Multiplayer'],
    screenshots: [
      'https://picsum.photos/seed/game6-ss1/800/450',
      'https://picsum.photos/seed/game6-ss2/800/450',
      'https://picsum.photos/seed/game6-ss3/800/450'
    ],
    achievements: [
      {
        id: 'ach-10',
        title: 'Rising Star',
        description: 'Reach 10,000 followers',
        icon: '🌟',
        unlocked: false,
        rarity: 'Rare'
      },
      {
        id: 'ach-11',
        title: 'Streaming Mogul',
        description: 'Build a streaming empire worth $1M',
        icon: '💰',
        unlocked: false,
        rarity: 'Legendary'
      }
    ]
  },
  {
    id: 'game-7',
    title: 'Genre Blender',
    description: 'Mix and match movie genres to create hilarious and unexpected combinations',
    longDescription: 'Unleash your creativity in this hilarious card game where you mix movie genres! Combine horror with romance, comedy with action, and sci-fi with musicals to create absurd and entertaining movie concepts. Play cards, vote on the funniest combinations, and compete to be crowned the Genre Blender champion. Perfect for creative minds and movie lovers with a sense of humor.',
    genre: 'Card Game',
    rating: 8.7,
    players: '3-6 Players',
    duration: '20-35 min',
    difficulty: 'Easy',
    developer: 'GenreGames',
    releaseDate: '2024-07-15',
    image: 'https://picsum.photos/seed/game7/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    featured: false,
    new: false,
    tags: ['Card Game', 'Party', 'Creative'],
    achievements: [
      {
        id: 'ach-12',
        title: 'Genre Guru',
        description: 'Create 50 unique genre combinations',
        icon: '🎭',
        unlocked: false,
        rarity: 'Rare'
      }
    ]
  },
  {
    id: 'game-8',
    title: 'Plot Twister',
    description: 'Rewrite famous movie plots with unexpected twists and endings',
    longDescription: 'Become a master of plot twists in this creative writing game! Take famous movie plots and rewrite them with unexpected twists, alternate endings, and creative interpretations. Compete with other players, vote on the best twists, and build your reputation as a plot innovation expert. Features collaborative writing modes and solo creative challenges.',
    genre: 'Creative',
    rating: 9.3,
    players: '2-4 Players',
    duration: '40-70 min',
    difficulty: 'Medium',
    developer: 'TwistGames',
    releaseDate: '2024-11-30',
    image: 'https://picsum.photos/seed/game8/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    featured: true,
    new: true,
    tags: ['Creative', 'Writing', 'Co-op'],
    screenshots: [
      'https://picsum.photos/seed/game8-ss1/800/450',
      'https://picsum.photos/seed/game8-ss2/800/450'
    ],
    achievements: [
      {
        id: 'ach-13',
        title: 'Twist Master',
        description: 'Create 25 plot twists',
        icon: '🔄',
        unlocked: false,
        rarity: 'Epic'
      }
    ]
  },
  {
    id: 'game-9',
    title: 'Oscar Night',
    description: 'Host your own virtual Oscars and vote on the best movie moments',
    longDescription: 'Host your own virtual Academy Awards ceremony! Create categories, nominate movies and performances, and vote on the winners. Features customizable award shows, special guest appearances (virtual celebrities), and the ability to create memorable acceptance speeches. Perfect for movie lovers who want to celebrate cinema in style.',
    genre: 'Party',
    rating: 8.4,
    players: '4-12 Players',
    duration: '45-90 min',
    difficulty: 'Easy',
    developer: 'OscarGames',
    releaseDate: '2024-02-20',
    image: 'https://picsum.photos/seed/game9/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    featured: false,
    new: false,
    tags: ['Party', 'Voting', 'Celebration'],
    achievements: [
      {
        id: 'ach-14',
        title: 'Award Winner',
        description: 'Win your first Oscar',
        icon: '🏆',
        unlocked: false,
        rarity: 'Common'
      }
    ]
  },
  {
    id: 'game-10',
    title: 'Script Doctor',
    description: 'Diagnose and fix plot holes in famous movie scripts',
    longDescription: 'Put on your script doctor hat and fix plot holes in famous movies! Analyze classic films for inconsistencies, logical errors, and missed opportunities. Propose creative solutions and compete with other players to find the best fixes. Features detailed script analysis tools and collaborative editing modes.',
    genre: 'Puzzle',
    rating: 8.6,
    players: '1-4 Players',
    duration: '30-50 min',
    difficulty: 'Medium',
    developer: 'ScriptFix',
    releaseDate: '2024-06-10',
    image: 'https://picsum.photos/seed/game10/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    featured: false,
    new: false,
    tags: ['Puzzle', 'Educational', 'Analysis'],
    achievements: [
      {
        id: 'ach-15',
        title: 'Script Surgeon',
        description: 'Fix 50 plot holes',
        icon: '🔧',
        unlocked: false,
        rarity: 'Rare'
      }
    ]
  },
  {
    id: 'game-11',
    title: 'Stream Wars',
    description: 'Epic battles between streaming platforms in a sci-fi universe',
    longDescription: 'Command streaming platforms in an epic sci-fi battle for digital dominance! Build your platform empire, launch exclusive content, compete for subscribers, and engage in strategic warfare. Features real-time multiplayer battles, economic simulation, and satirical takes on the streaming industry. Will your platform become the ultimate streaming champion?',
    genre: 'Strategy',
    rating: 9.4,
    players: '2-6 Players',
    duration: '90-150 min',
    difficulty: 'Hard',
    developer: 'StreamWars',
    releaseDate: '2024-12-20',
    image: 'https://picsum.photos/seed/game11/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    featured: true,
    new: true,
    tags: ['Strategy', 'Sci-Fi', 'Competitive'],
    screenshots: [
      'https://picsum.photos/seed/game11-ss1/800/450',
      'https://picsum.photos/seed/game11-ss2/800/450',
      'https://picsum.photos/seed/game11-ss3/800/450'
    ],
    achievements: [
      {
        id: 'ach-16',
        title: 'Platform Conqueror',
        description: 'Defeat 10 rival platforms',
        icon: '⚔️',
        unlocked: false,
        rarity: 'Legendary'
      }
    ]
  },
  {
    id: 'game-12',
    title: 'Memory Reel',
    description: 'Test your memory with movie scenes, quotes, and character names',
    longDescription: 'Challenge your memory with this cinematic memory game! Match movie scenes, remember character names, and recall famous quotes. Features multiple difficulty levels, special memory challenges, and competitive multiplayer modes. Perfect for movie buffs who want to test and improve their cinematic recall abilities.',
    genre: 'Memory',
    rating: 8.3,
    players: '2-8 Players',
    duration: '15-25 min',
    difficulty: 'Easy',
    developer: 'MemoryGames',
    releaseDate: '2024-04-05',
    image: 'https://picsum.photos/seed/game12/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    featured: false,
    new: false,
    tags: ['Memory', 'Quick Play', 'Educational'],
    achievements: [
      {
        id: 'ach-17',
        title: 'Memory Master',
        description: 'Complete all memory challenges',
        icon: '🧠',
        unlocked: false,
        rarity: 'Epic'
      }
    ]
  }
]

export default function GameDetailPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.id as string
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  const [game, setGame] = useState<Game | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'achievements' | 'screenshots'>('overview')
  const [currentScreenshot, setCurrentScreenshot] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const foundGame = mockGames.find(g => g.id === gameId)
    if (foundGame) {
      setGame(foundGame)
    } else {
      router.push('/gaming')
    }
  }, [gameId, router])

  const handlePlayGame = () => {
    if (!isAuthenticated) {
      dispatch(addNotification({
        id: `login-required-${Date.now()}`,
        type: 'warning',
        title: 'Login Required',
        message: 'Please log in to play games',
        timestamp: new Date().toISOString(),
        isRead: false,
        actionUrl: '/login',
        actionText: 'Login'
      }))
      return
    }

    setIsPlaying(true)
    dispatch(addNotification({
      id: `game-started-${Date.now()}`,
      type: 'success',
      title: 'Game Started!',
      message: `Enjoy playing ${game?.title}`,
      timestamp: new Date().toISOString(),
      isRead: false
    }))
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    dispatch(addNotification({
      id: `game-favorited-${Date.now()}`,
      type: isFavorited ? 'info' : 'success',
      title: isFavorited ? 'Removed from Favorites' : 'Added to Favorites',
      message: `${game?.title} ${isFavorited ? 'removed from' : 'added to'} your favorites`,
      timestamp: new Date().toISOString(),
      isRead: false
    }))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'Hard': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400 bg-gray-400/20'
      case 'Rare': return 'text-blue-400 bg-blue-400/20'
      case 'Epic': return 'text-purple-400 bg-purple-400/20'
      case 'Legendary': return 'text-yellow-400 bg-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Game Not Found</h1>
              <p className="text-gray-400 mb-6">The game you're looking for doesn't exist.</p>
              <Link
                href="/gaming"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <FiChevronLeft className="w-4 h-4 mr-2" />
                Back to Gaming
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative h-[60vh] overflow-hidden">
          <Image
            src={game.image}
            alt={game.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-4 left-4 z-10">
            <Link
              href="/gaming"
              className="inline-flex items-center px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
            >
              <FiChevronLeft className="w-4 h-4 mr-2" />
              Back to Gaming
            </Link>
          </div>

          {/* Game Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {game.new && (
                      <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full">
                        NEW
                      </span>
                    )}
                    {game.featured && (
                      <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                        FEATURED
                      </span>
                    )}
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {game.title}
                  </h1>

                  <p className="text-xl text-gray-300 mb-4 max-w-2xl">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4" />
                      <span>{game.players}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      <span>{game.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiStar className="w-4 h-4 fill-current text-yellow-400" />
                      <span>{game.rating}/10</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" />
                      <span>{game.releaseDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleFavorite}
                    className={`p-3 rounded-lg transition-colors ${
                      isFavorited
                        ? 'bg-red-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-colors">
                    <FiShare className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handlePlayGame}
                    className="inline-flex items-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <FiPlay className="w-5 h-5 mr-2" />
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 mb-8 border-b border-dark-200 pb-4">
            {[
              { id: 'overview', label: 'Overview', icon: FiTarget },
              { id: 'screenshots', label: 'Screenshots', icon: FiPlay, count: game.screenshots?.length },
              { id: 'reviews', label: 'Reviews', icon: FiMessageCircle, count: game.reviews?.length },
              { id: 'achievements', label: 'Achievements', icon: FiAward, count: game.achievements?.length }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-100 text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-1 px-2 py-0.5 bg-dark-200 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Description */}
                <div className="bg-dark-100 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">About This Game</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {game.longDescription || game.description}
                  </p>
                </div>

                {/* Game Details */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-dark-100 rounded-lg p-6 text-center">
                    <FiUsers className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-white mb-1">Players</h3>
                    <p className="text-gray-400">{game.players}</p>
                  </div>
                  <div className="bg-dark-100 rounded-lg p-6 text-center">
                    <FiClock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-white mb-1">Duration</h3>
                    <p className="text-gray-400">{game.duration}</p>
                  </div>
                  <div className="bg-dark-100 rounded-lg p-6 text-center">
                    <FiTarget className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-white mb-1">Difficulty</h3>
                    <p className={`font-semibold ${getDifficultyColor(game.difficulty).split(' ')[0]}`}>
                      {game.difficulty}
                    </p>
                  </div>
                  <div className="bg-dark-100 rounded-lg p-6 text-center">
                    <FiStar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-white mb-1">Rating</h3>
                    <p className="text-yellow-400 font-semibold">{game.rating}/10</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-dark-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Developer Info */}
                {game.developer && (
                  <div className="bg-dark-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Developer</h3>
                    <p className="text-gray-300">{game.developer}</p>
                    {game.releaseDate && (
                      <p className="text-gray-400 text-sm mt-1">Released: {new Date(game.releaseDate).toLocaleDateString()}</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'screenshots' && game.screenshots && (
              <motion.div
                key="screenshots"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="relative">
                  <Image
                    src={game.screenshots[currentScreenshot]}
                    alt={`${game.title} screenshot ${currentScreenshot + 1}`}
                    width={800}
                    height={450}
                    className="w-full rounded-lg"
                  />
                  {game.screenshots && game.screenshots.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentScreenshot(Math.max(0, currentScreenshot - 1))}
                        disabled={currentScreenshot === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentScreenshot(Math.min((game.screenshots?.length || 1) - 1, currentScreenshot + 1))}
                        disabled={currentScreenshot === (game.screenshots?.length || 1) - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {game.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentScreenshot(index)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentScreenshot ? 'border-purple-400' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={screenshot}
                        alt={`${game.title} screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && game.reviews && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Player Reviews</h2>
                  <div className="flex items-center gap-2">
                    <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{game.rating}</span>
                    <span className="text-gray-400">({game.reviews.length} reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {game.reviews.map(review => (
                    <div key={review.id} className="bg-dark-100 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <Image
                          src={review.userAvatar}
                          alt={review.userName}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-white font-semibold">{review.userName}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(review.rating / 2)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-400 text-sm">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 mb-3">{review.comment}</p>
                          <button className="flex items-center gap-1 text-gray-400 hover:text-white text-sm">
                            <FiThumbsUp className="w-4 h-4" />
                            <span>Helpful ({review.helpful})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'achievements' && game.achievements && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white">Achievements</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {game.achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`bg-dark-100 rounded-lg p-6 border-2 transition-colors ${
                        achievement.unlocked
                          ? 'border-purple-400 bg-purple-400/10'
                          : 'border-gray-600 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-1 ${
                            achievement.unlocked ? 'text-white' : 'text-gray-400'
                          }`}>
                            {achievement.title}
                          </h3>
                          <p className={`text-sm mb-2 ${
                            achievement.unlocked ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {achievement.description}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game Modal */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
              onClick={() => setIsPlaying(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-dark-100 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-video bg-dark-200">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <FiPlay className="w-16 h-16 text-white mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                      <p className="text-gray-300">Game would load here in a real implementation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  >
                    <span className="text-xl font-bold">×</span>
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">{game.title}</h2>
                    <div className="flex items-center gap-2">
                      <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{game.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6">{game.description}</p>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        // Start/continue the game session
                        if (!isAuthenticated) {
                          dispatch(addNotification({
                            id: `login-required-${Date.now()}`,
                            type: 'warning',
                            title: 'Login Required',
                            message: 'Please log in to play games',
                            timestamp: new Date().toISOString(),
                            isRead: false,
                            actionUrl: '/login',
                            actionText: 'Login'
                          }))
                          setIsPlaying(false)
                          return
                        }

                        // Start the game session and keep modal open or transition to game
                        dispatch(addNotification({
                          id: `game-continued-${Date.now()}`,
                          type: 'success',
                          title: 'Game Started!',
                          message: `Continuing ${game?.title} - Game session active`,
                          timestamp: new Date().toISOString(),
                          isRead: false
                        }))

                        // In a real implementation, this would navigate to the game or start the game session
                        // For now, we'll keep the modal open to show the game interface
                        // setIsPlaying(false) // Remove this to keep modal open
                      }}
                      className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Continue Playing
                    </button>
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}