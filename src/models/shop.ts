export interface Shop {
    id: string;
    idUser: string;
    idCategory: string;
    name: string;
    avatar: string;
    email: string;
    isVery: boolean;
    urlWebsite: string;
    phoneNumber: string;
    listIdOpenTime: string[];
    longitude: string;
    Latitude: string;
    mediaUrls: string[];
    countReview: number;
    city: string;
    ward: string;
    district: string;
    hasAnOwner: boolean;
    type: string;
    statusShop: 'ACTIVE' | 'INACTIVE' | 'BANNED';
}
export interface StoreCreation {
    name?: string;
    avatar?: string | File;
    imageBusiness?: string | File;
    email?: string;
    mediaUrls?: string[] | File[];
    description?: string;
    urlWebsite?: string;
    openTimeRequests?: Array<{
        dayOfWeekEnum?: string;
        openTime?: string;
        closeTime?: string;
        dayOff?: boolean;
    }>;
    city?: string;
    ward?: string;
    district?: string;
    longitude?: number;
    latitude?: number;
    categoryEnum?: string;
    idCategory?: string;
    phone?: string;
    owner?: boolean;
}
