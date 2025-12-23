import api from "./api";

export const getBookCommentsForAuthor = async (bookId: string) => {
    try {
        const response = await api.get(`/author/book/${bookId}/comments`)
        return response.data
    } catch (error) {
        console.error("API error fetching book comments:", error)
        throw error
    }
}

export const postAuthorReply = async (bookId: string, commentId: string, replyText: string) => {
    try {
        const response = await api.post(`/author/book/${bookId}/comment/${commentId}/reply`, {
            replyText
        })
        return response.data
    } catch (error) {
        console.error("API error replying to comment:", error)
        throw error
    }
}

export const deleteAuthorReply = async (bookId: string, commentId: string) => {
    try {
        const response = await api.delete(`/author/book/${bookId}/comment/${commentId}/reply`)
        return response.data
    } catch (error) {
        console.error("API error deleting author reply:", error)
        throw error
    }
}