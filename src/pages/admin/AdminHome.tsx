import { useAuth } from "../../context/authContext"
import { useNavigate } from 'react-router-dom'
import { 
  Users, BookOpen, ShieldCheck, 
  Settings, UserCheck, LayoutDashboard, 
} from "lucide-react"
import { getAdminDashboard } from "../../services/admin"
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function AdminHome() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    users: 0,
    authors: 0,
    books: 0,
    admins: 0,
  })

  const [loading, setLoading] = useState(true)

  const pieData = [
    { name: "Users", value: stats.users ?? 0 },
    { name: "Authors", value: stats.authors ?? 0 },
    { name: "Books", value: stats.books ?? 0 },
    { name: "Admins", value: stats.admins ?? 0 },
  ]

  const COLORS = ["#3B82F6", "#A78BFA", "#10B981", "#EF4444"]

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAdminDashboard()
        if (res.success) {
          setStats(res.stats)
        }
      } catch (err) {
        console.error("Admin dashboard fetch failed", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const menuItems = [
    { title: "Author Management", icon: <UserCheck />, path: "/admin/authors", color: "from-purple-600 to-indigo-600" },
    { title: "User Management", icon: <Users />, path: "/admin/users", color: "from-blue-600 to-cyan-600" },
    { title: "Book Management", icon: <BookOpen />, path: "/admin/books", color: "from-emerald-600 to-teal-600" },
    { title: "Admin Management", icon: <ShieldCheck />, path: "/admin/add-admin", color: "from-orange-600 to-red-600" },
    { title: "Account Settings", icon: <Settings />, path: "/admin/settings", color: "from-slate-600 to-slate-800" },
  ]
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">{user?.firstName || "User"} !</span>
        </h1>
        <p className="text-slate-400">Your control center for smooth operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard title="Total Users" value={stats.users} icon={<Users />} color="blue" loading={loading}/>
        <StatCard title="Total Authors" value={stats.authors} icon={<UserCheck />} color="purple" loading={loading}/>
        <StatCard title="Total Books" value={stats.books} icon={<BookOpen />} color="emerald" loading={loading}/>
        <StatCard title="Admins" value={stats.admins} icon={<ShieldCheck />} color="red" loading={loading}/>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="w-full h-100 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={(entry) => entry.name}
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => Number(value ?? 0).toLocaleString()} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <LayoutDashboard className="text-yellow-400" /> 
            Administrative Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="relative group overflow-hidden bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500 transition-all text-left"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${item.color} opacity-5 group-hover:opacity-20 transition-opacity blur-2xl`} />
                
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                  {item.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm">Access and manage {item.title.toLowerCase()}</p>
              </button>
            ))}
        </div>
    </div>
  )
}

function StatCard({ title, value, icon, color, loading }: any) {
  const colorMap: any = {
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    red: "text-red-400 bg-red-400/10 border-red-400/20",
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
      </div>

      <div className="text-2xl font-bold">
        {loading || value === undefined ? "—" : Number(value).toLocaleString()}
      </div>

      <div className="text-sm text-slate-500">{title}</div>
    </div>
  )
}

