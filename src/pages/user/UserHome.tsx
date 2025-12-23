import { Link , useNavigate } from 'react-router-dom'
import { BookOpen, Moon, Bookmark, Highlighter, ChevronRight, Settings, LogOut } from 'lucide-react'
import { useAuth } from "../../context/authContext"
import { useEffect, useState } from 'react'
import { getUserLibrary } from "../../services/userHome" 


export default function UserHome() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const [library, setLibrary] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await getUserLibrary() 
        if (res.success) setLibrary(res.library)
      } catch (err) {
        console.error("Error loading library", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLibrary()
  }, [])

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("accessToken")
    navigate("/login")
  }

  const goToSettings = () => {
    navigate("/user/settings")
  }

  const continueReading = library
    .filter(item => item.bookmarkChapter !== null)
    .map(item => ({
      _id: item.book._id,
      title: item.book.title,
      cover: item.book.coverImageUrl,
      progress: Math.round((item.bookmarkChapter / item.book.chapters.length) * 100),
      lastChapter: item.bookmarkChapter,
      totalChapters: item.book.chapters.length
    }))

  const bookmarks = library
    .filter(item => item.bookmarkChapter !== null)
    .slice(0, 4)

  const allHighlights = library.flatMap(item => 
    item.highlights.map((h: any) => ({
      ...h,
      bookTitle: item.book.title,
      bookId: item.book._id
    }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (loading) return <div className="p-20 text-center">Loading Library...</div>;

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
              <button 
                onClick={goToSettings}
                className="p-2 hover:bg-slate-800 rounded-lg transition">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-indigo-500/40">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-bold">
                    {user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
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
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Hero Welcome */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600/10 to-purple-600/10 pointer-events-none" />

            <h1 className="text-4xl font-bold mb-2 relative z-10">
              Welcome back,
              <span className="bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                {" "}{user?.firstName || "User"}!
              </span>
            </h1>
            <p className="text-slate-400 mb-6 relative z-10">
              Ready to continue your reading journey?
            </p>

            <Link
              to="/user/all-books"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition relative z-10"
            >
              Claim Your Next Read
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Dashboard Grid */}
          <div className="space-y-12">

            {/* Continue Reading */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="w-7 h-7 text-indigo-400" />
                  Continue Reading
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {continueReading.map((book) => (
                  <Link
                    key={book._id}
                    to={`/user/book/${book._id}`}
                    className="group bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-600 transition overflow-hidden"
                  >
                    <div className="flex gap-4 p-4">
                      <img
                        src={book.cover}
                        className="w-24 h-36 object-cover rounded shadow-md group-hover:scale-105 transition"
                      />
                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold group-hover:text-indigo-400 transition">
                            {book.title}
                          </h3>
                          <p className="text-xs text-indigo-400">
                            Chapter {book.lastChapter} of {book.totalChapters}
                          </p>
                        </div>
                        <span className="text-xs text-slate-500">
                          Continue →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-8">

              {/* Bookmarks */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <Bookmark className="w-6 h-6 text-yellow-400" />
                  Recent Bookmarks
                </h2>

                <div className="space-y-4">
                  {bookmarks.map((item) => (
                    <Link
                      key={item._id}
                      to={`/book/${item.book._id}`}
                      className="block hover:text-yellow-400 transition"
                    >
                      <h3 className="font-semibold text-sm">
                        {item.book.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Chapter {item.bookmarkChapter}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <Highlighter className="w-6 h-6 text-pink-400" />
                  Highlights
                </h2>

                <div className="space-y-4">
                  {allHighlights.map((h) => (
                    <div
                      key={h._id}
                      className="border-l-4 border-pink-400 bg-pink-400/10 p-4 rounded"
                    >
                      <p className="text-sm italic">"{h.text}"</p>
                      <p className="text-xs text-slate-500 mt-2">
                        — {h.bookTitle}, Ch {h.chapterNumber}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  )
}