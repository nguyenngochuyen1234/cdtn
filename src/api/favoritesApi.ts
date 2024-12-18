import { Favorite, User } from "@/models"
import axiosClient from "./axiosClient"
const favoritesApi = {
    getAllFavorite() {
        const url = "/favorites"
        return axiosClient.get(url)
    },
    addFavorite(data: Favorite) {
        const url = "/favorites"
        return axiosClient.post(url, data)
    },
    getFavoriteById(id: string) {
        const url = `/favorites/${id}`
        return axiosClient.get(url)
    },
    deleteFavorite(id: string) {
        const url = `/favorites/${id}`
        return axiosClient.delete(url)
    },
}
export default favoritesApi