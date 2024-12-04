import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, IconButton, Button, Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';

interface SearchCardComponentProps {
    image: string;
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
    favoriteCount: number;
    viewCount: number;
    postTime: string;
}

const SearchCardComponent: React.FC<SearchCardComponentProps> = ({
    image,
    name,
    address,
    rating,
    reviewCount,
    favoriteCount,
    viewCount,
    postTime
}) => {
    const navigate = useNavigate()
    return (
        <Card sx={{ width: "100%", p: 2, display: "flex", flexDirection: "row" }}>
            <CardMedia component="img" sx={{ borderRadius: 4, height: 220, width: 240 }} image={image} alt={name} />

            <CardContent>
                <Typography variant="h6">{name}</Typography>
                <Box display="flex" alignItems="center" mb={1}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="textSecondary" ml={0.5}>
                        {address}
                    </Typography>
                </Box>

                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Box display="flex" alignItems="center">
                        <StarIcon fontSize="small" color="warning" />
                        <Typography variant="body2" ml={0.5}>
                            {rating} ({reviewCount} đánh giá)
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <FavoriteIcon fontSize="small" color="error" />
                        <Typography variant="body2" ml={0.5}>{favoriteCount}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <VisibilityIcon fontSize="small" color="action" />
                        <Typography variant="body2" ml={0.5}>{viewCount}</Typography>
                    </Box>
                </Stack>

                <Typography variant="caption" color="textSecondary">
                    Đăng vào: {postTime}
                </Typography>

                <Stack direction="row" spacing={1} mt={2}>
                    <IconButton aria-label="share" color="primary">
                        <ShareIcon />
                    </IconButton>
                    <IconButton aria-label="like" color="error">
                        <FavoriteIcon />
                    </IconButton>
                    <Button variant="contained" color="primary" size="small" onClick={() => navigate("/detailPost")}>
                        Xem chi tiết bài viết
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default SearchCardComponent;
