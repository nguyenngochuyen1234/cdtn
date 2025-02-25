import { User } from '@/models';
import axiosClient from './axiosClient';
import axios from 'axios';
const token = localStorage.getItem('access_token');
const userApi = {
    uploadImage(avatar: File) {
        console.log(avatar);
        const formData = new FormData();
        formData.append('file', avatar);
        const url = 'http://localhost:8080/users/upload-image';

        return axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
    },
    updateProfile(data: User) {
        const url = '/users/change-profile';
        return axiosClient.put(url, data);
    },
    changePassword() {
        const url = '/users/change-password';
        return axiosClient.put(url);
    },
    forgotPassword() {
        const url = '/users/forgot-password';
        return axiosClient.post(url);
    },
    getUserById(id: string) {
        const url = `/users/${id}`;
        return axiosClient.get(url);
    },
    getUser() {
        const url = 'users/get-user';
        return axiosClient.get(url);
    },
};
export default userApi;
