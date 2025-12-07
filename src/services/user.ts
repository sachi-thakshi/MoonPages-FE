import api from "./api" 
import type { UserData } from "../types"; 

interface UserUpdatePayload {
    firstName: string
    lastName: string
    email: string
}

interface UserResponse {
    success: boolean
    message: string
    user: UserData // updated user object
}

interface UserDetailsResponse {
    message: string
    data: UserData
}

export const fetchAllUserDetails = async () => {
    const response = await api.get<UserDetailsResponse>("/user/details")
    return response.data.data 
}

export const updateUserDetails = async (updates: UserUpdatePayload) => {
    const response = await api.put<UserResponse>("/user/update", updates)
    return response.data.user 
}

export const uploadProfilePicture = async (file: File) => {
    const formData = new FormData()
    formData.append("profilePic", file) 

    const response = await api.post<UserResponse>("/user/upload-profile", formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        }
    })
    return response.data.user 
}

export const deleteUserAccount = async () => {
    const response = await api.delete<{ success: boolean; message: string }>("/user/delete")
    return response.data.message
}