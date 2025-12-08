import { useState, useEffect, type ChangeEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Moon, BookOpen, Image, Save, ArrowLeft, Plus, X, Eye } from "lucide-react"
import { getBookById, updateChapter, uploadBookCover, updateBookCategories, addChapter, updateBookStatus } from "../../services/book"

type BookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"
interface Chapter {
    chapterNumber: number;
    title: string;
    content: string;
    isDraft?: boolean;
}

export default function EditBook() {
  const navigate = useNavigate()
  const { bookId } = useParams<{ bookId: string }>()

  const [loading, setLoading] = useState(true)
  const [initialStatus, setInitialStatus] = useState<BookStatus>("DRAFT") 
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categories, setCategories] = useState("")
  const [status, setStatus] = useState<BookStatus>("DRAFT")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [previewCover, setPreviewCover] = useState("")
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const goBack = () => navigate("/author/home")

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (!bookId) return
        const res = await getBookById(bookId)
        const b = res.book
        setTitle(b.title)
        setDescription(b.description)
        setCategories(b.categories?.join(", ") || "")
        setStatus(b.status)
        setInitialStatus(b.status)
        setPreviewCover(b.coverImageUrl)
        setChapters(b.chapters)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [bookId])

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onload = () => setPreviewCover(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const updateLocalChapter = (index: number, field: string, value: string) => {
    const updated = chapters.map((ch, i) => (i === index ? { ...ch, [field]: value } : ch))
    setChapters(updated)
  }

  const handleAddChapter = async () => {
    if (!bookId) return

    try {
        const res = await addChapter(bookId)
        setChapters([...chapters, res.chapter])
    } catch (err: any) {
        console.error("Add chapter error:", err)
        alert(err.response?.data?.message || "Failed to update or add chapter.")
    }
  }

  const handleRemoveChapter = (index: number) => {
    const newChapters = chapters.filter((_, i) => i !== index)
    setChapters(newChapters)
  }

  const handleSaveBook = async () => {
    if (!bookId || isSaving) return
    setIsSaving(true)

    try {
      const categoryArray = categories.split(",").map(c => c.trim()).filter(Boolean)
      await updateBookCategories(bookId, categoryArray)

      if (coverImage) await uploadBookCover(bookId, coverImage)

      if (status !== initialStatus) {
        const updatedStatus = await updateBookStatus(bookId, status)
        setInitialStatus(updatedStatus as BookStatus) 
      }

      for (const ch of chapters) {
        await updateChapter(bookId, ch.chapterNumber, {
          title: ch.title,
          content: ch.content,
          isDraft: ch.isDraft ?? true
        })
      }

      alert("Book updated successfully!")
      navigate("/author/home")
    } catch (err: any) {
      console.error("Save book error:", err)
      alert(err.response?.data?.message || err.message)
    } finally{
        setIsSaving(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-slate-400">Loading book...</div>

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8"
      style={{ background: 'linear-gradient(to bottom, #020617 0%, #1e1b4b 50%, #020617 100%)' }}
    >
      {/* Floating Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-indigo-400" />
                Edit Book
              </h1>
              <p className="text-slate-400 mt-1">Update your masterpiece</p>
            </div>
          </div>

          <a href="/" className="inline-flex items-center gap-2">
            <Moon className="w-8 h-8 text-yellow-400" />
            <span
              className="text-xl font-bold"
              style={{
                background: 'linear-gradient(to right, #facc15, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              MoonPages
            </span>
          </a>
        </div>

        {/* Main Content */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">

          {/* Book Details */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-semibold text-indigo-300 mb-4">Book Details</h2>

            <div className="flex flex-col md:flex-row gap-6 items-start">

              {/* Cover */}
              <div className="shrink-0">
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  <Image className="w-4 h-4 inline mr-2" /> Cover Image
                </label>

                <div className="relative w-48 h-64 rounded-lg bg-slate-800/50 border-2 border-dashed border-slate-700 overflow-hidden group cursor-pointer hover:border-indigo-500 transition">
                  {previewCover ? (
                    <>
                      <img src={previewCover} alt="Cover Preview" className="w-full h-full object-cover" />
                      <label htmlFor="cover-upload" className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        <Eye className="w-8 h-8 text-white" />
                      </label>
                    </>
                  ) : (
                    <label htmlFor="cover-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                      <Image className="w-12 h-12 text-slate-500 mb-2" />
                      <span className="text-slate-500 text-sm">Upload Cover</span>
                    </label>
                  )}
                  <input id="cover-upload" type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                </div>
              </div>

              {/* Title, Description, Categories, Status */}
              <div className="flex-1 space-y-6">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book Title" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white" />
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white resize-none" />
                <input type="text" value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="Categories" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white" />
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chapters */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-indigo-300">Chapters</h2>
              <button onClick={handleAddChapter} className="px-4 py-2 rounded-lg font-semibold transition hover:scale-105 shadow-lg flex items-center gap-2" style={{ background: "linear-gradient(to right, #4f46e5, #9333ea)" }}>
                <Plus className="w-5 h-5" /> Add Chapter
              </button>
            </div>

            <div className="space-y-6">
              {chapters.map((chapter, index) => (
                <div key={index} className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-purple-300">Chapter {chapter.chapterNumber}</h3>
                    <button onClick={() => handleRemoveChapter(index)} className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition"><X className="w-5 h-5" /></button>
                  </div>
                  <input type="text" value={chapter.title} onChange={(e) => updateLocalChapter(index, "title", e.target.value)} placeholder="Chapter Title" className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white" />
                  <textarea rows={6} value={chapter.content} onChange={(e) => updateLocalChapter(index, "content", e.target.value)} placeholder="Chapter Content" className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="mt-8 flex justify-end">
            <button onClick={handleSaveBook} className="px-8 py-3 rounded-lg font-semibold hover:scale-105 shadow-lg flex items-center gap-2" style={{ background: "linear-gradient(to right, #4f46e5, #9333ea)" }}>
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
