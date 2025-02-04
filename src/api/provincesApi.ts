import { PROVINCE_API } from '@/common';
import axios from 'axios';
const provincesApi = {
    getProvince() {
        const url = `${PROVINCE_API}`;
        return axios.get(url);
    },
    getDistrict(provinceCode: string) {
        const url = `${PROVINCE_API}p/${provinceCode}?depth=2`;
        return axios.get(url);
    },
    getWard(districtCode: string) {
        const url = `${PROVINCE_API}d/${districtCode}?depth=2`;
        return axios.get(url);
    },
};
export default provincesApi;
