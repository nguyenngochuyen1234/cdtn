import { Favorite, User } from "@/models"
import axiosClient from "./axiosClient"
const favoritesApi = {
    getAllFavorite(sort = "createdAt", page = 1, limit = 12) {
        const url = `/favorites?sort=${sort}&page=${page}&limit=${limit}`;
        return axiosClient.get(url);
    },
    addFavorite(data: any) {
        const url = "/favorites"
        return axiosClient.post(url, data)
    },
    getFavoriteById(id: string) {
        const url = `/favorites/${id}`
        return axiosClient.get(url)
    },
    deleteFavorite(data : any) {
        const url = `/favorites`
        return axiosClient.delete(url, {
            data: data // Truyền body trong config object
        })
    },
}
export default favoritesApi