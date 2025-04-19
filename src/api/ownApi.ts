import { Comment, Favorite, OpenTime, Service, Shop, StoreCreation, User } from '@/models';
import axiosClient from './axiosClient';
const ownerApi = {
    updateShop(data: StoreCreation) {
        const url = `/own/shop/update-shop`;
        return axiosClient.put(url, data);
    },
    updateService(id: string, data: any) {
        const url = `/own/shop/update-service/${id}`;
        return axiosClient.put(url, data);
    },
    updateOpenTime(data: OpenTime[]) {
        const url = `/own/shop/update-open-time`;
        return axiosClient.put(url, data);
    },
    createService(data: any) {
        const url = `/own/shop/create-service`;
        return axiosClient.post(url, data);
    },
    // getShopById_1(idComment: string, data: Comment) {
    //     const url = `/own/shop/${idComment}`;
    //     return axiosClient.get(url, data);
    // },
    getAllService(data: { limit: number; page: number }) {
        const url = `/own/shop/get-list-service`;
        return axiosClient.post(url, data);
    },
    getShop() {
        const url = `/own/shop/get-shop`;
        return axiosClient.get(url);
    },
    getReview(data: { limit: 12; page: 0 }) {
        const url = `/own/shop/get-review`;
        return axiosClient.post(url, data);
    },
    getListOpenTime() {
        const url = `/own/shop/get-open-time`;
        return axiosClient.get(url);
    },
    deleteService(idReview: string) {
        const url = `/own/shop/delete-service/${idReview}`;
        return axiosClient.delete(url);
    },
};
export default ownerApi;
