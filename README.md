# StreamVault - Premium Streaming Platform

A cutting-edge, feature-rich streaming platform built with Next.js 14, Redux Toolkit, and Tailwind CSS. StreamVault goes beyond Netflix and Hotstar with unique social features, AI-powered recommendations, watch parties, and gamification.

## 🚀 Unique Features (Not Available in Netflix/Hotstar)

### 🎉 Watch Parties
- **Synchronized Viewing**: Watch content together with friends in real-time
- **Party Codes**: Easy sharing with unique party codes
- **Host Controls**: Host can play/pause for all participants
- **Social Experience**: See who's watching with you

### 🎯 AI-Powered Recommendations
- **Smart Suggestions**: Personalized recommendations based on viewing history
- **Genre Matching**: Discover content similar to what you've watched
- **Rating-Based**: Combines genre preferences with content ratings
- **Dynamic Updates**: Recommendations improve as you watch more

### 🎮 Achievement System
- **Gamification**: Earn points and unlock achievements
- **Level System**: Level up based on your viewing activity
- **Badges**: Unlock badges for various milestones
- **Streaks**: Track your daily watching streaks

### 🎭 Mood-Based Playlists
- **Curated Collections**: Pre-made playlists for different moods
- **Feel Good Movies**: Uplifting content when you need it
- **Thriller Night**: Edge-of-your-seat suspense
- **Romantic Evenings**: Perfect date night selections
- **Sci-Fi Adventures**: Journey through space and time

### 💬 Social Features
- **Reviews & Ratings**: Write and read reviews for content
- **Like Reviews**: Engage with community reviews
- **Activity Feed**: See what friends are watching
- **Friend System**: Connect with other users

### 📊 Advanced Progress Tracking
- **Continue Watching**: Resume exactly where you left off
- **Progress Bars**: Visual indicators of watch progress
- **Episode Tracking**: Track progress for individual episodes
- **Auto-Save**: Progress saved automatically every 5 seconds

## ✨ Core Features

### 🎬 Content Management
- **50+ Movies**: Extensive library of movies across all genres
- **20+ TV Series**: Complete series with multiple seasons and episodes
- **Hero Section**: Cinematic hero banner with featured content
- **Content Rows**: Horizontal scrollable rows for different categories
- **Detail Pages**: Comprehensive detail pages with cast, director, ratings, and more
- **Episodes**: Full season and episode management for TV series

### 🔍 Search & Discovery
- **Instant Search**: Real-time search with autocomplete suggestions
- **Advanced Filters**: Filter by genres, year, rating, and language
- **Sort Options**: Sort by popularity, rating, release date, or title
- **Recent Searches**: Quick access to your recent searches
- **Popular Searches**: Discover trending content

### 👤 User Features
- **Authentication**: Sign up and sign in functionality
- **User Profiles**: Manage your profile and preferences
- **Favorites**: Add movies and series to your favorites
- **Watchlist**: Save content for later viewing
- **Watch History**: Track your viewing history
- **My List**: View all your saved content in one place

### 💎 Premium Plans
- **Multiple Tiers**: Free, Basic, Standard, and Premium plans
- **Feature Comparison**: Clear comparison of plan features
- **Subscription Management**: Easy plan selection and management
- **Auto-renewal**: Manage subscription auto-renewal settings

### 🎥 Video Player
- **Custom Player**: Premium video player with full controls
- **Playback Controls**: Play, pause, skip forward/backward
- **Volume Control**: Adjust volume and mute/unmute
- **Fullscreen**: Toggle fullscreen mode
- **Progress Tracking**: Track viewing progress automatically
- **Episode Navigation**: Easy navigation between episodes
- **Auto-Resume**: Automatically resume from last position

### 🎨 Premium UI/UX
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Smooth Animations**: Framer Motion animations for premium feel
- **Dark Theme**: Beautiful dark theme optimized for viewing
- **Glassmorphism**: Modern glassmorphism effects
- **Hover Effects**: Interactive hover effects on content cards
- **Loading States**: Skeleton loaders for better perceived performance
- **Gradient Branding**: Eye-catching gradient logo and accents

### 📱 PWA Support
- **Progressive Web App**: Install as a native app
- **Offline Support**: Service worker for offline capability
- **App Icons**: Custom icons for home screen
- **Manifest**: Full PWA manifest configuration

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Notifications**: React Hot Toast
- **Type Safety**: TypeScript
- **PWA**: Service Worker & Manifest

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd streamvault
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
streamvault/
├── app/
│   ├── features/          # Redux slices
│   │   ├── movies/
│   │   ├── series/
│   │   ├── user/
│   │   ├── subscription/
│   │   ├── search/
│   │   ├── filters/
│   │   ├── social/        # Social features (NEW)
│   │   ├── recommendations/ # AI recommendations (NEW)
│   │   └── achievements/  # Achievement system (NEW)
│   ├── movies/            # Movies pages
│   ├── series/            # Series pages
│   ├── search/            # Search page
│   ├── subscription/      # Subscription page
│   ├── watch-party/       # Watch party page (NEW)
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── profile/           # Profile page
│   ├── my-list/           # My List page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── store.ts           # Redux store
│   └── providers.tsx      # Redux provider
├── components/            # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── ContentRow.tsx
│   ├── VideoPlayer.tsx
│   ├── ContinueWatching.tsx
│   ├── WatchParty.tsx     # Watch party component (NEW)
│   ├── MoodPlaylists.tsx  # Mood playlists (NEW)
│   ├── Recommendations.tsx # AI recommendations (NEW)
│   ├── Achievements.tsx    # Achievement display (NEW)
│   └── Reviews.tsx         # Review system (NEW)
├── data/                  # Mock data
│   └── mockData.ts
├── types/                 # TypeScript types
│   └── content.ts
├── utils/                 # Utility functions
│   └── localStorage.ts
└── public/                # Static assets
    ├── manifest.json      # PWA manifest (NEW)
    └── sw.js              # Service worker (NEW)
```

## 🎯 Key Features Explained

### State Management
The app uses Redux Toolkit for state management with separate slices for:
- Movies and Series
- User authentication and preferences
- Subscription management
- Search functionality
- Filter and sort options
- Watch progress tracking
- Social features (friends, reviews, activities)
- AI recommendations
- Achievement system

### Data Persistence
User data (favorites, watchlist, watch history, progress) and subscription information are persisted in browser localStorage.

### Mock Data
The app includes comprehensive mock data for 50 movies and 20 series. In a production environment, this would be replaced with API calls.

## 🎨 Customization

### Adding More Content
Edit `data/mockData.ts` to add more movies and series.

### Styling
The app uses Tailwind CSS. Customize colors and themes in `tailwind.config.js`.

### Redux State
Add new slices in `app/features/` and register them in `app/store.ts`.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ⚡ Performance Optimizations

- Image optimization with Next.js Image component
- Lazy loading for images and components
- Code splitting with Next.js
- Memoized selectors in Redux
- Efficient re-renders with React hooks
- Service worker for offline capability
- Progressive image loading

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file for production configuration:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📝 License

This project is created for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in the repository.

---

**Built with ❤️ using Next.js, Redux Toolkit, and modern web technologies**

**StreamVault - Where Entertainment Meets Innovation** 🎬✨
