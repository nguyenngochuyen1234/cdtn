'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    Chip,
    Container,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import shopApi from '@/api/shopApi';
import { Shop } from '@/models';

interface DestinationCardProps {
    shop: Shop;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ shop }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <Card sx={{ maxWidth: 300, height: '100%', position: 'relative' }}>
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    sx={{ height: 220 }}
                    image={shop.avatar}
                    alt={shop.name}
                />
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                        width: 36,
                        height: 36,
                    }}
                    onClick={() => setIsFavorite(!isFavorite)}
                >
                    {isFavorite ? (
                        <FavoriteIcon sx={{ color: 'red' }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                    )}
                </IconButton>
            </Box>
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 'bold', mb: 0.5 }}
                >
                    {shop.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    {shop.categoryResponse.tags.map((item) => (
                        <Typography variant="body2" color="text.secondary">
                            {item}
                        </Typography>
                    ))}

                    <Typography variant="body2" color="text.secondary">
                        1 tuần trước
                    </Typography>
                </Box>
                <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <IconButton size="small">
                        <ShareIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                                {shop.point}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                                {shop.countReview}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
interface SuggestShopsProps {
    type: string;
}

const SuggestShops: React.FC<SuggestShopsProps> = ({ type }) => {
    const [shops, setShops] = useState<Shop[]>([]);
    const fetchDataSuggestShop = async () => {
        try {
            const response = await shopApi.getShopsSuggest({
                page: 0,
                size: 4,
                checkType: 'forme',
            });
            if (response?.data.data) {
                setShops(response?.data.data);
            }
        } catch {}
    };
    useEffect(() => {
        fetchDataSuggestShop();
    }, []);
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    fontSize: '1.1rem',
                }}
            >
                Được tài trợ
            </Typography>
            <Grid container spacing={3}>
                {shops.map((shop) => (
                    <Grid item xs={12} sm={12} md={6} key={shop.id}>
                        <DestinationCard shop={shop} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default SuggestShops;
