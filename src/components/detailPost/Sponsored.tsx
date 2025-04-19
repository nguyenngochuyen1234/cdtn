import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import shopApi from '@/api/shopApi';
import { Shop } from '@/models';
import { useNavigate } from 'react-router-dom';

interface SuggestShopsProps {
    type: string;
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
    const handleShopClick = (shopId: string) => {
        navigate(`/detailPost/${shopId}`, { state: { from: 'sponsored' } });
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
                    onClick={() => handleShopClick(shop.id)}
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
