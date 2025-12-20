import { Reel } from '@/types/content'

const getReelThumbnail = (id: string) => `https://picsum.photos/seed/reel${id}/640/360`
const getReelVideo = (id: string) => {
  // Using sample video URLs - in production these would be your actual short video URLs
  const videos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    // Additional sample videos for more variety
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_2mb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_5mb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_10mb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_320x180_1mb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_320x180_2mb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_320x180_5mb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_320x180_10mb.mp4',
    // Fallback videos for higher IDs
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  ]
  return videos[parseInt(id) % videos.length]
}

export const mockReels: Reel[] = [
  {
    id: 'reel-1',
    title: 'The Dark Knight - Official Trailer',
    description: 'Watch the epic trailer for The Dark Knight featuring Heath Ledger as the Joker',
    thumbnail: getReelThumbnail('darkknight-trailer'),
    videoUrl: getReelVideo('1'),
    duration: 150, // 2:30 minutes
    views: 2500000,
    likes: 185000,
    shares: 45000,
    creator: 'Warner Bros. Pictures',
    tags: ['trailer', 'action', 'superhero', 'batman', 'joker'],
    type: 'trailer',
    relatedContent: {
      type: 'movie',
      id: '1',
      title: 'The Dark Knight'
    },
    uploadDate: '2024-12-15',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-2',
    title: 'Behind the Scenes: Inception Dreams',
    description: 'Exclusive look at how the dream sequences were created for Inception',
    thumbnail: getReelThumbnail('inception-bts'),
    videoUrl: getReelVideo('2'),
    duration: 180, // 3:00 minutes
    views: 1200000,
    likes: 95000,
    shares: 28000,
    creator: 'Christopher Nolan',
    tags: ['behind-scenes', 'making-of', 'dreams', 'special-effects', 'nolan'],
    type: 'behind-scenes',
    relatedContent: {
      type: 'movie',
      id: '2',
      title: 'Inception'
    },
    uploadDate: '2024-12-18',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-3',
    title: 'Interstellar - Emotional Scene',
    description: 'The most emotional moment from Interstellar that will make you cry',
    thumbnail: getReelThumbnail('interstellar-clip'),
    videoUrl: getReelVideo('3'),
    duration: 45, // 45 seconds
    views: 3500000,
    likes: 420000,
    shares: 125000,
    creator: 'StreamVault Originals',
    tags: ['emotional', 'space', 'family', 'tear-jerker', 'viral'],
    type: 'clip',
    relatedContent: {
      type: 'movie',
      id: '3',
      title: 'Interstellar'
    },
    uploadDate: '2024-12-20',
    isTrending: true,
    isOriginal: true
  },
  {
    id: 'reel-4',
    title: 'The Matrix - Iconic Fight Scene',
    description: 'Neo vs Agent Smith - The fight that changed cinema forever',
    thumbnail: getReelThumbnail('matrix-fight'),
    videoUrl: getReelVideo('4'),
    duration: 120, // 2:00 minutes
    views: 1800000,
    likes: 165000,
    shares: 52000,
    creator: 'Warner Bros. Classics',
    tags: ['action', 'fight-scene', 'neo', 'smith', 'bullet-time'],
    type: 'clip',
    relatedContent: {
      type: 'movie',
      id: '4',
      title: 'The Matrix'
    },
    uploadDate: '2024-12-10',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-5',
    title: 'Stranger Things Season 5 - Teaser',
    description: 'First look at what\'s coming in the final season',
    thumbnail: getReelThumbnail('stranger-teaser'),
    videoUrl: getReelVideo('5'),
    duration: 90, // 1:30 minutes
    views: 5000000,
    likes: 680000,
    shares: 250000,
    creator: 'Netflix',
    tags: ['teaser', 'upcoming', 'final-season', 'horror', 'supernatural'],
    type: 'teaser',
    relatedContent: {
      type: 'series',
      id: '1',
      title: 'Stranger Things'
    },
    uploadDate: '2024-12-19',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-6',
    title: 'Christopher Nolan Interview - Oppenheimer',
    description: 'Director talks about the making of Oppenheimer and nuclear physics',
    thumbnail: getReelThumbnail('nolan-interview'),
    videoUrl: getReelVideo('6'),
    duration: 240, // 4:00 minutes
    views: 800000,
    likes: 75000,
    shares: 18000,
    creator: 'Variety',
    tags: ['interview', 'director', 'nolan', 'oppenheimer', 'nuclear'],
    type: 'interview',
    uploadDate: '2024-12-16',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-7',
    title: 'Guardians of the Galaxy Vol. 3 - Official Trailer',
    description: 'The Guardians face their most dangerous mission yet',
    thumbnail: getReelThumbnail('guardians-trailer'),
    videoUrl: getReelVideo('7'),
    duration: 165, // 2:45 minutes
    views: 4200000,
    likes: 395000,
    shares: 98000,
    creator: 'Marvel Studios',
    tags: ['trailer', 'marvel', 'superhero', 'guardians', 'space'],
    type: 'trailer',
    uploadDate: '2024-12-17',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-8',
    title: 'Dune: Part Two - Behind the Scenes',
    description: 'Sandworms, spice, and epic battles: Making of Dune: Part Two',
    thumbnail: getReelThumbnail('dune-bts'),
    videoUrl: getReelVideo('8'),
    duration: 195, // 3:15 minutes
    views: 950000,
    likes: 88000,
    shares: 22000,
    creator: 'Legendary Pictures',
    tags: ['behind-scenes', 'sandworms', 'spice', 'desert', 'villeneuve'],
    type: 'behind-scenes',
    uploadDate: '2024-12-14',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-9',
    title: 'The Batman - Official Soundtrack',
    description: 'Listen to the haunting score from The Batman',
    thumbnail: getReelThumbnail('batman-soundtrack'),
    videoUrl: getReelVideo('9'),
    duration: 210, // 3:30 minutes
    views: 650000,
    likes: 58000,
    shares: 15000,
    creator: 'Warner Bros. Music',
    tags: ['soundtrack', 'music', 'batman', 'gotham', 'score'],
    type: 'music-video',
    uploadDate: '2024-12-12',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-10',
    title: 'Avatar: The Way of Water - Underwater Scenes',
    description: 'Breathtaking underwater cinematography from James Cameron\'s masterpiece',
    thumbnail: getReelThumbnail('avatar-underwater'),
    videoUrl: getReelVideo('10'),
    duration: 75, // 1:15 minutes
    views: 2800000,
    likes: 245000,
    shares: 67000,
    creator: '20th Century Studios',
    tags: ['avatar', 'underwater', 'pandora', 'cameron', 'metkayina'],
    type: 'clip',
    uploadDate: '2024-12-13',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-11',
    title: 'Barbie Movie - Dance Scene',
    description: 'The viral dance scene that took over TikTok',
    thumbnail: getReelThumbnail('barbie-dance'),
    videoUrl: getReelVideo('11'),
    duration: 35, // 35 seconds
    views: 15000000,
    likes: 2100000,
    shares: 850000,
    creator: 'Warner Bros. Pictures',
    tags: ['dance', 'viral', 'barbie', 'gosling', 'tiktok'],
    type: 'clip',
    uploadDate: '2024-12-11',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-12',
    title: 'Oppenheimer - Trinity Test',
    description: 'The moment that changed the world - Trinity nuclear test',
    thumbnail: getReelThumbnail('oppenheimer-trinity'),
    videoUrl: getReelVideo('12'),
    duration: 60, // 1:00 minute
    views: 3200000,
    likes: 290000,
    shares: 78000,
    creator: 'Universal Pictures',
    tags: ['oppenheimer', 'nuclear', 'history', 'trinity', 'manhattan-project'],
    type: 'clip',
    uploadDate: '2024-12-08',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-13',
    title: 'John Wick: Chapter 4 - Action Montage',
    description: 'Non-stop action from the most intense John Wick yet',
    thumbnail: getReelThumbnail('johnwick-action'),
    videoUrl: getReelVideo('13'),
    duration: 85, // 1:25 minutes
    views: 2200000,
    likes: 195000,
    shares: 55000,
    creator: 'Lionsgate',
    tags: ['action', 'john-wick', 'fight', 'gun-fu', 'keanu'],
    type: 'clip',
    uploadDate: '2024-12-09',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-14',
    title: 'Succession - Final Season Teaser',
    description: 'The Roy family\'s final battle begins',
    thumbnail: getReelThumbnail('succession-teaser'),
    videoUrl: getReelVideo('14'),
    duration: 120, // 2:00 minutes
    views: 3800000,
    likes: 425000,
    shares: 120000,
    creator: 'HBO',
    tags: ['teaser', 'succession', 'roy-family', 'drama', 'final-season'],
    type: 'teaser',
    uploadDate: '2024-12-07',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-15',
    title: 'Taylor Swift - Eras Tour Film Interview',
    description: 'Taylor talks about bringing the Eras Tour to the big screen',
    thumbnail: getReelThumbnail('taylor-interview'),
    videoUrl: getReelVideo('15'),
    duration: 180, // 3:00 minutes
    views: 4500000,
    likes: 680000,
    shares: 195000,
    creator: 'AMC Theatres',
    tags: ['interview', 'taylor-swift', 'eras-tour', 'concert-film', 'music'],
    type: 'interview',
    uploadDate: '2024-12-06',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-16',
    title: 'Avatar: The Way of Water - Underwater Action',
    description: 'Stunning underwater sequences from James Cameron\'s Avatar sequel',
    thumbnail: getReelThumbnail('avatar-underwater'),
    videoUrl: getReelVideo('16'),
    duration: 120, // 2:00 minutes
    views: 3200000,
    likes: 285000,
    shares: 95000,
    creator: '20th Century Studios',
    tags: ['clip', 'action', 'sci-fi', 'avatar', 'james-cameron'],
    type: 'clip',
    relatedContent: {
      type: 'movie',
      id: '16',
      title: 'Avatar: The Way of Water'
    },
    uploadDate: '2024-12-05',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-17',
    title: 'The Last of Us - Behind the Scenes',
    description: 'How they recreated the post-apocalyptic world for the HBO series',
    thumbnail: getReelThumbnail('tlou-bts'),
    videoUrl: getReelVideo('17'),
    duration: 210, // 3:30 minutes
    views: 2800000,
    likes: 320000,
    shares: 120000,
    creator: 'HBO',
    tags: ['behind-scenes', 'production', 'post-apocalyptic', 'zombies', 'adaptation'],
    type: 'behind-scenes',
    relatedContent: {
      type: 'series',
      id: '17',
      title: 'The Last of Us'
    },
    uploadDate: '2024-12-04',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-18',
    title: 'Spider-Man: No Way Home - Multiverse Teaser',
    description: 'First look at the multiverse chaos in Spider-Man: No Way Home',
    thumbnail: getReelThumbnail('spiderman-multiverse'),
    videoUrl: getReelVideo('18'),
    duration: 85, // 1:25 minutes
    views: 4100000,
    likes: 520000,
    shares: 180000,
    creator: 'Sony Pictures',
    tags: ['teaser', 'superhero', 'multiverse', 'spiderman', 'marvel'],
    type: 'teaser',
    relatedContent: {
      type: 'movie',
      id: '18',
      title: 'Spider-Man: No Way Home'
    },
    uploadDate: '2024-12-03',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-19',
    title: 'Dune: Part Two - Official Trailer',
    description: 'The desert planet awakens in the epic conclusion to Denis Villeneuve\'s Dune',
    thumbnail: getReelThumbnail('dune-trailer'),
    videoUrl: getReelVideo('19'),
    duration: 165, // 2:45 minutes
    views: 5500000,
    likes: 480000,
    shares: 220000,
    creator: 'Warner Bros. Pictures',
    tags: ['trailer', 'sci-fi', 'epic', 'dune', 'villeneuve'],
    type: 'trailer',
    relatedContent: {
      type: 'movie',
      id: '19',
      title: 'Dune: Part Two'
    },
    uploadDate: '2024-12-02',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-20',
    title: 'Succession - Final Season BTS',
    description: 'The making of the explosive final season of HBO\'s Succession',
    thumbnail: getReelThumbnail('succession-bts'),
    videoUrl: getReelVideo('20'),
    duration: 195, // 3:15 minutes
    views: 1900000,
    likes: 165000,
    shares: 75000,
    creator: 'HBO',
    tags: ['behind-scenes', 'drama', 'final-season', 'succession', 'hbo'],
    type: 'behind-scenes',
    relatedContent: {
      type: 'series',
      id: '20',
      title: 'Succession'
    },
    uploadDate: '2024-12-01',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-21',
    title: 'John Wick: Chapter 4 - Fight Scene',
    description: 'Keanu Reeves showcases his legendary action skills in this intense clip',
    thumbnail: getReelThumbnail('johnwick-fight'),
    videoUrl: getReelVideo('21'),
    duration: 140, // 2:20 minutes
    views: 3600000,
    likes: 410000,
    shares: 135000,
    creator: 'Lionsgate',
    tags: ['clip', 'action', 'john-wick', 'keanu-reeves', 'fight-scene'],
    type: 'clip',
    relatedContent: {
      type: 'movie',
      id: '21',
      title: 'John Wick: Chapter 4'
    },
    uploadDate: '2024-11-30',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-22',
    title: 'The Bear - Season 2 Interview',
    description: 'Jeremy Allen White and Ayo Edebiri talk about the intense second season',
    thumbnail: getReelThumbnail('bear-interview'),
    videoUrl: getReelVideo('22'),
    duration: 225, // 3:45 minutes
    views: 2200000,
    likes: 195000,
    shares: 85000,
    creator: 'HBO',
    tags: ['interview', 'comedy', 'drama', 'the-bear', 'restaurant'],
    type: 'interview',
    relatedContent: {
      type: 'series',
      id: '22',
      title: 'The Bear'
    },
    uploadDate: '2024-11-29',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-23',
    title: 'Guardians of the Galaxy Vol. 3 - Rocket Raccoon',
    description: 'Heartbreaking moments with Rocket in the final Guardians movie',
    thumbnail: getReelThumbnail('guardians-rocket'),
    videoUrl: getReelVideo('23'),
    duration: 110, // 1:50 minutes
    views: 2900000,
    likes: 380000,
    shares: 125000,
    creator: 'Marvel Studios',
    tags: ['clip', 'emotional', 'guardians', 'rocket', 'marvel'],
    type: 'clip',
    relatedContent: {
      type: 'movie',
      id: '23',
      title: 'Guardians of the Galaxy Vol. 3'
    },
    uploadDate: '2024-11-28',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-24',
    title: 'Wednesday - Jenna Ortega Interview',
    description: 'The Wednesday star talks about playing the iconic character',
    thumbnail: getReelThumbnail('wednesday-interview'),
    videoUrl: getReelVideo('24'),
    duration: 200, // 3:20 minutes
    views: 3400000,
    likes: 420000,
    shares: 160000,
    creator: 'Netflix',
    tags: ['interview', 'wednesday', 'jenna-ortega', 'netflix', 'horror-comedy'],
    type: 'interview',
    relatedContent: {
      type: 'series',
      id: '24',
      title: 'Wednesday'
    },
    uploadDate: '2024-11-27',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-25',
    title: 'Barbie - Behind the Scenes Magic',
    description: 'How Greta Gerwig brought the Barbie world to life',
    thumbnail: getReelThumbnail('barbie-bts'),
    videoUrl: getReelVideo('25'),
    duration: 175, // 2:55 minutes
    views: 3800000,
    likes: 350000,
    shares: 140000,
    creator: 'Warner Bros. Pictures',
    tags: ['behind-scenes', 'barbie', 'greta-gerwig', 'production', 'fantasy'],
    type: 'behind-scenes',
    relatedContent: {
      type: 'movie',
      id: '25',
      title: 'Barbie'
    },
    uploadDate: '2024-11-26',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-26',
    title: 'Oppenheimer - Cillian Murphy Interview',
    description: 'The Oppenheimer star discusses his role as J. Robert Oppenheimer',
    thumbnail: getReelThumbnail('oppenheimer-interview'),
    videoUrl: getReelVideo('26'),
    duration: 190, // 3:10 minutes
    views: 2600000,
    likes: 210000,
    shares: 95000,
    creator: 'Universal Pictures',
    tags: ['interview', 'oppenheimer', 'cillian-murphy', 'historical', 'nolan'],
    type: 'interview',
    relatedContent: {
      type: 'movie',
      id: '26',
      title: 'Oppenheimer'
    },
    uploadDate: '2024-11-25',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-27',
    title: 'The Mandalorian - Season 3 Teaser',
    description: 'Din Djarin\'s journey continues in the outer reaches of the galaxy',
    thumbnail: getReelThumbnail('mandalorian-teaser'),
    videoUrl: getReelVideo('27'),
    duration: 95, // 1:35 minutes
    views: 4200000,
    likes: 580000,
    shares: 210000,
    creator: 'Disney+',
    tags: ['teaser', 'star-wars', 'mandalorian', 'disney', 'action'],
    type: 'teaser',
    relatedContent: {
      type: 'series',
      id: '27',
      title: 'The Mandalorian'
    },
    uploadDate: '2024-11-24',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-28',
    title: 'Top Gun: Maverick - Flight Scenes',
    description: 'Incredible aerial sequences from the Top Gun sequel',
    thumbnail: getReelThumbnail('topgun-flight'),
    videoUrl: getReelVideo('28'),
    duration: 130, // 2:10 minutes
    views: 3100000,
    likes: 290000,
    shares: 110000,
    creator: 'Paramount Pictures',
    tags: ['clip', 'action', 'top-gun', 'aviation', 'tom-cruise'],
    type: 'clip',
    relatedContent: {
      type: 'movie',
      id: '28',
      title: 'Top Gun: Maverick'
    },
    uploadDate: '2024-11-23',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-29',
    title: 'House of the Dragon - Season 2 BTS',
    description: 'Creating the dragons and epic battles for Game of Thrones prequel',
    thumbnail: getReelThumbnail('hotd-bts'),
    videoUrl: getReelVideo('29'),
    duration: 220, // 3:40 minutes
    views: 2400000,
    likes: 280000,
    shares: 105000,
    creator: 'HBO',
    tags: ['behind-scenes', 'fantasy', 'dragons', 'game-of-thrones', 'vfx'],
    type: 'behind-scenes',
    relatedContent: {
      type: 'series',
      id: '29',
      title: 'House of the Dragon'
    },
    uploadDate: '2024-11-22',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-30',
    title: 'Mission: Impossible - Dead Reckoning Trailer',
    description: 'Tom Cruise returns for another impossible mission',
    thumbnail: getReelThumbnail('mi7-trailer'),
    videoUrl: getReelVideo('30'),
    duration: 155, // 2:35 minutes
    views: 4800000,
    likes: 450000,
    shares: 190000,
    creator: 'Paramount Pictures',
    tags: ['trailer', 'action', 'spy', 'tom-cruise', 'thriller'],
    type: 'trailer',
    relatedContent: {
      type: 'movie',
      id: '30',
      title: 'Mission: Impossible - Dead Reckoning Part One'
    },
    uploadDate: '2024-11-21',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-31',
    title: 'StreamVault Original: Behind the Scenes',
    description: 'How we created our exclusive original content for you',
    thumbnail: getReelThumbnail('streamvault-original'),
    videoUrl: getReelVideo('31'),
    duration: 180, // 3:00 minutes
    views: 850000,
    likes: 95000,
    shares: 35000,
    creator: 'StreamVault',
    tags: ['original', 'behind-scenes', 'exclusive', 'production', 'streamvault'],
    type: 'behind-scenes',
    uploadDate: '2024-11-20',
    isTrending: false,
    isOriginal: true
  },
  {
    id: 'reel-32',
    title: 'The Witcher - Season 3 Teaser',
    description: 'Geralt, Ciri, and Yennefer face new threats in the Continent',
    thumbnail: getReelThumbnail('witcher-teaser'),
    videoUrl: getReelVideo('32'),
    duration: 105, // 1:45 minutes
    views: 3900000,
    likes: 510000,
    shares: 175000,
    creator: 'Netflix',
    tags: ['teaser', 'fantasy', 'witcher', 'netflix', 'action'],
    type: 'teaser',
    relatedContent: {
      type: 'series',
      id: '32',
      title: 'The Witcher'
    },
    uploadDate: '2024-11-19',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-33',
    title: 'Black Panther: Wakanda Forever - Emotional Clip',
    description: 'Powerful moments honoring Chadwick Boseman and introducing new heroes',
    thumbnail: getReelThumbnail('blackpanther-emotional'),
    videoUrl: getReelVideo('33'),
    duration: 145, // 2:25 minutes
    views: 3500000,
    likes: 480000,
    shares: 165000,
    creator: 'Marvel Studios',
    tags: ['clip', 'emotional', 'black-panther', 'marvel', 'wakanda'],
    type: 'clip',
    relatedContent: {
      type: 'movie',
      id: '33',
      title: 'Black Panther: Wakanda Forever'
    },
    uploadDate: '2024-11-18',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-34',
    title: 'Ted Lasso - Final Season Interview',
    description: 'Jason Sudeikis and the cast reflect on the beloved series',
    thumbnail: getReelThumbnail('tedlasso-interview'),
    videoUrl: getReelVideo('34'),
    duration: 235, // 3:55 minutes
    views: 2100000,
    likes: 320000,
    shares: 120000,
    creator: 'Apple TV+',
    tags: ['interview', 'comedy', 'ted-lasso', 'final-season', 'emotional'],
    type: 'interview',
    relatedContent: {
      type: 'series',
      id: '34',
      title: 'Ted Lasso'
    },
    uploadDate: '2024-11-17',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-35',
    title: 'Avatar: The Way of Water - Metkayina Clan',
    description: 'Discovering the mysterious Metkayina clan and their culture',
    thumbnail: getReelThumbnail('avatar-metkayina'),
    videoUrl: getReelVideo('35'),
    duration: 160, // 2:40 minutes
    views: 2700000,
    likes: 240000,
    shares: 90000,
    creator: '20th Century Studios',
    tags: ['clip', 'sci-fi', 'avatar', 'culture', 'pandora'],
    type: 'clip',
    relatedContent: {
      type: 'movie',
      id: '16',
      title: 'Avatar: The Way of Water'
    },
    uploadDate: '2024-11-16',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-36',
    title: 'The Last of Us - Pedro Pascal Interview',
    description: 'Pedro Pascal discusses playing Joel and the emotional journey',
    thumbnail: getReelThumbnail('tlou-pedro'),
    videoUrl: getReelVideo('36'),
    duration: 205, // 3:25 minutes
    views: 3000000,
    likes: 380000,
    shares: 140000,
    creator: 'HBO',
    tags: ['interview', 'pedro-pascal', 'the-last-of-us', 'emotional', 'adaptation'],
    type: 'interview',
    relatedContent: {
      type: 'series',
      id: '17',
      title: 'The Last of Us'
    },
    uploadDate: '2024-11-15',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-37',
    title: 'Dune - Denis Villeneuve Director\'s Cut',
    description: 'Extended scenes and deeper exploration of Arrakis',
    thumbnail: getReelThumbnail('dune-directors-cut'),
    videoUrl: getReelVideo('37'),
    duration: 185, // 3:05 minutes
    views: 2300000,
    likes: 195000,
    shares: 85000,
    creator: 'Warner Bros. Pictures',
    tags: ['clip', 'sci-fi', 'dune', 'directors-cut', 'extended'],
    type: 'clip',
    relatedContent: {
      type: 'movie',
      id: '37',
      title: 'Dune'
    },
    uploadDate: '2024-11-14',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-38',
    title: 'Succession - Brian Cox Interview',
    description: 'Logan Roy\'s actor reflects on the character and final season',
    thumbnail: getReelThumbnail('succession-brian'),
    videoUrl: getReelVideo('38'),
    duration: 215, // 3:35 minutes
    views: 1800000,
    likes: 160000,
    shares: 70000,
    creator: 'HBO',
    tags: ['interview', 'succession', 'brian-cox', 'logan-roy', 'finale'],
    type: 'interview',
    relatedContent: {
      type: 'series',
      id: '20',
      title: 'Succession'
    },
    uploadDate: '2024-11-13',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-39',
    title: 'John Wick 4 - Action Sequence Breakdown',
    description: 'How they choreographed the incredible Osaka fight scene',
    thumbnail: getReelThumbnail('johnwick-breakdown'),
    videoUrl: getReelVideo('39'),
    duration: 170, // 2:50 minutes
    views: 2500000,
    likes: 290000,
    shares: 105000,
    creator: 'Lionsgate',
    tags: ['behind-scenes', 'action', 'john-wick', 'choreography', 'fight'],
    type: 'behind-scenes',
    relatedContent: {
      type: 'movie',
      id: '21',
      title: 'John Wick: Chapter 4'
    },
    uploadDate: '2024-11-12',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-40',
    title: 'StreamVault Original: Creator Spotlight',
    description: 'Meet the talented creators behind our original series',
    thumbnail: getReelThumbnail('streamvault-creators'),
    videoUrl: getReelVideo('40'),
    duration: 195, // 3:15 minutes
    views: 650000,
    likes: 78000,
    shares: 28000,
    creator: 'StreamVault',
    tags: ['original', 'creators', 'spotlight', 'behind-scenes', 'talent'],
    type: 'interview',
    uploadDate: '2024-11-11',
    isTrending: false,
    isOriginal: true
  },
  {
    id: 'reel-41',
    title: 'Guardians Vol. 3 - James Gunn Interview',
    description: 'Director James Gunn talks about the Guardians trilogy conclusion',
    thumbnail: getReelThumbnail('guardians-james'),
    videoUrl: getReelVideo('41'),
    duration: 240, // 4:00 minutes
    views: 2200000,
    likes: 260000,
    shares: 98000,
    creator: 'Marvel Studios',
    tags: ['interview', 'james-gunn', 'guardians', 'marvel', 'conclusion'],
    type: 'interview',
    relatedContent: {
      type: 'movie',
      id: '23',
      title: 'Guardians of the Galaxy Vol. 3'
    },
    uploadDate: '2024-11-10',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-42',
    title: 'Wednesday - Production Design',
    description: 'Creating the gothic aesthetic of Nevermore Academy',
    thumbnail: getReelThumbnail('wednesday-production'),
    videoUrl: getReelVideo('42'),
    duration: 155, // 2:35 minutes
    views: 1900000,
    likes: 175000,
    shares: 75000,
    creator: 'Netflix',
    tags: ['behind-scenes', 'production-design', 'wednesday', 'gothic', 'nevermore'],
    type: 'behind-scenes',
    relatedContent: {
      type: 'series',
      id: '24',
      title: 'Wednesday'
    },
    uploadDate: '2024-11-09',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-43',
    title: 'Barbie - Margot Robbie Interview',
    description: 'Margot Robbie discusses playing Stereotypical Barbie',
    thumbnail: getReelThumbnail('barbie-margot'),
    videoUrl: getReelVideo('43'),
    duration: 200, // 3:20 minutes
    views: 3200000,
    likes: 410000,
    shares: 155000,
    creator: 'Warner Bros. Pictures',
    tags: ['interview', 'barbie', 'margot-robbie', 'greta-gerwig', 'feminism'],
    type: 'interview',
    relatedContent: {
      type: 'movie',
      id: '25',
      title: 'Barbie'
    },
    uploadDate: '2024-11-08',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-44',
    title: 'Oppenheimer - Christopher Nolan BTS',
    description: 'How Nolan approached the complex structure of Oppenheimer',
    thumbnail: getReelThumbnail('oppenheimer-nolan'),
    videoUrl: getReelVideo('44'),
    duration: 225, // 3:45 minutes
    views: 2800000,
    likes: 240000,
    shares: 105000,
    creator: 'Universal Pictures',
    tags: ['behind-scenes', 'nolan', 'oppenheimer', 'structure', 'complex'],
    type: 'behind-scenes',
    relatedContent: {
      type: 'movie',
      id: '26',
      title: 'Oppenheimer'
    },
    uploadDate: '2024-11-07',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-45',
    title: 'The Mandalorian - Baby Yoda Compilation',
    description: 'All the adorable moments with Grogu in Season 2',
    thumbnail: getReelThumbnail('mandalorian-grogu'),
    videoUrl: getReelVideo('45'),
    duration: 135, // 2:15 minutes
    views: 4500000,
    likes: 620000,
    shares: 235000,
    creator: 'Disney+',
    tags: ['clip', 'baby-yoda', 'grogu', 'mandalorian', 'adorable'],
    type: 'clip',
    relatedContent: {
      type: 'series',
      id: '27',
      title: 'The Mandalorian'
    },
    uploadDate: '2024-11-06',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-46',
    title: 'Top Gun: Maverick - Tom Cruise Stunt Work',
    description: 'The incredible dedication to practical flying sequences',
    thumbnail: getReelThumbnail('topgun-stunts'),
    videoUrl: getReelVideo('46'),
    duration: 190, // 3:10 minutes
    views: 2600000,
    likes: 310000,
    shares: 118000,
    creator: 'Paramount Pictures',
    tags: ['behind-scenes', 'stunts', 'tom-cruise', 'top-gun', 'aviation'],
    type: 'behind-scenes',
    relatedContent: {
      type: 'movie',
      id: '28',
      title: 'Top Gun: Maverick'
    },
    uploadDate: '2024-11-05',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-47',
    title: 'House of the Dragon - Dragon Training',
    description: 'How actors trained to ride and control the CGI dragons',
    thumbnail: getReelThumbnail('hotd-training'),
    videoUrl: getReelVideo('47'),
    duration: 175, // 2:55 minutes
    views: 2100000,
    likes: 185000,
    shares: 82000,
    creator: 'HBO',
    tags: ['behind-scenes', 'dragons', 'training', 'cgi', 'house-of-the-dragon'],
    type: 'behind-scenes',
    relatedContent: {
      type: 'series',
      id: '29',
      title: 'House of the Dragon'
    },
    uploadDate: '2024-11-04',
    isTrending: false,
    isOriginal: false
  },
  {
    id: 'reel-48',
    title: 'Mission: Impossible 7 - Train Scene',
    description: 'The breathtaking train-top fight sequence breakdown',
    thumbnail: getReelThumbnail('mi7-train'),
    videoUrl: getReelVideo('48'),
    duration: 165, // 2:45 minutes
    views: 3300000,
    likes: 390000,
    shares: 145000,
    creator: 'Paramount Pictures',
    tags: ['clip', 'action', 'train', 'stunts', 'mission-impossible'],
    type: 'clip',
    relatedContent: {
      type: 'movie',
      id: '30',
      title: 'Mission: Impossible - Dead Reckoning Part One'
    },
    uploadDate: '2024-11-03',
    isTrending: true,
    isOriginal: false
  },
  {
    id: 'reel-49',
    title: 'StreamVault Original: Special Effects',
    description: 'How we create mind-blowing visual effects for our originals',
    thumbnail: getReelThumbnail('streamvault-vfx'),
    videoUrl: getReelVideo('49'),
    duration: 210, // 3:30 minutes
    views: 720000,
    likes: 85000,
    shares: 31000,
    creator: 'StreamVault',
    tags: ['original', 'vfx', 'special-effects', 'technology', 'production'],
    type: 'behind-scenes',
    uploadDate: '2024-11-02',
    isTrending: false,
    isOriginal: true
  },
  {
    id: 'reel-50',
    title: 'The Witcher - Henry Cavill Farewell',
    description: 'Henry Cavill\'s emotional goodbye to Geralt of Rivia',
    thumbnail: getReelThumbnail('witcher-henry'),
    videoUrl: getReelVideo('50'),
    duration: 180, // 3:00 minutes
    views: 4100000,
    likes: 580000,
    shares: 220000,
    creator: 'Netflix',
    tags: ['interview', 'henry-cavill', 'witcher', 'farewell', 'emotional'],
    type: 'interview',
    relatedContent: {
      type: 'series',
      id: '32',
      title: 'The Witcher'
    },
    uploadDate: '2024-11-01',
    isTrending: true,
    isOriginal: false
  }
]

// Get trending reels (most views in last 7 days)
export const getTrendingReels = (): Reel[] => {
  return mockReels
    .filter(reel => reel.isTrending)
    .sort((a, b) => b.views - a.views)
}

// Get reels by type
export const getReelsByType = (type: Reel['type']): Reel[] => {
  return mockReels.filter(reel => reel.type === type)
}

// Get reels related to specific content
export const getRelatedReels = (contentId: string, contentType: 'movie' | 'series'): Reel[] => {
  return mockReels.filter(reel =>
    reel.relatedContent?.id === contentId && reel.relatedContent?.type === contentType
  )
}

// Get original reels (created by StreamVault)
export const getOriginalReels = (): Reel[] => {
  return mockReels.filter(reel => reel.isOriginal)
}