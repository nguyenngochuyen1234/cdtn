export interface User {
    id: string
    username: string
    avatar: string
    email: string
    role: string[]
    phone: string
    statusUser: 'ACTIVE' | 'INACTIVE' | 'BANNED'
    city: string
    district: string
    ward: string
    ratingUser: number
    quantityImage: number
    helpful: number
    notLike: number
    like: number
    firstName: string
    lastName: string
    activeCode: string
    dateOfBirth: Date
}

