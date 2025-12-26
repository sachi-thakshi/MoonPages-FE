import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAuthors, deleteAuthor } from "../../services/admin";
import type { AuthorData } from "../../types"

export default function AuthorsManagement() {
  const [authors, setAuthors] = useState<AuthorData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuthors()
  }, [])

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await getAuthors()
      if (res.success) setAuthors(res.authors)
    } catch (err) {
      console.error("Failed to fetch authors", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAuthor = async (authorId: string) => {
    const result = await Swal.fire({
      title: "Delete Author?",
      text: "This will also remove their books!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    })

    if (!result.isConfirmed) return;

    try {
      const res = await deleteAuthor(authorId)
      if (res.success) {
        setAuthors((prev) => prev.filter((a) => a._id !== authorId))
        Swal.fire("Deleted!", "Author has been deleted.", "success")
      } else {
        Swal.fire("Error", res.message || "Failed to delete author", "error")
      }
    } catch (err) {
      console.error(err)
      Swal.fire("Error", "Failed to delete author", "error")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Authors Management</h1>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 overflow-x-auto">
        {loading ? (
          <p className="text-slate-400">Loading authors...</p>
        ) : authors.length === 0 ? (
          <p className="text-slate-400">No authors found.</p>
        ) : (
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Books</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author._id} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="px-4 py-2">{author.firstName} {author.lastName}</td>
                  <td className="px-4 py-2">{author.email}</td>
                  <td className="px-4 py-2">
                    {author.books.length === 0
                      ? "No books"
                      : author.books.map(b => b.title).join(", ")}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteAuthor(author._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
