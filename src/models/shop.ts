export interface Shop {
    point?: number;
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
    categoryResponse: { tags: string[] };
    price: number;
    statusShop: 'ACTIVE' | 'INACTIVE' | 'BANNED';
}
export interface OpenTime {
    id: string;
    dayOfWeekEnum: string;
    openTime: string;
    closeTime: string;
    dayOff: boolean;
}
export interface ParamFilterShop {
    keyword?: string;
    categoryId?: string[];
    openTimeId?: string[];
    scoreReview?: 0;
    city?: string;
    district?: string;
    latitude?: 0;
    longitude?: 0;
    distance?: 0;
    sortField?: string;
    sortOrderEnums?: 'ASC';
    page: 0;
    size: 12;
}
export interface StoreCreation {
    statusShopEnums?: 'ACTIVE' | 'DEACTIVE' | 'BANNED';
    id?: string;
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
