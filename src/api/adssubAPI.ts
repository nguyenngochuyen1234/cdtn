import { PaginationAdvertisementRequest } from "./adsApi";
import axiosClient from "./axiosClient";
export interface CreateSubADS{
    idAdvertisement: string,
    amount: number
}
export interface Panigation {
    limit: number;           // Số lượng item mỗi trang
    page: number;            // Trang hiện tại (bắt đầu từ 0)
    sort?: string;           // Sắp xếp theo trường nào đó
    keyword?: string;        // Từ khóa tìm kiếm
  }
const adsSubAPI = {
    getAllAdsVertisement(data:  PaginationAdvertisementRequest) {
        const url = '/own/ads/list-ads';
        return axiosClient.post(url, data);
    },
    getAdsById(id: string) {
        const url = `/cms/ads/${id}`;
        return axiosClient.get(url);
    },
    createAds(data: CreateSubADS){
        const url = `/pay/create-payment`
        return axiosClient.post(url, data)
    },
    getListHistory(data: Panigation){
        const url = `/pay/history`
        return axiosClient.post(url, data)
    },
    getAdsOwner(id:string ){
        const url = `/own/ads/${id}`
        return axiosClient.get(url)
    },
    getAddSub(body: Panigation){
        const url = `/own/sub/list-adssub`
        return axiosClient.post(url, body)
    }
}
export default adsSubAPI