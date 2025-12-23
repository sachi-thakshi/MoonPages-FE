import api from "./api";

export const getAuthorDashboard = async () => {
    try {
        const response = await api.get('/author/dashboard-stats');
        return response.data;
    } catch (error) {
        console.error("Error fetching author dashboard:", error);
        throw error;
    }
}

