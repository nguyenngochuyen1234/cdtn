import { StoreCreation } from '@/models';
import axiosClient from './axiosClient';
import axios from 'axios';
const shopApi = {
    uploadMultipeImage(files: File[], email: string) {
        const url = `http://localhost:8080/shops/upload-multiple-image`;
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        return axios.put(
            url,
            { files: formData, email: email },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    },
    uploadImageShop(file: File, email: string) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('email', email);
        console.log(file);
        console.log('Dữ liệu trong FormData trước khi gửi:');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const url = '/shops/upload-image-shop';
        return axiosClient.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateActiveShop(id: string) {
        const url = `/shops/update-active-shop/${id}`;
        return axiosClient.put(url);
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
};
export default shopApi;
