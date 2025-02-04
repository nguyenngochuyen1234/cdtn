import axiosClient from './axiosClient';
const usersCategory = {
    getAllSuggestTag(data: { idCategory: string; keyword: string }) {
        const url = '/categories/suggest-tag';
        return axiosClient.post(url, data);
    },
    createCategory(data: { tags: string[]; idParent: string }) {
        const url = '/categories/add-cat';
        return axiosClient.post(url, data);
    },
    getAllCategories() {
        const url = '/categories';
        return axiosClient.get(url);
    },
    getDetailsCategories(id: string) {
        const url = `/categories/${id}`;
        return axiosClient.get(url);
    },
    validateTag(data: { tags: string[]; idParent: string }) {
        const url = `/categories/validate-tag`;
        return axiosClient.post(url, data);
    },
};
export default usersCategory;
