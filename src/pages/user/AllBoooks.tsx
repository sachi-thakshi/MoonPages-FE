import { useState, useEffect } from "react"
import { Moon, BookOpen, Search, Filter, ArrowLeft } from "lucide-react"
import { getPublishedBooks } from "../../services/book" 
import { Link } from "react-router-dom"

interface Book {
    _id: string
    title: string
    coverImageUrl?: string
    categories?: string[]
    status: string
    totalWordCount?: number
}

export default function AllBooks() {    
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await getPublishedBooks() 
                setBooks(res.books)
            } catch (err: any) {
                console.error("Failed to fetch published books:", err)
                setError(err.response?.data?.message || "Failed to load books. Check server connection.")
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [])

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.categories?.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="min-h-screen bg-slate-950 text-white px-4 py-8"
            style={{ background: 'linear-gradient(to bottom, #020617 0%, #1e1b4b 50%, #020617 100%)' }}
        >
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12 border-b border-slate-700 pb-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/user/home"
                            className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition"
                         >
                             <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <BookOpen className="w-8 h-8 text-indigo-400" />
                        <h1 className="text-4xl font-bold">MoonPages Library</h1>
                        <span className="text-xl text-slate-400 mt-1">/ Published Works</span>
                    </div>
                    <a href="/" className="inline-flex items-center gap-2">
                        <Moon className="w-8 h-8 text-yellow-400" />
                        <span className="text-xl font-bold bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                            MoonPages
                        </span>
                    </a>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4 mb-10 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by title or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-white placeholder-slate-500"
                        />
                    </div>
                    <button
                        className="px-4 py-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-sm font-semibold text-purple-400 hover:bg-purple-600/30 transition flex items-center gap-2"
                    >
                        <Filter className="w-5 h-5" /> Filter
                    </button>
                </div>

                {/* Book Grid */}
                <div className="mt-8">
                    {loading ? (
                        <div className="text-center py-20 text-indigo-400 text-xl animate-pulse">
                            Fetching the cosmos of knowledge...
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-400 text-xl bg-slate-900/50 border border-red-800/50 rounded-lg p-6">
                            {error}
                        </div>
                    ) : filteredBooks.length === 0 ? (
                        <div className="text-center py-20 text-slate-400 text-xl">
                            No published books match your search.
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {filteredBooks.map((book) => (
                                <Link 
                                    key={book._id} 
                                    to={`/user/book/${book._id}`} 
                                    className="block bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-600 transition duration-300 transform hover:-translate-y-1 shadow-xl"
                                >
                                    {/* Book Cover */}
                                    <div className="relative">
                                        <img
                                            src={book.coverImageUrl || "https://dummyimage.com/400x600/1e1b4b/fff&text=MoonPages+Book"}
                                            alt={book.title}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition"></div>
                                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-green-600/20 text-green-400 border border-green-500/30">
                                            PUBLISHED
                                        </span>
                                    </div>

                                    {/* Book Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-xl mb-1 text-indigo-300 truncate">{book.title}</h3>

                                        <p className="text-xs text-slate-500">
                                            {book.categories?.slice(0, 2).join(" • ") || "General Fiction"}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}