import { Comment, Favorite, Service, Shop, User } from "@/models"
import axiosClient from "./axiosClient"
const ownerApi = {
    updateShop(data: Shop) {
        const url = `/own/shop/update-shop`
        return axiosClient.put(url, data)
    },
    updateService(id: string, data: Service) {
        const url = `/own/shop/update-service/${id}`
        return axiosClient.put(url, data)
    },
    updateOpenTime(id: string, data) {
        const url = `/own/shop/update-open-time/${id}`
        return axiosClient.put(url, data)
    },
    createService(idReview: string, data: Comment) {
        const url = `/own/shop/create-service`
        return axiosClient.post(url, data)
    },
    getShopById_1(idComment: string, data: Comment) {
        const url = `/own/shop/${id}`
        return axiosClient.get(url, data)
    },
    getServiceById_1(idComment: string) {
        const url = `/own/shop/service/${id}`
        return axiosClient.get(url)
    },
    getListOpenTime_1(idReview: string) {
        const url = `/own/shop/get-open-time/${id}`
        return axiosClient.get(url)
    },
    deleteService(idReview: string, data: Comment) {
        const url = `/own/shop/delete-service/${id}`
        return axiosClient.delete(url, data)
    },
}
export default ownerApi