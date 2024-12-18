import { User } from "@/models"
import axiosClient from "./axiosClient"
const categoriesApi = {
    getAllCategories() {
        const url = "/categories"
        return axiosClient.get(url)
    },
    getDetailCategories(id: string) {
        const url = `/categories/${id}`
        return axiosClient.get(url)
    },
}
export default categoriesApi