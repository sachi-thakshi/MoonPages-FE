import api from "./api"

export interface ChapterData {
  chapterNumber: number
  title: string
  content: string
  wordCount: number
  isDraft: boolean
}

export interface BookData {
  _id?: string
  title: string
  description: string
  categories: string[]
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  chapters: ChapterData[]
  coverImageUrl?: string
  totalWordCount?: number
}

export const createBook = async (bookData: Partial<BookData>) => {
  const res = await api.post("/books", bookData)
  return res.data
}

export const getAuthorBooks = async (page = 1, limit = 10) => {
  const res = await api.get(`/books?page=${page}&limit=${limit}`)
  return res.data
}

export const getBookById = async (bookId: string) => {
  const res = await api.get(`/books/${bookId}`)
  return res.data
}

export const addChapter = async (bookId: string) => {
  const newChapter = {
    title: "New Chapter",
    content: "",
    isDraft: true
  }
  const res = await api.post(`/books/${bookId}/chapter`, newChapter)
  return res.data
}

export const getChapter = async (bookId: string, chapterNumber: number) => {
  const res = await api.get(`/books/chapter/${bookId}/${chapterNumber}`)
  return res.data 
}

export const updateChapter = async (bookId: string, chapterNumber: number, data: Partial<ChapterData>) => {
  const res = await api.patch(`/books/chapter/${bookId}/${chapterNumber}`, data)
  return res.data 
}

export const uploadBookCover = async (bookId: string, file: File) => {
  const formData = new FormData()
  formData.append("bookCover", file)
  const res = await api.post(`/books/${bookId}/cover`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const updateBookCategories = async (bookId: string, categories: string[]) => {
  const res = await api.patch(`/books/${bookId}/categories`, { categories })
  return res.data
}

export const updateBook = async (bookId: string, data: Partial<BookData>) => {
  const res = await api.patch(`/books/${bookId}`, data)
  return res.data
}

export const updateBookStatus = async (bookId: string, newStatus: string) => {
    try {
        const response = await api.patch(`/books/${bookId}/status`, { status: newStatus })
        
        return response.data.status 
    } catch (error) {
        console.error("Update book status API error:", error)
        throw error
    }
}

export const deleteBook = async (bookId: string) => {
    try {
        const response = await api.delete(`/books/${bookId}`) 
        return response.data
    } catch (error) {
        console.error("Delete book API error:", error)
        throw error
    }
}
