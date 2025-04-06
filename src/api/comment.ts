import axiosClient from "./axiosClient";

const commentApi = {
    
    getCommentByIdReview(id : string) {
        const url = `comments/${id}`;
        return axiosClient.get(url);
    },
};
export default commentApi;