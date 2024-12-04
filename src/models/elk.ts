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

