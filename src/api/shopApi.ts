import { ParamFilterShop, StoreCreation } from '@/models';
import axiosClient from './axiosClient';
import axios from 'axios';
import { id } from 'date-fns/locale';
const shopApi = {
    uploadMultipleImage(files: File[], email: string) {
        if (files.length === 0) {
            console.error('No files selected');
            return Promise.reject('No files selected');
        }

        const url = `http://localhost:8080/shops/upload-multiple-image`;
        const formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file); // Đảm bảo key là 'files' nếu server yêu cầu như vậy
        });

        formData.append('email', email); // Thêm email vào formData

        return axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    uploadImageShop(file: File, email: string) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('email', email);
        console.log(file);
        console.log('Dữ liệu trong FormData trước khi gửi:');

        const url = 'http://localhost:8080/shops/upload-image-shop';
        return axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            },
        });
    },
    updateActiveShop(id: string) {
        const url = `/shops/update-active-shop/${id}`;
        return axiosClient.put(url, { id });
    },
    getListShopDeactive(id: string) {
        const url = `/shops/update-active-shop/${id}`;
        return axiosClient.put(url);
    },
    createShop(data: StoreCreation) {
        const url = '/shops/create-shop';
        return axiosClient.post(url, data);
    },
    getShopById(id: string) {
        const url = `/shops/${id}`;
        return axiosClient.get(url);
    },
    getAllShopService() {
        const url = '/shops/service';
        return axiosClient.get(url);
    },
    getServiceByIdShop(idShop: string, data: any) {
        const url = `/shops/list-service/${idShop}`;
        return axiosClient.post(url, data);
    },
    deleteShopService(id: string) {
        const url = `/shops/service/${id}`;
        return axiosClient.get(url);
    },
    getScoreByIdShop(id: string) {
        const url = `/shops/score/${id}`;
        return axiosClient.get(url);
    },
    getOpenTimeByIdShop(idShop: string) {
        const url = `/shops/get-open-time/${idShop}`;
        return axiosClient.get(url);
    },
    searchShop(data: ParamFilterShop) {
        const url = `/shops/search`;
        return axiosClient.post(url, data);
    },

    getShopsSuggest(data: { page: number; size: number; checkType: string }) {
        const url = `/shops/suggest`;
        return axiosClient.post(url, data);
    },

    getDetailServiceById(id: string){
        const url = `/shops/detail-service/${id}`
        return axiosClient.get(url);
    },
    getShopAds(){
        const url = "/ads/get-shop"
        return axiosClient.get(url);
    },
    getOpenTimeById(id:string){
        const url = `/shops/detail-opentime/${id}`
        return axiosClient.get(url);
    }
};
export default shopApi;
