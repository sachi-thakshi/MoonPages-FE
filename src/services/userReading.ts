import api from './api'

interface HighlightPayload {
    chapterNumber: number
    text: string
    startOffset: number
    endOffset: number
}

interface CommentPayload {
    content: string
    chapterNumber?: number
}

export const getUserBookData = async (bookId: string) => {
    try {
        const response = await api.get(`/user/reading/data/${bookId}`)
        return response.data
    } catch (error) {
        console.error("API error fetching user book data:", error)
        throw error
    }
}

export const updateBookmark = async (bookId: string, chapterNumber: number | null) => {
    try {
        const response = await api.patch(`/user/reading/bookmark/${bookId}`, { chapterNumber })
        return response.data
    } catch (error) {
        console.error("API error updating bookmark:", error)
        throw error
    }
}

export const addHighlight = async (bookId: string, payload: HighlightPayload) => {
    try {
        const response = await api.post(`/user/reading/highlight/${bookId}`, payload)
        return response.data
    } catch (error) {
        console.error("API error adding highlight:", error)
        throw error
    }
}

export const deleteHighlight = async (bookId: string, highlightId: string) => {
    try {
        const response = await api.delete(`/user/reading/highlight/${bookId}/${highlightId}`)
        return response.data
    } catch (error) {
        console.error("API error deleting highlight:", error)
        throw error
    }
}

export const addComment = async (bookId: string, payload: CommentPayload) => {
    try {
        const response = await api.post(`/user/reading/comment/${bookId}`, payload)
        return response.data
    } catch (error) {
        console.error("API error adding comment:", error)
        throw error
    }
}

export const deleteComment = async (bookId: string, commentId: string) => {
    try {
        const response = await api.delete(`/user/reading/comment/${bookId}/${commentId}`)
        return response.data
    } catch (error) {
        console.error("API error deleting comment:", error)
        throw error
    }
}