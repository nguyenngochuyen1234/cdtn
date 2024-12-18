import { Category, User } from "@/models"
import axiosClient from "./axiosClient"
const cmsApi = {
    blockShopById(idShop: string) {
        const url = `/cms/shops/block-shop/${idShop}`
        return axiosClient.put(url)
    },
    activeShop() {
        const url = "/cms/shops/active-shop"
        return axiosClient.put(url)
    },
    getDetailsCategories(id: string) {
        const url = `/cms/categories/${id}`
        return axiosClient.get(url)
    },
    getAllCategories() {
        const url = "/cms/categories"
        return axiosClient.get(url)
    },
    addCategories(data: Category) {
        const url = "/cms/categories"
        return axiosClient.post(url, data)
    },
    getDetailsShop(id: string) {
        const url = `/cms/shops/${id}`
        return axiosClient.get(url)
    },
    getAllServiceByIdShop(idShop: string) {
        const url = `/cms/shops/service/${idShop}`
        return axiosClient.get(url)
    },
    getAllOpenTimeByIdShop(id: string) {
        const url = `/cms/shops/get-open-time/${id}`
        return axiosClient.get(url)
    },
}
export default cmsApi