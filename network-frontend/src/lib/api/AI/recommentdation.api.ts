import { Recommendation } from "@/types/recommentdation";
import axiosClient from "../axiosClient";

export const recommendationApi = {
    getRecommendations: (): Promise<Recommendation[]> => {
        return axiosClient
            .get("/recommendations/me")
            .then((res) => res.data);
    },

    syncRecommendations: (
        userId: string,
        algorithm = "common_neighbors",
        topN = 5
    ): Promise<Recommendation[]> => {
        console.log("+ 1 lần call api /Recommendations/${userId}/recommendations/sync ")
        return axiosClient
            .post(`/Recommendations/${userId}/recommendations/sync`, null, {
                params: { algorithm, top_n: topN },
            })
            .then((res) => res.data);
    },

    removeById: (recommendationId: string): Promise<{ message: string }> => {
        return axiosClient
            .delete(`/recommendations/${recommendationId}`)
            .then((res) => res.data);
    },
};