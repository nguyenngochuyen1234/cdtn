import { RegisterUser, User } from '@/models';
import axiosClient from './axiosClient';
const analyticApi = {
    countUser(data: { startDate: Date; endDate: Date }) {
        const url = '/analytic/count-user';
        return axiosClient.post(url, data);
    },
    countShop(data: { startDate: Date; endDate: Date }) {
        const url = '/analytic/count-shop';
        return axiosClient.post(url, data);
    },
    countReview(data: { startDate: Date; endDate: Date }) {
        const url = '/analytic/count-review';
        return axiosClient.post(url, data);
    },
    countReviewShop(data: { startDate: Date; endDate: Date }) {
        const url = '/analytic/count-review-shop';
        return axiosClient.post(url, data);
    },
    countFavoriteShop(data: { startDate: Date; endDate: Date }) {
        const url = '/analytic/count-favorite-review';
        return axiosClient.post(url, data);
    },
};
export default analyticApi;
