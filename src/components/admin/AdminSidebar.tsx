import { NavLink, useNavigate } from "react-router-dom"
import {
  Moon,
  Settings,
  ShieldPlus,
  Users,
  UserCog,
  BookOpen,
  LogOut,
  Home
} from "lucide-react"
import { useAuth } from "../../context/authContext"

export default function AdminSidebar() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("accessToken")
    navigate("/login")
  }

  const linkClass = ({ isActive }: any) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition 
     ${isActive
       ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
       : "text-slate-300 hover:bg-slate-800"
     }`

  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-indigo-900/30 relative">
      
      {/* Logo */}
      <div className="px-6 py-5 border-b border-indigo-900/30 mt-6">
        <div className="flex items-center gap-2">
          <Moon className="w-10 h-10 text-yellow-400" />
          <span className="text-2xl font-bold bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            MoonPages
          </span>
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center text-center py-6 border-b border-indigo-900/20 mt-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-indigo-500/40 mb-3">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold">
              {user?.firstName?.[0]?.toUpperCase() || "A"}
            </div>
          )}
        </div>

        <h3 className="font-semibold">{user?.firstName || "Admin"}</h3>
        <span className="text-xs mt-1 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 mb-3">
          ADMIN
        </span>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 mt-2">
        <NavLink to="/admin/home" className={linkClass}>
          <Home className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink to="/admin/settings" className={linkClass}>
          <Settings className="w-5 h-5" />
          Account Settings
        </NavLink>

        <NavLink to="/admin/admins" className={linkClass}>
          <ShieldPlus className="w-5 h-5" />
          Admins
        </NavLink>

        <NavLink to="/admin/authors" className={linkClass}>
          <UserCog className="w-5 h-5" />
          Authors
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <Users className="w-5 h-5" />
          Users
        </NavLink>

        <NavLink to="/admin/books" className={linkClass}>
          <BookOpen className="w-5 h-5" />
          Books
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 w-full px-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-600/10 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
