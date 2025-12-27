import api from "./api"

export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { email: username, password })

  return res.data
}

export const register = async (firstname: string, lastname: string, email: string, password: string, role: string) => {
  const res = await api.post("/auth/register", { firstname,lastname,email, password, role })

  return res.data
}

export const getMyDetails = async () => {
  const res = await api.get("/auth/me")
  return res.data
}

export const refreshTokens = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", {
    token: refreshToken
  })
  return res.data
}

export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email })
  return response.data
}

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post(`/auth/reset-password/${token}`, { password })
  return response.data
}
