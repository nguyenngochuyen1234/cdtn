import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import shopApi from '@/api/shopApi';
import { Shop } from '@/models';

interface SuggestShopsProps {
    type: string;
}

const SuggestShops: React.FC<SuggestShopsProps> = ({ type }) => {
    const [shops, setShops] = useState<Shop[]>([]);

    useEffect(() => {
        const fetchDataSuggestShop = async () => {
            try {
                const response = await shopApi.getShopsSuggest({
                    page: 0,
                    size: 3,
                    checkType: type,
                });
                if (response?.data.data) {
                    setShops(response.data.data);
                }
            } catch {}
        };
        fetchDataSuggestShop();
    }, [type]);

    return (
        <Box sx={{ mt: 0 }}>
            <Typography variant="h6" fontWeight="bold">
                Có thể bạn quan tâm
            </Typography>

            {shops.map((shop) => (
                <Card key={shop.id} sx={{ display: 'flex', mb: 2, mt: 2 }}>
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
                                        color: '#f44336',
                                        fontSize: 16,
                                    }}
                                />
                            ))}
                            <Typography variant="body2" ml={1}>
                                {shop.point} ({shop.countReview} reviews)
                            </Typography>
                        </Box>
                        <Typography variant="body2">{shop.description}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default SuggestShops;
