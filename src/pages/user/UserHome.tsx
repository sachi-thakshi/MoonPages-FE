import { Link , useNavigate } from 'react-router-dom'
import { BookOpen, Moon, Star, TrendingUp, Bookmark, Highlighter, Sparkles, ChevronRight, Clock, Target, Award, Zap, Brain, Bell, Search, Settings, LogOut } from 'lucide-react'
import { useAuth } from "../../context/authContext"

export default function UserHome() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("accessToken")
    navigate("/login")
  }

  const goToSettings = () => {
    navigate("/user/settings")
  }

  // Sample data
  const continueReading = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      progress: 67,
      lastPage: 234,
      totalPages: 350,
      timeLeft: "2h 15m left"
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
      progress: 45,
      lastPage: 124,
      totalPages: 275,
      timeLeft: "3h 40m left"
    },
    {
      id: 3,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      progress: 89,
      lastPage: 287,
      totalPages: 323,
      timeLeft: "45m left"
    }
  ]

  const bookmarks = [
    { id: 1, book: "The Midnight Library", page: 156, note: "Beautiful quote about second chances", time: "2 hours ago" },
    { id: 2, book: "Atomic Habits", page: 89, note: "The 1% improvement rule", time: "1 day ago" },
    { id: 3, book: "Educated", page: 203, note: "Powerful moment of self-realization", time: "3 days ago" },
    { id: 4, book: "The Silent Patient", page: 145, note: "Major plot twist!", time: "5 days ago" }
  ]

  const highlights = [
    { id: 1, book: "The Midnight Library", text: "Between life and death there is a library, and within that library, the shelves go on forever.", color: "yellow" },
    { id: 2, book: "Atomic Habits", text: "You do not rise to the level of your goals. You fall to the level of your systems.", color: "purple" },
    { id: 3, book: "Educated", text: "I am not the child my father raised, but he is the father who raised her.", color: "pink" }
  ]

  const recommendations = [
    {
      id: 1,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      reason: "Based on your love for sci-fi thrillers",
      match: 94
    },
    {
      id: 2,
      title: "The Seven Husbands",
      author: "Taylor Jenkins Reid",
      cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
      reason: "Similar to your recent fiction reads",
      match: 89
    },
    {
      id: 3,
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      cover: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop",
      reason: "Pairs well with Atomic Habits",
      match: 87
    }
  ]

  const stats = {
    booksCompleted: 24,
    pagesRead: 8547,
    readingStreak: 12,
    hoursRead: 142
  }

  const getHighlightColor = (color: string) => {
    const colors: Record<string, string> = {
      yellow: 'border-l-yellow-400 bg-yellow-400/10',
      purple: 'border-l-purple-400 bg-purple-400/10',
      pink: 'border-l-pink-400 bg-pink-400/10'
    }
    return colors[color] || colors.yellow
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-indigo-950 to-slate-950 text-white">
      
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-indigo-900/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Moon className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                MoonPages
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-slate-800 rounded-lg transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              </button>
              <button 
                onClick={goToSettings}
                className="p-2 hover:bg-slate-800 rounded-lg transition">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center font-bold">
                JD
              </div>
              <button onClick={handleLogout}>
                <LogOut className="w-6 h-6 text-red-600"/>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">{user?.firstName || "User"}! </span>
            </h1>
            <p className="text-slate-400">Ready to continue your reading journey?</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-7">
            <div>
                <Link
                    to="/books"
                    className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition flex items-center gap-2">
                            Claim Your Next Read
                    <ChevronRight className="w-5 h-5" />
                </Link>
            </div>
          </div>

          {/* Reading Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-linear-to-br from-indigo-950/50 to-indigo-900/30 border border-indigo-800/30 rounded-xl p-6 hover:border-indigo-600 transition group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-600/20 rounded-lg group-hover:bg-indigo-600/30 transition">
                  <BookOpen className="w-6 h-6 text-indigo-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.booksCompleted}</div>
              <div className="text-sm text-slate-400">Books Completed</div>
            </div>

            <div className="bg-linear-to-br from-purple-950/50 to-purple-900/30 border border-purple-800/30 rounded-xl p-6 hover:border-purple-600 transition group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.pagesRead.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Pages Read</div>
            </div>

            <div className="bg-linear-to-br from-yellow-950/50 to-yellow-900/30 border border-yellow-800/30 rounded-xl p-6 hover:border-yellow-600 transition group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-600/20 rounded-lg group-hover:bg-yellow-600/30 transition">
                  <Award className="w-6 h-6 text-yellow-400" />
                </div>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.readingStreak}</div>
              <div className="text-sm text-slate-400">Day Streak</div>
            </div>

            <div className="bg-linear-to-br from-pink-950/50 to-pink-900/30 border border-pink-800/30 rounded-xl p-6 hover:border-pink-600 transition group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-600/20 rounded-lg group-hover:bg-pink-600/30 transition">
                  <Clock className="w-6 h-6 text-pink-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.hoursRead}</div>
              <div className="text-sm text-slate-400">Hours Read</div>
            </div>
          </div>

          {/* Continue Reading */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-indigo-400" />
                Continue Reading
              </h2>
              <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueReading.map((book) => (
                <Link 
                  key={book.id}
                  to={`/book/${book.id}`}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-600 transition group cursor-pointer"
                >
                  <div className="flex gap-4 p-4">
                    <div className="shrink-0 w-24 h-36 rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src={book.cover} 
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
                      <p className="text-sm text-slate-400 mb-3">{book.author}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <span>Page {book.lastPage} of {book.totalPages}</span>
                      </div>
                      <div className="text-xs text-indigo-400 mb-3">{book.timeLeft}</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="px-4 pb-4">
                    <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-linear-to-r from-indigo-600 to-purple-600 rounded-full transition-all"
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 text-right">{book.progress}% complete</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Grid Layout for Bookmarks, Highlights, and Recommendations */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Bookmarks & Highlights Column */}
            <div className="space-y-8">
              
              {/* Bookmarks */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Bookmark className="w-7 h-7 text-yellow-400" />
                    Recent Bookmarks
                  </h2>
                  <button className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-sm">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {bookmarks.map((bookmark) => (
                    <Link 
                      key={bookmark.id}
                      to={`/book/${bookmark.id}`}
                      className="block bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-yellow-600 transition cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm group-hover:text-yellow-400 transition">{bookmark.book}</h3>
                        <span className="text-xs text-slate-500">Page {bookmark.page}</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{bookmark.note}</p>
                      <div className="text-xs text-slate-500">{bookmark.time}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Highlighter className="w-7 h-7 text-pink-400" />
                    Recent Highlights
                  </h2>
                  <button className="text-pink-400 hover:text-pink-300 flex items-center gap-1 text-sm">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {highlights.map((highlight) => (
                    <div 
                      key={highlight.id}
                      className={`border-l-4 rounded-lg p-4 ${getHighlightColor(highlight.color)} cursor-pointer hover:scale-[1.02] transition`}
                    >
                      <p className="text-sm italic mb-2">&ldquo;{highlight.text}&rdquo;</p>
                      <p className="text-xs text-slate-400">— {highlight.book}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Brain className="w-7 h-7 text-purple-400" />
                  AI Recommendations
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-950/50 border border-purple-800/30 rounded-full">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-400">Powered by AI</span>
                </div>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <Link 
                    key={rec.id}
                    to={`/book/${rec.id}`}
                    className="block bg-linear-to-br from-purple-950/30 to-indigo-950/30 border border-purple-800/30 rounded-xl overflow-hidden hover:border-purple-600 transition group cursor-pointer"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="shrink-0 w-20 h-28 rounded-lg overflow-hidden shadow-lg">
                        <img 
                          src={rec.cover} 
                          alt={rec.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold mb-1">{rec.title}</h3>
                            <p className="text-sm text-slate-400">{rec.author}</p>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-purple-600/20 rounded-lg">
                            <Star className="w-3 h-3 fill-purple-400 text-purple-400" />
                            <span className="text-xs font-semibold text-purple-400">{rec.match}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">{rec.reason}</p>
                        <button className="px-3 py-1.5 bg-linear-to-r from-purple-600 to-indigo-600 rounded-lg text-xs font-semibold hover:from-purple-500 hover:to-indigo-500 transition">
                          Add to Library
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Weekly Goal */}
              <div className="mt-6 bg-linear-to-br from-indigo-950/50 to-purple-950/50 border border-indigo-800/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    Weekly Reading Goal
                  </h3>
                  <span className="text-sm text-slate-400">5 of 7 days</span>
                </div>
                <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div 
                    className="absolute top-0 left-0 h-full bg-linear-to-r from-indigo-600 to-purple-600 rounded-full"
                    style={{ width: '71%' }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400">2 more days to maintain your streak! 🔥</p>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}