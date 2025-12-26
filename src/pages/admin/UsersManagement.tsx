import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { getUsers, deleteUser } from "../../services/admin"
import type { UserData } from "../../types"

export default function UsersManagement() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await getUsers()
      if (res.success) setUsers(res.users)
    } catch (err) {
      console.error("Failed to fetch users:", err)
      Swal.fire("Error", "Failed to fetch users", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    })

    if (!result.isConfirmed) return

    try {
      const res = await deleteUser(userId)
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId))
        Swal.fire("Deleted!", "User has been deleted.", "success")
      } else {
        Swal.fire("Error", res.message || "Failed to delete user", "error")
      }
    } catch (err) {
      console.error(err)
      Swal.fire("Error", "Failed to delete user", "error")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 overflow-x-auto">
        {loading ? (
          <p className="text-slate-400">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-slate-400">No users found.</p>
        ) : (
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Roles</th>
                <th className="px-4 py-2">Profile</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.roles.join(", ")}</td>
                  <td className="px-4 py-2">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt="Profile" className="w-10 h-10 rounded-full"/>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
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
  )
}
