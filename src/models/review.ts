import { User } from './user';

export interface Review {
    dateReview: string | number | Date;
    id: string;
    idService: string;
    idUser: string;
    createAt: Date;
    updatedAt: Date;
    reviewTitle: string;
    reviewContent: string;
    rating: number;
    mediaUrlReview: string[];
    like: number;
    helpful: number;
    notlike: number;
    idShop: string;
    isEdit: boolean;
    userReviewInfo: User;
}

export interface Comment {
    id: string;
    idShop: string;
    content: string;
    idReview: string;
    isComment: boolean;
    idUser: string;
}
