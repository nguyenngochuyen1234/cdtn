export interface ShopELK {
    id: string
    idUser: string
    idCategory: string
    name: string
    avatar: string
    email: string
    isVery: boolean
    urlWebsite: string
    phoneNumber: string
    listIdOpenTime: string[]
    longitude: string
    Latitude: string
    mediaUrls: string[]
    countReview: number
    city: string
    ward: string
    district: string
    hasAnOwner: boolean
    type: string
    point: number
}

export interface ServiceELK {
    id: string
    idShop: string
    name: string
    type: string
    thumbnail: string
    mediaUrls: string[]
    categoryId: string
    description: string
    stateService: 'ACTIVE' | 'INACTIVE' | 'PENDING'
    longitude: string
    Latitude: string
    countReview: number
    point: number
    price: number
}

// Converting ShopSearchResponse
export interface ShopSearchResponse {
    id: string;
    name: string;
    avatar: string;
    email: string;
    isVery: boolean;
    description: string;
    urlWebsite: string;
    mediaUrls: string[];
    statusShopEnums: string;
    city: string;
    ward: string;
    district: string;
    categoryEnum: CategoryEnums;
    stateService: StateServiceEnums;
    categoryResponse: CategoryResponse;
    isDelete: boolean;
    serviceResponses: ServiceResponse[];
    openTimeResponses: OpenTimeResponse[];
    point: number
    countReview: number
    view: number
  }
  
  // Converting CategoryResponse
  export interface CategoryResponse {
    id: string;
    name: string;
    type: CategoryEnums;
    parentId: string;
    description: string;
    isDelete: boolean;
    tags: Set<string>;
  }
  
  // Converting OpenTimeResponse
  export interface OpenTimeResponse {
    id: string;
    dayOfWeekEnum: string;
    openTime: string;
    closeTime: string;
    isDayOff: boolean;
  }
  
  // Converting ServiceResponse
  export interface ServiceResponse {
    id: string;
    idShop: string;
    name: string;
    type: CategoryEnums;
    description: string;
    thumbnail: string;
    mediaUrl: string[];
    idCategory: string;
    city: string;
    ward: string;
    district: string;
    countReview: number;
    longitude: number;
    latitude: number;
    point: number;
    price: number;
  }
  
  // Enums needed for the interfaces
  export enum CategoryEnums {
    // Add your enum values here
  }
  
  export enum StateServiceEnums {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING'
  }