import axiosClient from "./axiosClient"
const userApi = {
    uploadMultipeImage() {
        const url = "/shops/upload-multiple-image"
        return axiosClient.put(url)
    },
    uploadImageShop() {
        const url = "/shops/upload-image-shop"
        return axiosClient.put(url)
    },
    updateActiveShop(id: string) {
        const url = `/shops/update-active-shop/${id}`
        return axiosClient.put(url)
    },
    createShop() {
        const url = "/shops/create-shop"
        return axiosClient.post(url)
    },
    getShopById(id: string) {
        const url = `/shops/${id}`
        return axiosClient.get(url)
    },
    getAllShopService() {
        const url = "/shops/service"
        return axiosClient.get(url)
    },
    deleteShopService(id: string) {
        const url = `/shops/service/${id}`
        return axiosClient.get(url)
    },
    getScoreByIdShop(id: string) {
        const url = `/shops/score/${id}`
        return axiosClient.get(url)
    },
    getOpenTimeByIdShop(idShop: string) {
        const url = `/shops/get-open-time/${idShop}`
        return axiosClient.get(url)
    },
}
export default userApi