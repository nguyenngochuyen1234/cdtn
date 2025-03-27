import { Boolean2 } from './../../node_modules/reselect/src/types';
import { Category, Tag, User } from '@/models';
import axiosClient from './axiosClient';
const cmsApi = {
    blockShopById(id: string) {
        const url = `/cms/shops/block-shop/${id}`;
        return axiosClient.put(url, { id });
    },
    activeShop(idShop: string) {
        const url = `/cms/shops/active-shop/${idShop}`;
        return axiosClient.put(url, { idShop });
    },

    getDetailsCategories(id: string) {
        const url = `/cms/categories/${id}`;
        return axiosClient.get(url);
    },
    getAllCategories() {
        const url = '/cms/categories';
        return axiosClient.get(url);
    },
    updateCategory(data: Category) {
        const url = `/cms/categories/${data.parentId}`;
        return axiosClient.put(url, data);
    },
    updateTags(idCategory: string, tags: string[]) {
        const url = `/cms/categories/add-tags`;
        return axiosClient.put(url, {
            idCategory: idCategory,
            tags: tags,
            delete: true,
        });
    },
    deleteCategory(id: string) {
        const url = `/cms/categories/${id}`;
        return axiosClient.delete(url);
    },
    deleteTag(id: string, tags: string[]) {
        const url = `/cms/categories/delete-tags`;
        return axiosClient.post(url, {
            idCategory: id,
            tags: tags,
        });
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
    getAllListUser(query: { limit: number; page: number; sort: string; keyword: string }) {
        const url = `/cms/users/list-user`;
        return axiosClient.post(url, query);
    },
    blockUser(id: string) {
        const url = `/cms/users/block-user/${id}`;
        return axiosClient.put(url, { id });
    },
};
export default cmsApi;
