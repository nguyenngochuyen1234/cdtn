export interface OpenTime {
    id: string
    dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
    openTime: string
    closingTime: string
    isDayOff: boolean
}

