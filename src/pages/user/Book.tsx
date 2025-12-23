import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { getBookById, getChapter } from "../../services/book"
import * as UserReadingService from "../../services/userReading"
import { generateOverview } from "../../services/ai"
import { useAuth } from "../../context/authContext" 
import Swal from "sweetalert2"

import { BookOpen, ChevronRight, ArrowLeft, Lightbulb, Bookmark, MessageSquare, Save, Trash2, Reply } from "lucide-react"

interface Highlight {
    _id: string
    chapterNumber: number
    text: string
    startOffset: number
    endOffset: number
}

interface UserBookData {
    bookmarkChapter: number | null
    highlights: Highlight[]
}

interface IBookComment {
    _id: string
    content: string
    chapterNumber?: number
    createdAt: string
    user: { _id: string; firstName: string; lastName: string; profilePic?: string } 
    authorReply?: string; 
    repliedAt?: string;
}

export default function Book() {
    const { bookId } = useParams<{ bookId: string }>() 
    const readerRef = useRef<HTMLDivElement>(null)
    const { user } = useAuth()
    const currentUserId = user?._id

    const [book, setBook] = useState<any>(null)
    const [activeChapter, setActiveChapter] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [aiOverview, setAiOverview] = useState("AI is generating a short summary...")
    const [userBookData, setUserBookData] = useState<UserBookData>({ bookmarkChapter: null, highlights: [] })
    const [newComment, setNewComment] = useState('')
    const [comments, setComments] = useState<IBookComment[]>([])

    const fetchBookAndData = useCallback(async () => {
        if (!bookId) return

        try {
            setLoading(true)

            const bookRes = await getBookById(bookId!)
            const fetchedBook = bookRes.book
            
            if (bookRes.success && fetchedBook) {
                setBook(fetchedBook)
                
                const userDataRes = await UserReadingService.getUserBookData(bookId!)
                setUserBookData({
                    bookmarkChapter: userDataRes.data.bookmarkChapter,
                    highlights: userDataRes.data.highlights || [],
                })
                setComments(userDataRes.data.comments || [])
                
                const bookDescription = fetchedBook.description || fetchedBook.title;
                if (bookDescription) {
                    setAiOverview("AI is generating a short summary...")
                    try {
                        const overview = await generateOverview(bookDescription, 100)
                        setAiOverview(overview)
                    } catch (aiErr) {
                        console.warn("AI generation failed (likely quota). Displaying fallback message.", aiErr)
                        setAiOverview("AI feature is temporarily unavailable. (Quota Exceeded)")
                    }
                } else {
                    setAiOverview("No description available to generate AI overview.")
                }
            }
        } catch (err) {
            console.error("Failed to load book data or user progress:", err)
            
            Swal.fire({
                title: "Critical Error!",
                text: "Failed to load book content or your saved progress.",
                icon: "error"
            })
            setAiOverview("Could not load content due to a network error.")
        } finally {
            setLoading(false)
        }
    }, [bookId, setBook, setUserBookData, setComments, setAiOverview, getBookById, UserReadingService.getUserBookData, generateOverview])


    useEffect(() => {
        fetchBookAndData()
    }, [fetchBookAndData])

    const openChapter = async (chapterNumber: number) => {
        try {
            const res = await getChapter(bookId!, chapterNumber)
            setActiveChapter(res.chapter)
            readerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (err) {
            console.error(`Failed to load chapter ${chapterNumber}`, err)
        }
    }

    const handleLoadBookmark = () => {
        if (userBookData.bookmarkChapter) {
            openChapter(userBookData.bookmarkChapter)
        }
    }

    const handleToggleBookmark = async () => {
        const chapterNumber = activeChapter?.chapterNumber
        if (!chapterNumber) return

        const isBookmarked = userBookData.bookmarkChapter === chapterNumber
        const newBookmark = isBookmarked ? null : chapterNumber
        const oldBookmark = userBookData.bookmarkChapter

        try {
            setUserBookData(prev => ({ ...prev, bookmarkChapter: newBookmark }))
            await UserReadingService.updateBookmark(bookId!, newBookmark)
        } catch (err) {
            console.error("Failed to save bookmark:", err)
            setUserBookData(prev => ({ ...prev, bookmarkChapter: oldBookmark }))
            alert("Failed to save bookmark.")
        }
    }

    const handleHighlight = useCallback(async () => {
        if (!activeChapter || !readerRef.current) return

        const selection = window.getSelection()
        const selectedText = selection?.toString().trim()
        
        if (!selectedText || !readerRef.current.contains(selection?.anchorNode as Node) || selectedText.length < 5) {
            return
        }

        const chapterNumber = activeChapter.chapterNumber
        
        const textContent = readerRef.current.innerText
        const startOffset = textContent.indexOf(selectedText)
        const endOffset = startOffset + selectedText.length

        if (startOffset === -1) return

        const payload = { chapterNumber, text: selectedText, startOffset, endOffset }

        try {
            const res = await UserReadingService.addHighlight(bookId!, payload)
            
            setUserBookData(prev => ({ 
                ...prev, 
                highlights: [...prev.highlights, res.highlight] 
            }))
        } catch (error) {
            console.error("Failed to save highlight:", error)
            alert("Failed to save highlight.")
        }
    }, [activeChapter, bookId])

    const handleDeleteHighlight = async (highlightId: string) => {
        const result = await Swal.fire({
            title: "Remove Highlight?",
            text: "Are you sure you want to remove this highlight? This cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626", 
            cancelButtonColor: "#6b7280", 
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        })

        if (!result.isConfirmed) return

        try {
            await UserReadingService.deleteHighlight(bookId!, highlightId)
            
            setUserBookData(prev => ({ 
                ...prev, 
                highlights: prev.highlights.filter(h => h._id !== highlightId) 
            }))

            Swal.fire({
                title: "Deleted!",
                text: "The highlight has been removed successfully.",
                icon: "success",
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            })

        } catch (error) {
            console.error("Failed to delete highlight:", error)
            
            Swal.fire({
                title: "Error!",
                text: "Failed to delete highlight. Please ensure your session is active.",
                icon: "error",
                showConfirmButton: true
            })
        }
    }

    useEffect(() => {
        document.addEventListener('mouseup', handleHighlight)
        return () => document.removeEventListener('mouseup', handleHighlight)
    }, [handleHighlight])


    const handleAddComment = async () => {
        if (!newComment.trim()) return

        const commentPayload = {
            content: newComment,
        }
        
        try {
            const res = await UserReadingService.addComment(bookId!, commentPayload)
            
            setComments(prev => [res.comment, ...prev]) 
            setNewComment('')
        } catch (error) {
            console.error("Failed to post comment:", error)
            alert("Failed to post comment.")
        }
    }
    
    const handleDeleteComment = async (commentId: string) => {
        const result = await Swal.fire({
            title: "Delete Comment?",
            text: "Do you want to remove your comment?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            confirmButtonText: "Yes, delete it!"
        })

        if (!result.isConfirmed) return

        try {
            await UserReadingService.deleteComment(bookId!, commentId)
            
            setComments(prev => prev.filter(c => c._id !== commentId))

            Swal.fire({ 
                title: "Deleted!", 
                icon: "success", 
                toast: true, 
                position: 'top-end', 
                timer: 2000, 
                showConfirmButton: false 
            })
        } catch (error) {
            console.error("Failed to delete comment:", error)
            Swal.fire("Error", "Could not delete comment.", "error")
        }
    }


    if (loading) {
         return(
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <p className="text-xl text-indigo-400 animate-pulse">Loading book...</p>
            </div>
        )
    }

    if (!book) {
        return <div className="text-center py-20 text-red-400">Book not found.</div>
    }
    
    const isCurrentChapterBookmarked = userBookData.bookmarkChapter === activeChapter?.chapterNumber
    const currentChapterHighlights = userBookData.highlights.filter(h => h.chapterNumber === activeChapter?.chapterNumber)


    return (
        <div className="min-h-screen bg-linear-to-b from-slate-950 via-indigo-950 to-slate-950 text-white">

            {/* Top Bar */}
            <div className="sticky top-0 bg-slate-950/80 backdrop-blur-lg border-b border-indigo-900/30 z-40 p-4">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/user/all-books"
                            className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-semibold bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                            {book.title}
                        </h1>
                        {userBookData.bookmarkChapter && (
                             <button
                                onClick={handleLoadBookmark}
                                className="text-sm px-3 py-1 bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 rounded-full flex items-center gap-1 hover:bg-yellow-600/30 transition"
                            >
                                <Bookmark className="w-4 h-4" /> Go to Bookmark (Ch. {userBookData.bookmarkChapter})
                            </button>
                        )}
                    </div>
                    {/* Bookmark Toggle Button */}
                    {activeChapter && (
                        <button
                            onClick={handleToggleBookmark}
                            className={`p-2 rounded-lg transition ${isCurrentChapterBookmarked ? 'bg-indigo-600 border border-indigo-500 text-white' : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 text-slate-400'}`}
                            title={isCurrentChapterBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                        >
                            <Bookmark className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-10 px-4">

                {/* Header/AI Overview */}
                <div className="flex flex-col gap-6 mb-10 bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                    <div className="flex gap-6 items-start">
                        <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="w-40 h-56 object-cover rounded-lg border border-slate-700 shrink-0"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-indigo-400">{book.title}</h1>
                            <p className="text-slate-400 mt-2">{book.description}</p>
                            <div className="mt-3 text-sm text-slate-300">
                                {book.categories?.join(", ") || "Uncategorized"}
                            </div>
                        </div>
                    </div>

                    {/* AI Overview Section */}
                    <div className="border-t border-slate-700 pt-4 mt-4">
                         <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-purple-300">
                            <Lightbulb className="w-5 h-5" /> AI Book Overview
                        </h2>
                        <p className="text-slate-300 italic text-sm leading-relaxed">
                            {aiOverview}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Chapter List */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 md:col-span-1">
                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-400" />
                            Chapters
                        </h2>

                        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                            {book.chapters?.map((ch: any) => (
                                <button
                                    key={ch.chapterNumber}
                                    onClick={() => openChapter(ch.chapterNumber)}
                                    className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg transition ${
                                        activeChapter?.chapterNumber === ch.chapterNumber
                                            ? 'bg-indigo-700/50 border-indigo-600'
                                            : 'bg-slate-800/40 border-slate-700 hover:bg-indigo-900/30 hover:border-indigo-700'
                                    }`}
                                >
                                    <span>
                                        Chapter {ch.chapterNumber}: {ch.title}
                                    </span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reader & Comments */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Reader Content */}
                        <div ref={readerRef} className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 min-h-[30vh] max-h-[70vh] overflow-y-auto">
                            {activeChapter ? (
                                <>
                                    <h2 className="text-2xl font-bold mb-5 text-indigo-300 pb-3 border-b border-slate-700">
                                            {activeChapter.title}
                                    </h2>

                                    {/* Chapter Content with Highlighting */}
                                    <div className="relative">
                                        
                                        <p className="whitespace-pre-line text-slate-300 leading-relaxed selection:bg-yellow-600/50">
                                            {activeChapter.content || "No content yet."}
                                        </p>
                                    </div>
                                    
                                    {/* List of current chapter highlights (for deletion) */}
                                    {currentChapterHighlights.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-slate-700">
                                            <h3 className="text-sm font-semibold text-yellow-400 mb-2">Your Highlights:</h3>

                                            {currentChapterHighlights.map(h => (
                                                <div 
                                                    key={h._id} 
                                                    className="flex justify-between items-center text-xs text-slate-400 p-2 bg-slate-800/50 rounded mb-1">
                                                    <span className="truncate max-w-[80%] italic">"{h.text.substring(0, 50)}..."</span>
                                                    <button onClick={() => handleDeleteHighlight(h._id)} className="text-red-400 hover:text-red-300 flex items-center gap-1">
                                                        <Trash2 className="w-3 h-3" /> Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-slate-500 text-center py-20">
                                    Select a chapter to start reading.
                                </p>
                            )}
                        </div>

                        {/* Comment Section */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-green-300">
                                <MessageSquare className="w-5 h-5" /> Discussions ({comments.length})
                            </h2>

                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a public comment or question..."
                                className="w-full h-20 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg resize-none mb-3 text-white placeholder-slate-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="px-4 py-2 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                <Save className="w-4 h-4" /> Post Comment
                            </button>

                            <div className="mt-6 space-y-4 max-h-64 overflow-y-auto">
                                {comments.length === 0 ? (
                                    <p className="text-slate-500 text-sm">No comments yet. Be the first!</p>
                                ) : (
                                    comments.map(comment => (
                                        <div key={comment._id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                                                <span className="font-semibold">
                                                    {comment.user.firstName} {comment.user.lastName} 
                                                    {comment.user._id === currentUserId && " (You)"}
                                                </span>
                                                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-300">{comment.content}</p>
                                                                                        
                                            {comment.authorReply && (
                                                <div className="ml-8 p-4 bg-indigo-500/5 border-l-2 border-indigo-500 rounded-r-xl">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Reply className="w-3 h-3 text-indigo-400" />
                                                        <span className="text-[10px] font-black text-400 tracking-widest">Author Response</span>
                                                        <span className="text-[10px] text-slate-600">•</span>
                                                        <span className="text-[10px] text-slate-500">{new Date(comment.repliedAt!).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-200 italic">"{comment.authorReply}"</p>
                                                </div>
                                            )}

                                            {/* Delete Button */}
                                            {comment.user._id.toString() === currentUserId?.toString() && (
                                                 <button 
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="text-red-400 hover:text-red-300 text-xs mt-1 flex items-center gap-1"
                                                 >
                                                     <Trash2 className="w-3 h-3" /> Remove
                                                 </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}