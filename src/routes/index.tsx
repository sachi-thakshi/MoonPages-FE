import { lazy, Suspense, type ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../context/authContext"
import type { Role } from "../types"

const Index = lazy(() => import("../pages"))
const Login = lazy(() => import("../pages/Login"))
const Register = lazy(() => import("../pages/Register"))

const UserHome = lazy(() => import("../pages/user/UserHome"))
const UserSettings = lazy(() => import("../pages/user/UserSettings"))
const AllBooks = lazy(() => import("../pages/user/AllBoooks"))
const Book = lazy(() => import("../pages/user/Book"))

const AdminHome = lazy(() => import("../pages/admin/AdminHome"))
const AdminUsers = lazy(() => import("../pages/admin/Users"))
const AdminAdmins = lazy(() => import("../pages/admin/Admins"))
const AdminBooks = lazy(() => import("../pages/admin/Books"))
const AdminAuthors = lazy(() => import("../pages/admin/Authors"))
const AdminDiscussions = lazy(() => import("../pages/admin/Discussions"))
const AdminAnalytics = lazy(() => import("../pages/admin/Analytics"))
const AdminSettings = lazy(() => import("../pages/admin/Settings"))
const AdminLayout = lazy(() => import("../pages/admin/AdminLayout"))


const AuthorHome = lazy(() => import("../pages/author/AuthorHome"))
const CreateBook = lazy(() => import("../pages/author/CreateBook"))
const BookReader = lazy(() => import("../pages/author/BookReader"))
const EditBook = lazy(() => import("../pages/author/EditBook"))
const AuthorSettings = lazy(() => import("../pages/author/AuthorSettings"))

const ROLES = {
    ADMIN: "ADMIN" as Role,
    AUTHOR: "AUTHOR" as Role,
    USER: "USER" as Role
}

type RequireAuthTypes = { children: ReactNode, roles?: Role[] }

const RequireAuth = ({ children , roles} : RequireAuthTypes) => {
  const  {user, loading} = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace/>
  }

  if (roles && !roles.some((role) => (user.roles as Role[])?.includes(role))) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    )
      
  }
  
  return <>{ children }</>
}

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/user/home"
            element={
              <RequireAuth roles={[ROLES.USER]}>
                <UserHome />
              </RequireAuth>
            }
          />
          <Route
            path="/user/settings"
            element={
              <RequireAuth roles={[ROLES.USER]}>
                <UserSettings />
              </RequireAuth>
            }
          />
          <Route
            path="/user/all-books"
            element={
              <RequireAuth roles={[ROLES.USER]}>
                <AllBooks />
              </RequireAuth>
            }
          />
          <Route
            path="/user/book/:bookId"
            element={
              <RequireAuth roles={[ROLES.USER]}>
                <Book />
              </RequireAuth>
            }
          />
          
          <Route
            path="/author/home"
            element={
              <RequireAuth roles={[ROLES.AUTHOR]}>
                <AuthorHome />
              </RequireAuth>
            }
          />
          <Route
            path="/author/book/:bookId"
            element={
              <RequireAuth roles={[ROLES.AUTHOR]}>
                <BookReader />
              </RequireAuth>
            }
          />
          <Route
            path="/author/create-book"
            element={
              <RequireAuth roles={[ROLES.AUTHOR]}>
                <CreateBook />
              </RequireAuth>
            }
          />
          <Route
            path="/author/book/:bookId/edit"
            element={
              <RequireAuth roles={[ROLES.AUTHOR]}>
                <EditBook />
              </RequireAuth>
            }
          />
          <Route
            path="/author/settings"
            element={
              <RequireAuth roles={[ROLES.AUTHOR]}>
                <AuthorSettings />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/*"
            element={
              <RequireAuth roles={[ROLES.ADMIN]}>
                <AdminLayout />   {/* shared sidebar + top bar */}
              </RequireAuth>
            }
          >
            <Route path="home" element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="admins" element={<AdminAdmins />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="authors" element={<AdminAuthors />} />
            <Route path="discussions" element={<AdminDiscussions />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />

            {/* default redirect */}
            <Route index element={<Navigate to="home" replace/>} />
          </Route>

          <Route path="*" element={
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-2">404 Not Found</h2>
                    <p>The page you are looking for does not exist.</p>
                </div>
          }/>  
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
