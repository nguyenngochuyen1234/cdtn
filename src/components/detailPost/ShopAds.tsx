'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import shopApi from '@/api/shopApi';
import type { OpenTime, Shop } from '@/models';
import { useNavigate } from 'react-router-dom';

interface ShopAdsProps {
    type?: string;
}
export interface Shops {
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
    listOpenTimes: OpenTime[];
    longitude: string;
    latitude: string;
    mediaUrls: string[];
    countReview: number;
    city: string;
    ward: string;
    district: string;
    hasAnOwner: boolean;
    type: string;
    description: string;
    categoryResponse: string;
    price: number;
    statusShop: 'ACTIVE' | 'INACTIVE' | 'BANNED';
    view: number;
    categoryName: string;
    idAdvertisement: string;
}
const ShopAds: React.FC<ShopAdsProps> = ({ type }) => {
    const [shops, setShops] = useState<Shops[]>([]);
    const navigate = useNavigate();
    const theme = useTheme();
    console.log(type)
    useEffect(() => {
        const fetchShops = async () => {
            try {
                let response;
                if (type === 'forme') {
                    response = await shopApi.getShopsSuggest({
                        page: 0,
                        size: 4,
                        checkType: 'forme',
                    });
                    setShops(response?.data.data || []);
                } else {
                    response = await shopApi.getShopAds();
                    setShops(response?.data.data || []);
                }
            } catch (error) {
                console.error(
                    `Error fetching ${type === 'forme' ? 'suggested shops' : 'shop ads'}:`,
                    error
                );
            }
        };
        fetchShops();
    }, [type]);

    const handleCardSearch = (id: string, idAdvertisement?: string) => {
        const from = type === 'forme' ? 'suggested' : 'sponsored';
        navigate(`/detailPost/${id}`, {
            state: {
                from,
                idAdvertisement: from === 'sponsored' ? idAdvertisement : undefined, // Chỉ truyền idAdvertisement nếu from là 'ads'
            },
        });
    };

    const renderStars = (rating: number) => {
        return (
            <Box display="flex" alignItems="center">
                {[...Array(5)].map((_, index) => (
                    <StarIcon
                        key={index}
                        sx={{
                            color: index < Math.floor(rating) ? '#f44336' : theme.palette.grey[300],
                            fontSize: 16,
                        }}
                    />
                ))}
            </Box>
        );
    };

    return (
        <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
                {type === 'forme' ? 'Cửa hàng được đề xuất' : 'Được tài trợ'}
            </Typography>
            {shops.length > 0 ? (
                shops.map((shop) => (
                    <Card
                        key={shop.id}
                        sx={{
                            display: 'flex',
                            mb: 2,
                            height: 120,
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 3,
                            },
                        }}
                        onClick={() => handleCardSearch(shop.id, shop.idAdvertisement)} // Truyền cả shop.id và shop.idAdvertisement
                    >
                        <CardMedia
                            component="img"
                            sx={{
                                width: 120,
                                height: 120,
                                objectFit: 'cover',
                                '&:hover': {
                                    opacity: 0.9,
                                },
                            }}
                            image={
                                shop.avatar ||
                                'http://res.cloudinary.com/dbk09oy6h/image/upload/v1744996768/IMAGE_SHOP/680286055f6b6806678e06b0/1744996767931.jpg.jpg'
                            }
                            alt={shop.name}
                        />
                        <CardContent sx={{ flex: 1, p: 1.5, overflow: 'hidden' }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    mb: 0.5,
                                }}
                            >
                                {shop.name}
                            </Typography>
                            <Box display="flex" alignItems="center" mb={0.5}>
                                {renderStars(shop.point || 0)}
                                <Typography variant="body2" ml={1} fontSize="12px">
                                    ({shop.countReview || 1} reviews)
                                </Typography>
                            </Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: '12px',
                                    lineHeight: 1.3,
                                }}
                            >
                                {shop.description || 'Không có mô tả'}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography variant="body2" color="text.secondary">
                    Không có dữ liệu
                </Typography>
            )}
        </Box>
    );
};

export default ShopAds;
