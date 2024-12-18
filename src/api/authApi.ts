import { User } from "@/models"
import axiosClient from "./axiosClient"
const authApi = {
    register(data: User) {
        const url = "/auth/register"
        return axiosClient.post(url, data)
    },
    login(data) {
        const url = "/auth/login"
        return axiosClient.post(url, data)
    },
    checkExitsUsername(data) {
        const url = "/auth/exists-username"
        return axiosClient.get(url)
    },
    checkExitsEmail() {
        const url = "/auth/exists-email"
        return axiosClient.get(url)
    },
    checkExitsAccount(id: string) {
        const url = "/auth/active-account"
        return axiosClient.get(url)
    },
}
export default authApi