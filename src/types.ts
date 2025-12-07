export type Role = "ADMIN" | "AUTHOR" | "USER"

export interface UserData {
    _id: string; 
    
    firstName: string
    lastName: string
    email: string
    profilePic: string
    
    roles: Role[]
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

export interface AuthContextType {
    user: UserData | null
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>
    loading: boolean
}