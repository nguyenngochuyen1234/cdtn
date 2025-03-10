export interface User {
    username?: string;
    id?: string;
    avatar?: string;
    email?: string;
    role?: ('OWNER' | 'ADMIN' | 'USER')[];
    phone?: string;
    dateOfBirth?: string;
    statusUser?: 'ACTIVE' | 'INACTIVE' | 'BANNED';
    city: string;
    district: string;
    ward: string;
    ratingUser?: number;
    quantityImage?: number;
    helpful?: number;
    notLike?: number;
    like?: number;
    firstName?: string;
    lastName?: string;
    activeCode?: string;
}

export interface UserProfile {
    phone?: string;
    city?: string;
    avatar?: string;
    ward?: string;
    district?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
}

export interface TableFilters {
    search: string;
    joinDate?: Date;
    location?: string;
    postCount?: number;
}

export interface RegisterUser {
    username?: string;
    password: string;
    email: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    dateOfBirth?: string;
    ward?: string;
    district?: string;
}
