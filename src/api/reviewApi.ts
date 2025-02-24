import { Review } from '@/models';
import axiosClient from './axiosClient';
const reviewApi = {
    updateReviewById(idReview: string) {
        const url = `/reviews/${idReview}`;
        return axiosClient.put(url);
    },
    deleteReviewById(idReview: string) {
        const url = `/reviews/${idReview}`;
        return axiosClient.delete(url);
    },
    updateReactionById(idReview: string) {
        const url = `/reviews/update-reaction/${idReview}`;
        return axiosClient.put(url);
    },
    getAllReviewByIdUser(idUser: string) {
        const url = `/reviews/getall/users/${idUser}`;
        return axiosClient.post(url);
    },
    AddReview(data: {
        reviewTitle: string;
        reviewContent: string;
        rating: number;
        mediaUrlReview: string[];
        idService?: string;
        idShop: string;
    }) {
        const url = '/reviews';
        return axiosClient.post(url, data);
    },
    getAllReviewByIdShop(idShop: string) {
        const url = `/reviews/getall/shop/${idShop}`;
        return axiosClient.put(url);
    },
    getAllReviewByIdService(idService: string) {
        const url = `/reviews/getall/service/${idService}`;
        return axiosClient.put(url);
    },
    getAllReviewRecently() {
        const url = '/reviews/getall/recently';
        return axiosClient.put(url);
    },
};
export default reviewApi;
