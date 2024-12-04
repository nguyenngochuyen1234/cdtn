

import { Avatar, Box, Card, CardContent, CardMedia, Divider, IconButton, Rating, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { colors } from '@/themes/colors';
import { User } from '@/models/user';
import { Shop } from '@/models/shop';
import { Review } from '@/models';
export interface ReviewCardProps {
    review: Review
}
const ReviewCard = ({ review }: ReviewCardProps) => {
    const [userInfo, setUserInfo] = useState<User>()
    const [shopInfo, setShopInfo] = useState<Shop>({
        id: "shop001",
        idUser: "user001",
        idCategory: "cat001",
        name: "Cozy Coffee Corner",
        avatar: "https://source.unsplash.com/random/100x100?coffee",
        email: "contact@cozycoffee.com",
        isVery: true,
        urlWebsite: "https://cozycoffee.com",
        phoneNumber: "0123456789",
        listIdOpenTime: ["monday", "wednesday", "friday"],
        longitude: "106.660172",
        Latitude: "10.762622",
        mediaUrls: [
            "https://source.unsplash.com/random/300x200?cozy",
            "https://source.unsplash.com/random/300x200?coffee-shop"
        ],
        countReview: 120,
        city: "Ho Chi Minh City",
        ward: "Ward 4",
        district: "District 1",
        hasAnOwner: true,
        type: "Coffee Shop",
        statusShop: "ACTIVE"
    })
    useEffect(() => {
        // const dataUser = users.find((item: { id: any; }) => item.id === review.idUser)
        // if (dataUser) {
        //     setUserInfo(dataUser)
        // }
        // const dataShop = shops.find((item: { id: any; }) => item.id === review.idShop)
        // if (dataShop) {
        //     setShopInfo(dataShop)
        // }
    }, [review])
    return (
        <Card sx={{ maxWidth: 345, margin: '16px' }}>
            <CardContent>
                <Box display="flex" alignItems="center" marginBottom={1}>
                    <Avatar alt={userInfo?.username} src={userInfo?.avatar} sx={{ marginRight: 2 }} />
                    <div>
                        <Typography variant="h6">{userInfo?.username}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(review.dateReview).toLocaleDateString()}
                        </Typography>
                    </div>
                </Box>
                <CardMedia
                    component="img"
                    sx={{
                        height: "140px",
                        width: "100%",
                        borderRadius: "16px"
                    }}
                    image={review.mediaUrlReview[0]}
                    alt={review.reviewTitle}
                />
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h5" component="div">
                        {shopInfo?.name}
                    </Typography>
                    <Rating value={review.rating} readOnly />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                    {review.reviewContent}
                </Typography>
            </CardContent>
            <Divider />
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                    <IconButton sx={{ color: colors.iconColor }}>
                        <FavoriteBorderIcon />
                    </IconButton>
                    <IconButton sx={{ color: colors.iconColor }}>
                        <ChatBubbleOutlineIcon />
                    </IconButton>
                </div>
                <IconButton sx={{ color: colors.iconColor }}>
                    <ShareOutlinedIcon />
                </IconButton>
            </Box>
        </Card >
    )
}

export default ReviewCard