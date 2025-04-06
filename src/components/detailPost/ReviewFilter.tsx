'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    LinearProgress,
    Grid,
    TextField,
    InputAdornment,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import reviewApi from '@/api/reviewApi';

interface RatingDistribution {
    star: number;
    count: number;
}

interface ReviewFilterProps {
    shopId: string;
    filter: number | null;
    setFilter: (value: number | null) => void;
    searchKeyword: string;
    setSearchKeyword: (value: string) => void;
}

interface Review {
    rating: number;
}

function ReviewFilter({
    shopId,
    filter,
    setFilter,
    searchKeyword,
    setSearchKeyword,
}: ReviewFilterProps) {
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution[]>([
        { star: 5, count: 0 },
        { star: 4, count: 0 },
        { star: 3, count: 0 },
        { star: 2, count: 0 },
        { star: 1, count: 0 },
    ]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const params = {
                    idShop: shopId,
                    keyword: searchKeyword,
                    page: 0,
                    size: 1000,
                    sort: 'desc',
                    filter: filter || 0,
                };
                const response = await reviewApi.getAllReviewByIdShop(shopId, params);
                if (response?.data?.data) {
                    const reviews: Review[] = response.data.data;

                    const total = reviews.length;
                    setTotalReviews(total);

                    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                    const avgRating = total > 0 ? totalRating / total : 0;
                    setAverageRating(avgRating);

                    const distribution = [
                        { star: 5, count: 0 },
                        { star: 4, count: 0 },
                        { star: 3, count: 0 },
                        { star: 2, count: 0 },
                        { star: 1, count: 0 },
                    ];
                    reviews.forEach((review) => {
                        const starIndex = distribution.findIndex(
                            (dist) => dist.star === review.rating
                        );
                        if (starIndex !== -1) {
                            distribution[starIndex].count += 1;
                        }
                    });
                    setRatingDistribution(distribution);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();
    }, [shopId, filter, searchKeyword]);

    const maxCount = Math.max(...ratingDistribution.map((dist) => dist.count), 1);

    const handleStarClick = (star: number) => {
        if (filter === star) {
            setFilter(null);
        } else {
            setFilter(star);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(event.target.value);
    };

    const getProgressColor = (star: number) => {
        if (star >= 4) return '#FF7043';
        if (star === 3) return '#FF7043';
        return '#FFB74D';
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', my: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                        Đánh giá tổng quan
                    </Typography>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                        {[...Array(5)].map((_, index) => (
                            <StarIcon
                                key={index}
                                sx={{
                                    color:
                                        index < Math.floor(averageRating) ? '#FF7043' : '#EEEEEE',
                                    fontSize: 28,
                                    mr: 0.5,
                                }}
                            />
                        ))}
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        {totalReviews} đánh giá
                    </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Stack spacing={1.5}>
                        {ratingDistribution.map((dist) => (
                            <Stack
                                key={dist.star}
                                direction="row"
                                alignItems="center"
                                spacing={2}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': { opacity: 0.9 },
                                }}
                                onClick={() => handleStarClick(dist.star)}
                            >
                                <Typography variant="body2" sx={{ width: 60, fontWeight: 500 }}>
                                    {dist.star} {dist.star === 1 ? 'sao' : 'sao'}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={(dist.count / maxCount) * 100}
                                    sx={{
                                        width: '100%',
                                        height: 12,
                                        borderRadius: 6,
                                        bgcolor: '#EEEEEE',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor(dist.star),
                                            borderRadius: 6,
                                        },
                                    }}
                                />
                            </Stack>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', mt: 4, gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Tìm kiếm đánh giá"
                    size="small"
                    value={searchKeyword}
                    onChange={handleSearchChange}
                    sx={{
                        ml: 'auto',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 20,
                            height: 40,
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Box>
    );
}

export default ReviewFilter;
