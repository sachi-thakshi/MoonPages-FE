import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-linear-to-b from-slate-950 via-indigo-950 to-slate-950 text-white">
        <AdminSidebar />
        <main className="flex-1 p-8">
            <Outlet />
        </main>
    </div>
  )
}
