import { useState, type ChangeEvent } from "react"
import { Moon, BookOpen, Image, Save, ArrowLeft, Plus, X, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { createBook, uploadBookCover, updateBookCategories } from "../../services/book"

type BookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

interface ChapterData {
  chapterNumber: number
  title: string
  content: string
  wordCount: number
  isDraft: boolean
}

interface BookData {
  title: string
  description: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  chapters: ChapterData[]
  totalWordCount: number
}

export default function CreateBook() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categories, setCategories] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [previewCover, setPreviewCover] = useState("")
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">("DRAFT")
  const [chapters, setChapters] = useState<ChapterData[]>([
    { chapterNumber: 1, title: "", content: "", wordCount: 0, isDraft: true }
  ])

  const goBack = () => navigate("/author/home")

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onload = () => setPreviewCover(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const addChapter = () => {
    setChapters([
      ...chapters,
      {
        chapterNumber: chapters.length + 1,
        title: "",
        content: "",
        wordCount: 0,
        isDraft: true
      }
    ])
  }

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index))
  }

  const updateChapter = (index: number, field: keyof ChapterData, value: string) => {
    const updated = chapters.map((ch, i) => {
      if (i === index) {
        const updatedChapter = { ...ch, [field]: value }
        if (field === "content") {
          updatedChapter.wordCount = value.split(/\s+/).filter(Boolean).length
        }
        return updatedChapter
      }
      return ch
    })
    setChapters(updated)
  }

  const handleSaveBook = async () => {
    try {
      if (!title.trim() || !description.trim()) {
        alert("Please fill in the title and description")
        return
      }

      const bookData: BookData = {
        title,
        description,
        status,
        chapters: chapters.filter(ch => ch.title || ch.content),
        totalWordCount: chapters.reduce((acc, ch) => acc + ch.wordCount, 0)
      }

      const res = await createBook(bookData)
      const bookId = res.book._id

      // Upload cover if exists
      if (coverImage) await uploadBookCover(bookId, coverImage)

      // Update categories
      const categoryArray = categories.split(",").map(c => c.trim()).filter(Boolean)
      await updateBookCategories(bookId, categoryArray)

      alert("Book created successfully!")
      navigate(`/author/home`)

    } catch (err: any) {
      alert(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8" style={{ background: 'linear-gradient(to bottom, #020617 0%, #1e1b4b 50%, #020617 100%)' }}>
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
                Create New Book
              </h1>
              <p className="text-slate-400 mt-1">Craft your masterpiece</p>
            </div>
          </div>
          <a href="/" className="inline-flex items-center gap-2">
            <Moon className="w-8 h-8 text-yellow-400" />
            <span className="text-xl font-bold" style={{ background: 'linear-gradient(to right, #facc15, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
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
              {/* Cover Image */}
              <div className="shrink-0">
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  <Image className="w-4 h-4 inline mr-2" />
                  Cover Image
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
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2 text-slate-300">Book Title</label>
                  <input id="title" type="text" placeholder="The Secrets of the Constellations" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2 text-slate-300">Description</label>
                  <textarea id="description" placeholder="A book about finding harmony in the cosmos..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500 resize-none" />
                </div>
                <div>
                  <label htmlFor="categories" className="block text-sm font-medium mb-2 text-slate-300">Categories</label>
                  <input id="categories" type="text" placeholder="Horror, Fantasy, ..." value={categories} onChange={(e) => setCategories(e.target.value)} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500" />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-2 text-slate-300">Status</label>
                  <select id="status" value={status} onChange={(e) => setStatus(e.target.value as BookStatus)} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white cursor-pointer">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Section */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-indigo-300">Chapters</h2>
              <button onClick={addChapter} className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition transform hover:scale-105 shadow-lg flex items-center gap-2" style={{ background: 'linear-gradient(to right, #4f46e5, #9333ea)' }}>
                <Plus className="w-5 h-5" /> Add Chapter
              </button>
            </div>
            <div className="space-y-6">
              {chapters.map((chapter, index) => (
                <div key={index} className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 space-y-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-purple-300">Chapter {index + 1}</h3>
                    {chapters.length > 1 && (
                      <button onClick={() => removeChapter(index)} className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">Chapter Title</label>
                    <input type="text" placeholder={`Chapter ${index + 1} title`} value={chapter.title} onChange={(e) => updateChapter(index, "title", e.target.value)} className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white placeholder-slate-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">Chapter Content</label>
                    <textarea placeholder="Write your chapter content here..." value={chapter.content} onChange={(e) => updateChapter(index, "content", e.target.value)} rows={6} className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white placeholder-slate-500 resize-none" />
                    <p className="text-xs text-slate-500 mt-1">Word count: {chapter.content.split(/\s+/).filter(Boolean).length}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button onClick={handleSaveBook} className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition transform hover:scale-105 shadow-lg flex items-center gap-2" style={{ background: 'linear-gradient(to right, #4f46e5, #9333ea)' }}>
              <Save className="w-5 h-5" /> Save Book
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
