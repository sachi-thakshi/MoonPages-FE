import api from "./api"
import type { AuthorData, UserData } from "../types"

export const getAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard")
  return res.data
}

export const getAdmins = async (): Promise<{ success: boolean; admins: UserData[]; message?: string }> => {
  try {
    const res = await api.get("/admin")
    return { success: true, admins: res.data.admins ?? [] }
  } catch (err: any) {
    console.error("Failed to fetch admins:", err)
    return { success: false, admins: [], message: err.response?.data?.message || "Failed to fetch admins" }
  }
}

export const addAdmin = async (data: { firstName: string; lastName: string; email: string; password: string }): Promise<{ success: boolean; admin?: UserData; message?: string }> => {
  try {
    const res = await api.post("/admin", data)
    return { success: true, admin: res.data.admin }
  } catch (err: any) {
    console.error("Failed to add admin:", err)
    return { success: false, message: err.response?.data?.message || "Failed to add admin" }
  }
}

export const updateAdmin = async (adminId: string, data: { firstName: string; lastName: string; email: string }): Promise<{ success: boolean; admin?: UserData; message?: string }> => {
  try {
    const res = await api.put(`/admin/${adminId}`, data)
    return { success: true, admin: res.data.admin }
  } catch (err: any) {
    console.error("Failed to update admin:", err)
    return { success: false, message: err.response?.data?.message || "Failed to update admin" }
  }
}

export const deleteAdmin = async (adminId: string): Promise<{ success: boolean; message?: string }> => {
  try {
    await api.delete(`/admin/${adminId}`)
    return { success: true }
  } catch (err: any) {
    console.error("Failed to delete admin:", err)
    return { success: false, message: err.response?.data?.message || "Failed to delete admin" }
  }
}

export const getAuthors = async (): Promise<{ success: boolean; authors: AuthorData[]; message?: string }> => {
  try {
    const res = await api.get("/admin/authors")
    return res.data
  } catch (err: any) {
    console.error("Failed to fetch authors", err)
    return { success: false, authors: [], message: err.message }
  }
}

export const deleteAuthor = async (authorId: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await api.delete(`/admin/authors/${authorId}`)
    return res.data
  } catch (err: any) {
    console.error("Failed to delete author", err)
    return { success: false, message: err.message }
  }
}

export const getUsers = async (): Promise<{ success: boolean; users: UserData[] }> => {
  const res = await api.get("/admin/users")
  return res.data
}

export const deleteUser = async (id: string): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete(`/admin/users/${id}`)
  return res.data
}

export const getBooks = async () => {
  const res = await api.get("/admin/books")
  return res.data
}