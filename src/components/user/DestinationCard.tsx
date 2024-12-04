import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    Box,
    styled,
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    Star,
    Share,
} from '@mui/icons-material';

interface DestinationCardProps {
    image: string;
    title: string;
    category: string;
    timeAgo: string;
    rating: number;
    reviews: number;
}

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 345,
    borderRadius: '12px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    backgroundColor: '#ffffff',
}));

const HeartButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 4,
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
    },
}));

const ShareButton = styled(IconButton)(({ theme }) => ({
    padding: 6,
    color: theme.palette.text.secondary,
}));

export default function DestinationCard({
    image,
    title,
    category,
    timeAgo,
    rating,
    reviews,
}: DestinationCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <StyledCard>
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={image}
                    alt={title}
                    sx={{ objectFit: 'cover' }}
                />
                <HeartButton
                    size="small"
                    onClick={() => setIsFavorite(!isFavorite)}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {isFavorite ? (
                        <Favorite sx={{ fontSize: 20, color: '#f44336' }} />
                    ) : (
                        <FavoriteBorder sx={{ fontSize: 20 }} />
                    )}
                </HeartButton>
            </Box>

            <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                    {title}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {timeAgo}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ShareButton size="small">
                            <Share sx={{ fontSize: 20 }} />
                        </ShareButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ color: '#FFB400', fontSize: 20 }} />
                        <Typography variant="body2" fontWeight="medium">
                            {rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {` ${reviews}`}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </StyledCard>
    );
}

