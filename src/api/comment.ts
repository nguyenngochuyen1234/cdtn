import axiosClient from './axiosClient';

const commentApi = {
    getCommentByIdReview(id: string) {
        const url = `comments/${id}`;
        return axiosClient.get(url);
    },

    updateComment(idComment: string, data: { content: string }) {
        const url = `owner/comments/${idComment}`;
        return axiosClient.put(url, data);
    },

    deleteComment(idComment: string) {
        const url = `owner/comments/${idComment}`;
        return axiosClient.delete(url);
    },

    getCommentsByReviewId(idReview: string) {
        const url = `owner/comments/${idReview}`;
        return axiosClient.get(url);
    },

    createComment(idReview: string, data: any) {
        const url = `owner/comments/${idReview}`;
        return axiosClient.post(url, data);
    },
};

export default commentApi;
