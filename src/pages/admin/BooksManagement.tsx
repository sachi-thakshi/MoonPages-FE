import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { getBooks } from "../../services/admin"
import type { IBookData } from "../../types"

export default function BooksManagement() {
  const [books, setBooks] = useState<IBookData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getBooks()
      if (res.success) setBooks(res.books)
    } catch (err) {
      console.error("Failed to fetch books:", err)
      Swal.fire("Error", "Failed to fetch books", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Books Management</h1>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 overflow-x-auto">
        {loading ? (
          <p className="text-slate-400">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-slate-400">No books found.</p>
        ) : (
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Total Words</th>
                <th className="px-4 py-2">Categories</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.authorName}</td>
                  <td className="px-4 py-2">{book.status}</td>
                  <td className="px-4 py-2">{book.totalWordCount}</td>
                  <td className="px-4 py-2">{book.categories.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
