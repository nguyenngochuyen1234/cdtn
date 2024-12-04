export interface Service {
    id: string
    idShop: string
    name: string
    type: string
    thumbnail: string
    mediaUrls: string[]
    categoryId: string
    description: string
    stateService: 'ACTIVE' | 'INACTIVE' | 'PENDING'
    hasAnOwner: boolean
    longitude: string
    Latitude: string
    countReview: number
    point: number
    price: number
    isDelete: boolean
}

export interface Category {
    id: string
    name: string
    type: string
    description: string
    isDelete: boolean
    idParent: string
}

