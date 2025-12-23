import { useEffect, useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { BookOpen, Moon, Users, MessageCircle, TrendingUp, Plus, Edit, Trash2, Settings, LogOut } from 'lucide-react'
import { useAuth } from "../../context/authContext"
import { deleteBook, getAuthorBooks } from "../../services/book"
import Swal from "sweetalert2"
import { getAuthorDashboard } from "../../services/authorHome"

export default function AuthorHome() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  
  const [myBooks, setMyBooks] = useState<any[]>([])
  const [loadingBooks, setLoadingBooks] = useState(true)

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("accessToken")
    navigate("/login")
  }

  const goToCreateBook = () => {
    navigate("/author/create-book")
  }

  const goToSettings = () => {
    navigate("/author/settings")
  }

  const [dashboardData, setDashboardData] = useState({
    stats: { publishedBooks: 0, totalReaders: 0, totalComments: 0 },
    recentComments: []
  })

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingBooks(true)
        const [booksRes, statsRes] = await Promise.all([
          getAuthorBooks(),
          getAuthorDashboard()
        ])
        if (booksRes.success) setMyBooks(booksRes.books)
        if (statsRes.success) setDashboardData({
          stats: statsRes.stats,
          recentComments: statsRes.recentComments
        })
      } catch (err) {
        console.error("Failed to fetch author books:", err)
      } finally {
        setLoadingBooks(false)
      }
    }

    fetchBooks()
  }, [])
  
  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    const {isConfirmed} = await Swal.fire({
          title: "Delete Account?",
          text: `Are you sure you want to permanently delete the book: "${bookTitle}"? This action cannot be undone.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#ef4444",
          cancelButtonColor: "#64748b",
          confirmButtonText: "Yes, delete the book",
          cancelButtonText: "Cancel"
      })
    if (!isConfirmed) {
      return 
    }

    try {
      await deleteBook(bookId)

      setMyBooks(prevBooks => prevBooks.filter(book => book._id !== bookId))

      Swal.fire({
                icon: "success",
                title: "Deletion Success",
                text: `Book "${bookTitle}" successfully deleted.`,
                confirmButtonColor: "#f87171"
      })
    } catch (err: any) {
      console.error("Delete book error:", err)
      Swal.fire({
                icon: "error",
                title: "Deletion Failed",
                text: "Failed to delete the book.",
                confirmButtonColor: "#f87171"
      })
    }
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
              <span className="ml-2 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-xs font-semibold text-purple-400">
                Author
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
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, <span className="bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">{user?.firstName || "User"} !</span>
              </h1>
              <p className="text-slate-400">Manage your books and connect with your readers</p>
            </div>
            <button 
              onClick={goToCreateBook}
              className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Upload New Book
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-linear-to-br from-indigo-950/50 to-indigo-900/30 border border-indigo-800/30 rounded-xl p-6 hover:border-indigo-600 transition group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-600/20 rounded-lg group-hover:bg-indigo-600/30 transition">
                  <BookOpen className="w-6 h-6 text-indigo-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{dashboardData.stats.publishedBooks}</div>
              <div className="text-sm text-slate-400">Published Books</div>
            </div>

            <div className="bg-linear-to-br from-purple-950/50 to-purple-900/30 border border-purple-800/30 rounded-xl p-6 hover:border-purple-600 transition group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{dashboardData.stats.totalReaders.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Total Readers</div>
            </div>

            <div className="bg-linear-to-br from-yellow-950/50 to-yellow-900/30 border border-yellow-800/30 rounded-xl p-6 hover:border-yellow-600 transition group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-600/20 rounded-lg group-hover:bg-yellow-600/30 transition">
                  <MessageCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{dashboardData.stats.totalComments}</div>
              <div className="text-sm text-slate-400">All Comments</div>
            </div>
          </div>

          {/* My Books Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-indigo-400" />
                My Books
              </h2>
            </div>

            {loadingBooks ? (
              <div className="text-center text-slate-400 py-10">Loading your books...</div>
            ) : myBooks.length === 0 ? (
              <div className="text-center text-slate-400 py-10">
                You haven't uploaded any books yet.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBooks.map((book) => (
                  <div 
                    key={book._id} 
                    className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-600 transition group"
                  >
                    <Link 
                      to={`/author/book/${book._id}`}
                      className="block"
                    >
                      <div className="relative">
                        <img 
                          src={book.coverImageUrl || "https://dummyimage.com/400x600/000/fff&text=No+Cover"} 
                          alt={book.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            book.status === 'Published' 
                              ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                              : 'bg-purple-600/20 text-400 border border-purple-500/30'
                          }`}>
                            {book.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{book.title}</h3>
                        <p className="text-sm text-slate-400 mb-3">
                          {book.categories?.join(", ") || "Uncategorized"} • {book.chapters?.length || 0} Chapters
                        </p>
                      </div>
                    </Link>

                    <div className="p-4 pt-0 flex gap-2">
                      <Link 
                        to={`/author/book/${book._id}/edit`}
                        className="flex-1 px-3 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-sm font-semibold hover:bg-purple-600/30 transition flex items-center justify-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>

                      <button 
                        onClick={() => handleDeleteBook(book._id, book.title)}
                        className="px-3 py-2 bg-pink-600/20 border border-pink-500/30 rounded-lg text-sm font-semibold hover:bg-pink-600/30 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                ))}
              </div>
            )}
          </div>          
            
          {/* Recent Comments */}
          <div>
              
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                  <MessageCircle className="w-7 h-7 text-yellow-400" /> Recent Comments
                </h2>
                <div className="space-y-4">
                  {dashboardData.recentComments.length > 0 ? (
                    dashboardData.recentComments.map((comment: any) => (
                      <div key={comment._id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">
                            {comment.userAvatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-semibold">{comment.userName}</h4>
                              <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-indigo-400">{comment.bookTitle} • Ch. {comment.chapterNumber}</p>
                            <p className="text-sm text-slate-300 mt-2">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 italic">No comments found for your books.</div>
                  )}
                </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  )
}