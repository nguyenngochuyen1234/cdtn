import axiosClient from './axiosClient';
export interface PaginationAdvertisementRequest {
    limit: number; // Số lượng item mỗi trang
    page: number; // Trang hiện tại (bắt đầu từ 0)
    sort?: string; // Sắp xếp theo trường nào đó
    keyword?: string; // Từ khóa tìm kiếm
    status?: string; // Trạng thái lọc
}
export interface CreateAds {
    name: string;
    description: string;
    price: number;
    advertisementTypeEnum: 'STANDARD' | 'PREMIUM' | 'VIP';
    thumbnail: string;
    duration: string;
}

const adsApi = {
    getAllAdsvertisement(data: PaginationAdvertisementRequest) {
        const url = '/cms/ads';
        return axiosClient.post(url, data);
    },
    getAdsById(id: string) {
        const url = `/cms/ads/${id}`;
        return axiosClient.get(url);
    },
    createAds(data: CreateAds) {
        const url = `/cms/ads/create-advertisement`;
        return axiosClient.post(url, data);
    },
    updateAds(data: CreateAds, id: string) {
        const url = `/cms/ads/update/${id}`;
        return axiosClient.put(url, data);
    },
    deActive(id: string) {
        const url = `/cms/ads/deactive-ads/${id}`;
        return axiosClient.put(url);
    },
    activeAds(id: string) {
        const url = `/cms/ads/active-ads/${id}`;
        return axiosClient.put(url);
    },
};
export default adsApi;
