import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { getAdmins, addAdmin, updateAdmin, deleteAdmin } from "../../services/admin"
import type { UserData } from "../../types"

const MySwal = withReactContent(Swal)

export default function AdminsManagement() {
  const [admins, setAdmins] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const res = await getAdmins() 
      if (res.success) setAdmins(res.admins)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "Add New Admin",
      html:
        '<input id="swal-firstName" class="swal2-input" placeholder="First Name">' +
        '<input id="swal-lastName" class="swal2-input" placeholder="Last Name">' +
        '<input id="swal-email" class="swal2-input" placeholder="Email">' +
        '<input id="swal-password" type="password" class="swal2-input" placeholder="Password">',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const firstName = (document.getElementById("swal-firstName") as HTMLInputElement).value
        const lastName = (document.getElementById("swal-lastName") as HTMLInputElement).value
        const email = (document.getElementById("swal-email") as HTMLInputElement).value
        const password = (document.getElementById("swal-password") as HTMLInputElement).value
        if (!firstName || !lastName || !email || !password) {
          Swal.showValidationMessage("All fields are required")
          return
        }
        return { firstName, lastName, email, password }
      }
    })

    if (!formValues) return

    try {
      const res = await addAdmin(formValues)
      if (res.success) {
        setAdmins(prev => [...prev, res.admin!]) 
        Swal.fire("Success", "New admin added successfully", "success")
      } else {
        Swal.fire("Error", res.message || "Failed to add admin", "error")
      }
    } catch (err) {
      console.error(err)
      Swal.fire("Error", "Failed to add admin", "error")
    }
  }

  const handleEditAdmin = async (admin: UserData) => {
    const { value: formValues } = await MySwal.fire({
      title: "Edit Admin",
      html:
        `<input id="swal-firstName" class="swal2-input" placeholder="First Name" value="${admin.firstName}">` +
        `<input id="swal-lastName" class="swal2-input" placeholder="Last Name" value="${admin.lastName}">` +
        `<input id="swal-email" class="swal2-input" placeholder="Email" value="${admin.email}">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const firstName = (document.getElementById("swal-firstName") as HTMLInputElement).value
        const lastName = (document.getElementById("swal-lastName") as HTMLInputElement).value
        const email = (document.getElementById("swal-email") as HTMLInputElement).value
        if (!firstName || !lastName || !email) {
          Swal.showValidationMessage("All fields are required")
          return
        }
        return { firstName, lastName, email }
      }
    })

    if (!formValues) return

    try {
      const res = await updateAdmin(admin._id, formValues)
      if (res.success) {
        setAdmins(prev => prev.map(a => a._id === admin._id ? res.admin! : a))
        Swal.fire("Success", "Admin updated successfully", "success")
      } else {
        Swal.fire("Error", res.message || "Failed to update admin", "error")
      }
    } catch (err) {
      console.error(err)
      Swal.fire("Error", "Failed to update admin", "error")
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    const result = await Swal.fire({
      title: "Delete Admin?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444"
    })

    if (!result.isConfirmed) return

    try {
      const res = await deleteAdmin(adminId)
      if (res.success) {
        setAdmins(prev => prev.filter(a => a._id !== adminId))
        Swal.fire("Deleted!", "Admin has been deleted.", "success")
      } else {
        Swal.fire("Error", res.message || "Failed to delete admin", "error")
      }
    } catch (err) {
      console.error(err)
      Swal.fire("Error", "Failed to delete admin", "error")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admins Management</h1>
        <button
          onClick={handleAddAdmin}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
        >
          + Add Admin
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 overflow-x-auto">
        {loading ? (
          <p className="text-slate-400">Loading admins...</p>
        ) : admins.length === 0 ? (
          <p className="text-slate-400">No admins found.</p>
        ) : (
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Roles</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin._id} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="px-4 py-2">{admin.firstName} {admin.lastName}</td>
                  <td className="px-4 py-2">{admin.email}</td>
                  <td className="px-4 py-2">{admin.roles.join(", ")}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEditAdmin(admin)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
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
