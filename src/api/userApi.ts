import axiosClient from './axiosClient';
const userApi = {
    uploadImage() {
        const url = '/users/upload-image';
        return axiosClient.put(url);
    },
    updateProfile(data) {
        const url = '/users/change-profile';
        return axiosClient.put(url);
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
