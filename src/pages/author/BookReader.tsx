import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getBookById, getChapter } from "../../services/book"
import { BookOpen, ChevronRight, ArrowLeft } from "lucide-react"

export default function BookReader() {
  const { bookId } = useParams()

  const [book, setBook] = useState<any>(null)
  const [activeChapter, setActiveChapter] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await getBookById(bookId!)
        if (res.success) setBook(res.book)
      } catch (err) {
        console.error("Failed to load book", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [bookId])

  const openChapter = async (chapterNumber: number) => {
    const res = await getChapter(bookId!, chapterNumber)
    setActiveChapter(res.chapter)
  }

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading book...</div>
  }

  if (!book) {
    return <div className="text-center py-20 text-red-400">Book not found.</div>
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-indigo-950 to-slate-950 text-white">

      {/* Top Bar */}
      <div className="sticky top-0 bg-slate-950/80 backdrop-blur-lg border-b border-indigo-900/30 z-40 p-4">
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          <Link
            to="/author/home"
            className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            {book.title}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-10 px-4">

        {/* Header */}
        <div className="flex gap-6 mb-10 bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-40 h-56 object-cover rounded-lg border border-slate-700"
          />

          <div>
            <h1 className="text-3xl font-bold text-indigo-400">{book.title}</h1>
            <p className="text-slate-400 mt-2">{book.description}</p>

            <div className="mt-3 text-sm text-slate-300">
              {book.categories?.join(", ") || "Uncategorized"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Chapter List */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Chapters
            </h2>

            <div className="space-y-2">
              {book.chapters?.map((ch: any) => (
                <button
                  key={ch.chapterNumber}
                  onClick={() => openChapter(ch.chapterNumber)}
                  className="w-full flex items-center justify-between px-3 py-2 
                             bg-slate-800/40 border border-slate-700 rounded-lg 
                             hover:bg-indigo-900/30 hover:border-indigo-700 
                             transition"
                >
                  <span>
                    Chapter {ch.chapterNumber}: {ch.title}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Reader */}
          <div className="md:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl p-6">
            {activeChapter ? (
              <>
                <h2 className="text-2xl font-bold mb-3 text-indigo-300">
                  {activeChapter.title}
                </h2>

                <p className="whitespace-pre-line text-slate-300 leading-relaxed">
                  {activeChapter.content || "No content yet."}
                </p>
              </>
            ) : (
              <p className="text-slate-500 text-center py-20">
                Select a chapter to start reading.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
