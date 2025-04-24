import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import shopApi from '@/api/shopApi';
import { OpenTime, Shop } from '@/models';
import { useNavigate } from 'react-router-dom';

interface SuggestShopsProps {
    type: string;
}

// Đảm bảo interface Shop đã có idAdvertisement
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

const Sponsored: React.FC<SuggestShopsProps> = ({ type }) => {
    const [shops, setShops] = useState<Shop[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDataSuggestShop = async () => {
            try {
                const response = await shopApi.getShopAds();
                if (response?.data.data) {
                    setShops(response.data.data);
                }
            } catch {}
        };
        fetchDataSuggestShop();
    }, [type]);

    const handleShopClick = (shopId: string, idAdvertisement: string) => {
        navigate(`/detailPost/${shopId}`, {
            state: {
                from: 'sponsored',
                idAdvertisement, // Truyền idAdvertisement vào state
            },
        });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold">
                Được tài trợ
            </Typography>

            {shops.map((shop) => (
                <Card
                    key={shop.id}
                    sx={{ display: 'flex', mb: 2, mt: 2 }}
                    onClick={() => handleShopClick(shop.id, shop.idAdvertisement)} // Truyền cả shop.id và shop.idAdvertisement
                >
                    <CardMedia
                        component="img"
                        sx={{ width: 100, height: 100 }}
                        image={shop.avatar}
                        alt={shop.name}
                    />
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {shop.name}
                        </Typography>
                        <Box display="flex" alignItems="center">
                            {[...Array(5)].map((_, index) => (
                                <StarIcon
                                    key={index}
                                    sx={{
                                        color:
                                            index <
                                            Math.floor(
                                                shop.countReview > 0
                                                    ? shop.point / shop.countReview
                                                    : 0
                                            )
                                                ? '#f44336'
                                                : '#e0e0e0',
                                        fontSize: 16,
                                    }}
                                />
                            ))}
                            <Typography variant="body2" ml={1}>
                                {shop.countReview > 0
                                    ? `${(shop.point / shop.countReview).toFixed(1)}`
                                    : '1.0'}{' '}
                                ({shop.countReview} reviews)
                            </Typography>
                        </Box>
                        <Typography variant="body2">{shop.description}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default Sponsored;
