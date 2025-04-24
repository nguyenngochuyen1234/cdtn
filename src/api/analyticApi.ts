import { RegisterUser, User } from '@/models';
import axiosClient from './axiosClient';
const analyticApi = {
    countUser(data: { startDate?: Date; endDate?: Date }) {
        const url = '/analytic/count-user';
        return axiosClient.post(url, data);
    },
    countShop(data: { startDate?: Date; endDate?: Date }) {
        const url = '/analytic/count-shop';
        return axiosClient.post(url, data);
    },
    countRevenue() {
        const url = '/analytic/count-revenue';
        return axiosClient.get(url);
    },
    countReview(data: { startDate?: Date; endDate?: Date }) {
        const url = '/analytic/count-review';
        return axiosClient.post(url, data);
    },
    countReviewShop(data: { startDate?: Date; endDate?: Date }) {
        const url = '/analytic/count-review-shop';
        return axiosClient.post(url, data);
    },
    countFavoriteShop(data: { startDate?: Date; endDate?: Date }) {
        const url = '/analytic/count-favorite-shop';
        return axiosClient.post(url, data);
    },
    countViewAdsByShop() {
        const url = `/analytic/count-view-ads`;
        return axiosClient.get(url);
    },
    countAdsAndRevenue() {
        const url = `/analytic/count-ads`;
        return axiosClient.get(url);
    },
    listRevenu() {
        const url = `/analytic/list-revenue`
        return axiosClient.post(url)
    },
    listadssub() {
        const url = `/analytic/list-ads-subscription`
        return axiosClient.post(url)
    },
    listReview() {
        const url = `/analytic/list-review`
        return axiosClient.post(url)
    },
    // listadssub() {
    //     const url = `/analytic/list-ads-subscription`
    //     return axiosClient.post(url)
    // }
};
export default analyticApi;
