import { Star } from '@mui/icons-material';
import { Box, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const BorderLinearProgress = styled(LinearProgress)({
    height: 8,
    borderRadius: 4,
    '& .MuiLinearProgress-bar': {
        backgroundColor: '#ff4444',
    },
});

interface RateArticleProps {
    ratings: number[]; // Mảng [số lượng 5 sao, 4 sao, 3 sao, 2 sao, 1 sao]
}

export default function RateArticle({ ratings }: RateArticleProps) {
    const totalRatings = ratings.reduce((acc, value) => acc + value, 0); // Tổng số lượt đánh giá

    // Tính trung bình đánh giá
    const averageRating = totalRatings
        ? (
              ratings.reduce((acc, value, index) => acc + value * (5 - index), 0) / totalRatings
          ).toFixed(1)
        : 0;

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={4}>
                {/* Tổng quan đánh giá */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Tổng quan đánh giá
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h4">{averageRating}</Typography>
                            <Star sx={{ color: '#ffb400' }} />
                            <Typography variant="caption" color="text.secondary">
                                ({totalRatings} lượt đánh giá)
                            </Typography>
                        </Stack>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Stack spacing={1.5}>
                        {[5, 4, 3, 2, 1].map((rating, index) => (
                            <Stack key={rating} direction="row" spacing={2} alignItems="center">
                                <Typography sx={{ minWidth: 60 }}>{rating} sao</Typography>
                                <BorderLinearProgress
                                    variant="determinate"
                                    value={totalRatings ? (ratings[index] / totalRatings) * 100 : 0}
                                    sx={{ flexGrow: 1 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {ratings[index]} Lượt
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
