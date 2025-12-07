import { createContext, useContext, useEffect, useState } from "react"
import type { AuthContextType, UserData } from "../types"
import { fetchAllUserDetails } from "../services/user"
import { AxiosError } from "axios"

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const userData: UserData = await fetchAllUserDetails()

        console.log("Context Received Data:", userData)

        if (userData.firstName && userData.email) {
          console.log("Name and Email found! Setting User State.")
          setUser(userData)
        } else {
          console.warn("User data is missing firstName or email, setting user to null.")
          setUser(null)
        }

      } catch (err) {
        const error = err as AxiosError

        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn("Authentication failed, logging out.")
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
        } else if (error.response?.status === 404) {
          console.warn("User data not found for valid token.")
        } else {
          console.error("Error fetching user data:", error)
        }
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}