import { Comment, Favorite, User } from "@/models"
import axiosClient from "./axiosClient"
const ownerApi = {
    updateComment(idComment: string, data: Comment) {
        const url = `/owner/comments/${idComment}`
        return axiosClient.put(url, data)
    },
    deleteComment(idComment: string) {
        const url = `/owner/comments/${idComment}`
        return axiosClient.delete(url)
    },
    getByIdReview(idReview: string) {
        const url = `/owner/comments/${idReview}`
        return axiosClient.get(url)
    },
    addComment(idReview: string, data: Comment) {
        const url = `/owner/comments/${idReview}`
        return axiosClient.post(url, data)
    },
}
export default ownerApi