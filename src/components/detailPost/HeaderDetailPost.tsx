import type React from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';

interface HeaderDetailPostProps {
    shop: any;
    shopId: string;
}

const HeaderDetailPost: React.FC<HeaderDetailPostProps> = ({ shop, shopId }) => {
    if (!shop) return null;

    // Tính điểm trung bình: point / countReview
    const averageRating = shop.countReview > 0 ? (shop.point / shop.countReview).toFixed(1) : '0.0';

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
            }}
        >
            {/* Nội dung chính (tên, đánh giá, mô tả) */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 180,
                    width: '100%',
                    background:
                        'linear-gradient(to top, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.01) 50%, rgba(0,0,0,0.02) 100%)',
                    color: 'white',
                    p: { xs: 2, sm: 3 },
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
                    >
                        {shop.name}
                    </Typography>

                    {shop.very && (
                        <Chip
                            icon={<VerifiedIcon sx={{ color: '#2196f3 !important' }} />}
                            label="Đã xác minh"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.9)',
                                color: '#2196f3',
                                fontWeight: 'bold',
                                '& .MuiChip-icon': {
                                    color: '#2196f3',
                                },
                            }}
                            size="small"
                        />
                    )}
                </Stack>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 3 }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    mt={1}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {[...Array(5)].map((_, i) => (
                            <StarIcon
                                key={i}
                                sx={{
                                    color:
                                        i < Math.floor(parseFloat(averageRating))
                                            ? '#FFD700'
                                            : '#e5e7eb',
                                    fontSize: 20,
                                }}
                            />
                        ))}
                        <Typography
                            variant="body1"
                            sx={{
                                ml: 1,
                                fontWeight: '500px',
                                color: '#FFFF', // Đổi màu thành vàng để dễ đọc trên nền gradient
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)', // Thêm bóng chữ để tăng độ tương phản
                            }}
                        >
                            {averageRating} ({shop.countReview || 0} đánh giá)
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default HeaderDetailPost;
