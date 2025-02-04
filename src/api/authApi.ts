import { RegisterUser, User } from '@/models';
import axiosClient from './axiosClient';
const authApi = {
    register(data: RegisterUser) {
        const url = '/auth/register';
        return axiosClient.post(url, data);
    },
    login(data: { username: string; password: string }) {
        const url = '/auth/login';
        return axiosClient.post(url, data);
    },
    registerShop(data: RegisterUser) {
        const url = '/auth/register/shop';
        return axiosClient.post(url, data);
    },
    checkExitsUsername(data) {
        const url = '/auth/exists-username';
        return axiosClient.get(url);
    },
    checkExitsEmail() {
        const url = '/auth/exists-email';
        return axiosClient.get(url);
    },
    checkExitsAccount(id: string) {
        const url = '/auth/active-account';
        return axiosClient.get(url);
    },
};
export default authApi;
