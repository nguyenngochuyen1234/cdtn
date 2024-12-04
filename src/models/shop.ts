export interface Shop {
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
    statusShop: 'ACTIVE' | 'INACTIVE' | 'BANNED'
}

