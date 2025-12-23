import { useCallback, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getBookById, getChapter } from "../../services/book"
import { BookOpen, ChevronRight, ArrowLeft, MessageSquare, Reply, Send, Trash2 } from "lucide-react"
import * as UserReadingService from "../../services/authorReading"
import Swal from "sweetalert2"

interface IBookComment {
    _id: string
    content: string
    chapterNumber?: number
    createdAt: string
    user: { 
        _id: string
        firstName: string
        lastName: string 
        profilePic?: string 
    }
    authorReply?: string
    repliedAt?: string  
}
 
export default function BookReader() {
  const { bookId } = useParams()

  const [book, setBook] = useState<any>(null)
  const [activeChapter, setActiveChapter] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [comments, setComments] = useState<IBookComment[]>([])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const fetchBookData = useCallback(async () => {
        if (!bookId) return
        try {
            setLoading(true)
            const res = await getBookById(bookId)
            if (res.success) {
                setBook(res.book)
                
                const commentRes = await UserReadingService.getBookCommentsForAuthor(bookId)
                if (commentRes.success) {
                    setComments(commentRes.comments)
                }
            }
        } catch (err) {
            console.error("Failed to load book or comments", err)
        } finally {
            setLoading(false)
        }
    }, [bookId])

  useEffect(() => {
        fetchBookData()
  }, [fetchBookData])

  const openChapter = async (chapterNumber: number) => {
    const res = await getChapter(bookId!, chapterNumber)
    setActiveChapter(res.chapter)
  }

  const handlePostReply = async (commentId: string) => {
    if (!replyText.trim()) return

    try {
        const res = await UserReadingService.postAuthorReply(bookId!, commentId, replyText)
        
        if (res.success) {
            Swal.fire({
                title: "Reply Posted",
                icon: "success",
                toast: true,
                position: 'top-end',
                timer: 2000,
                showConfirmButton: false
            });
            
            setReplyText("")
            setReplyingTo(null)
            fetchBookData()
        }
    } catch (err) {
        console.error("Reply error:", err)
        Swal.fire("Error", "Failed to send reply. Please try again.", "error")
    }
  }

  const handleDeleteReply = async (commentId: string) => {
    const result = await Swal.fire({
        title: "Delete Reply?",
        text: "Are you sure you want to remove your response?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Yes, delete it"
    })

    if (!result.isConfirmed) return

    try {
        const res = await UserReadingService.deleteAuthorReply(bookId!, commentId)
        if (res.success) {
            Swal.fire({ title: "Deleted", icon: "success", toast: true, position: 'top-end', timer: 2000, showConfirmButton: false })
            fetchBookData()
        }
    } catch (err) {
        Swal.fire("Error", "Failed to delete reply", "error")
    }
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
          <aside className="space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 sticky top-24">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Chapters
              </h2>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {book.chapters?.map((ch: any) => (
                  <button
                    key={ch.chapterNumber}
                    onClick={() => openChapter(ch.chapterNumber)}
                    className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg transition ${
                      activeChapter?.chapterNumber === ch.chapterNumber
                        ? 'bg-indigo-900/50 border-indigo-500 text-white'
                        : 'bg-slate-800/40 border-slate-700 hover:bg-indigo-900/20 text-slate-300'
                    }`}
                  >
                    <span className="text-sm truncate">
                      Ch {ch.chapterNumber}: {ch.title}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="md:col-span-2 space-y-6">
            
            {/* Reader Content Box */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 min-h-[40vh]">
              {activeChapter ? (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-indigo-300 border-b border-slate-800 pb-4">
                    {activeChapter.title}
                  </h2>
                  <p className="whitespace-pre-line text-slate-300 leading-relaxed text-lg">
                    {activeChapter.content || "No content yet."}
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                  <p>Select a chapter to review your content.</p>
                </div>
              )}
            </div>

            {/* Reader Engagement (Comments) Section */}
            <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-yellow-400">
                <MessageSquare className="w-6 h-6" /> Reader Engagement
              </h2>

              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="group bg-slate-950/50 border border-slate-800 rounded-xl p-6 transition-all hover:border-indigo-500/30">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                            {comment.user.firstName[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-white leading-none mb-1">
                              {comment.user.firstName} {comment.user.lastName}
                            </h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                              {new Date(comment.createdAt).toLocaleDateString()} • Chapter {comment.chapterNumber}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-4 rounded-lg italic border-l-2 border-indigo-500/50 mb-4">
                        "{comment.content}"
                      </p>

                      {/* Show Existing Author Reply if it exists */}
                      {comment.authorReply && (
                          <div className="mt-4 ml-6 p-4 bg-indigo-500/5 border-l-2 border-indigo-500 rounded-r-lg relative group/reply">
                              <div className="flex justify-between items-start mb-1">
                                  <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Author Response</span>
                                      <span className="text-[10px] text-slate-500">{new Date(comment.repliedAt!).toLocaleDateString()}</span>
                                  </div>
                                  
                                  <button 
                                      onClick={() => handleDeleteReply(comment._id)}
                                      className="opacity-0 group-hover/reply:opacity-100 transition-opacity text-slate-500 hover:text-red-400"
                                      title="Delete Reply"
                                  >
                                      <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                              </div>
                              <p className="text-sm text-indigo-100/80">{comment.authorReply}</p>
                          </div>
                      )}

                      {/* Reply Interface */}
                      {replyingTo === comment._id ? (
                        <div className="mt-4">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your official author reply..."
                            className="w-full bg-slate-950 border border-indigo-500/50 rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none h-24 transition-all"
                          />
                          <div className="flex gap-3 mt-3">
                            <button
                              onClick={() => handlePostReply(comment._id)}
                              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                            >
                              <Send className="w-3 h-3" /> Send Reply
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              className="text-slate-500 hover:text-white text-xs font-bold px-2 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setReplyingTo(comment._id);
                            setReplyText(comment.authorReply || "")
                          }}
                          className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-all font-black uppercase tracking-tighter"
                        >
                          <Reply className="w-4 h-4" /> 
                          {comment.authorReply ? "Edit Reply" : "Reply to Reader"}
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl">
                    <MessageSquare className="w-10 h-10 mx-auto mb-4 text-slate-700" />
                    <p className="text-slate-500 text-sm">No reader comments yet. Your fans are waiting!</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
