'use client';

import type React from 'react';
import { useState } from 'react';
import {
    Box,
    Card,
    CardMedia,
    Typography,
    Button,
    IconButton,
    Chip,
    Rating,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import { Shop } from '@/models';

import { useNavigate } from 'react-router-dom';

interface BusinessListingCardProps {
    shop: Shop;
}

const BusinessListingCard: React.FC<BusinessListingCardProps> = ({ shop }) => {
    const navigate = useNavigate();

    const [isFavorite, setIsFavorite] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                width: '100%',
                maxWidth: 900,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: 2,
            }}
        >
            {/* Left side - Image */}
            <CardMedia
                component="img"
                sx={{
                    width: isMobile ? '100%' : 230,
                    height: isMobile ? 200 : 230,
                    objectFit: 'cover',
                }}
                image={shop.avatar}
                alt={shop.name}
            />

            {/* Right side - Content */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    p: 2,
                }}
            >
                {/* Business name and reviews */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        {shop.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                            {shop.countReview || 0}+ lượt đánh giá
                        </Typography>
                    </Box>
                </Box>

                {/* Address */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                    <LocationOnIcon
                        sx={{ color: 'text.secondary', fontSize: 18, mt: 0.3, mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {shop.city}
                    </Typography>
                </Box>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Rating
                        value={shop.countReview > 0 ? shop.point / shop.countReview : 5}
                        readOnly
                        size="small"
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        sx={{ color: '#FF5722' }}
                        precision={0.1} 
                    />
                    <Typography variant="body2" sx={{ ml: 0.5, color: '#FF5722' }}>
                        {shop.countReview > 0 ? (shop.point / shop.countReview).toFixed(1) : 5} sao
                    </Typography>
                </Box>

                {/* Likes */}
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                    <Chip
                        label={`0 Lượt yêu thích`}
                        variant="outlined"
                        size="small"
                        sx={{
                            borderRadius: 1,
                            height: 28,
                            color: 'text.primary',
                            borderColor: '#e0e0e0',
                        }}
                    />
                </Box>

                {/* Views */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VisibilityIcon sx={{ color: 'text.secondary', fontSize: 18, mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                        0 lượt xem
                    </Typography>
                </Box>

                {/* Action buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        mt: 'auto',
                        gap: 1,
                    }}
                >
                    <IconButton
                        onClick={handleFavoriteClick}
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            p: 1,
                            width: 40,
                            height: 40,
                        }}
                    >
                        {isFavorite ? (
                            <FavoriteIcon sx={{ color: 'red', fontSize: 20 }} />
                        ) : (
                            <FavoriteBorderIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        )}
                    </IconButton>

                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={() => navigate(`/detailPost/${shop.id}`)}
                        sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none',
                                backgroundColor: '#d32f2f',
                            },
                        }}
                    >
                        Xem chi tiết
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};
export default BusinessListingCard;
