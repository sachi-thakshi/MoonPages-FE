import api from "./api"

export const generateOverview = async (bookDescription: string, maxToken: number): Promise<string> => {
    try {
        const response = await api.post("/ai/generate", {
            text: bookDescription,
            maxToken: maxToken
        })
        
        return response.data.data
        
    } catch (error: any) {
        console.error("AI Generation failed:", error)
        
        throw new Error("Failed to generate AI overview.")
    }
}
