import api from "./api";

export const getUserLibrary = async () => {
    try {
        const response = await api.get(`/user/reading/library`);
        return response.data;
    } catch (error) {
        console.error("API error fetching user library:", error);
        throw error;
    }
}