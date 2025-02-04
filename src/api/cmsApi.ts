import { Boolean2 } from './../../node_modules/reselect/src/types';
import { Category, Tag, User } from '@/models';
import axiosClient from './axiosClient';
const cmsApi = {
    blockShopById(idShop: string) {
        const url = `/cms/shops/block-shop/${idShop}`;
        return axiosClient.put(url);
    },
    activeShop() {
        const url = '/cms/shops/active-shop';
        return axiosClient.put(url);
    },
    getDetailsCategories(id: string) {
        const url = `/cms/categories/${id}`;
        return axiosClient.get(url);
    },
    getAllCategories() {
        const url = '/cms/categories';
        return axiosClient.get(url);
    },
    deleteCategory(id: string) {
        const url = `/cms/categories/${id}`;
        return axiosClient.delete(url);
    },
    getAllListShopDeactive(data: { page: number; size: number; deActive: boolean }) {
        const url = '/cms/shops/list-shop-deactive';
        return axiosClient.post(url, data);
    },
    addCategories(data: Category) {
        const url = '/cms/categories';
        return axiosClient.post(url, data);
    },
    addTag(data: Tag) {
        const url = '/cms/categories/add-tags';
        return axiosClient.put(url, data);
    },
    getDetailsShop(id: string) {
        const url = `/cms/shops/${id}`;
        return axiosClient.get(url);
    },
    getAllServiceByIdShop(idShop: string) {
        const url = `/cms/shops/service/${idShop}`;
        return axiosClient.get(url);
    },
    getAllOpenTimeByIdShop(id: string) {
        const url = `/cms/shops/get-open-time/${id}`;
        return axiosClient.get(url);
    },
};
export default cmsApi;
