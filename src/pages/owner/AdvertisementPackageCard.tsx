'use client';

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Grid, Chip, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface AdvertisementPackage {
    id: string;
    name: string;
    description: string;
    price: number;
    total_access: number | null;
    thumbnail: string;
    advertisementTypeEnum: string;
    statusAdvertisement: string;
    startDate: string | null;
    endDate: string | null;
    duration: number | null;
    durationDay: number;
    createdAt: number;
    updatedAt: number;
    discount?: string;
}

interface AdvertisementPackageCardProps {
    pack: AdvertisementPackage;
    onViewDetails: (pack: AdvertisementPackage) => void;
    onBuy: (pack: AdvertisementPackage) => Promise<void>;
}

const AdvertisementPackageCard: React.FC<AdvertisementPackageCardProps> = ({
    pack,
    onViewDetails,
    onBuy,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Truncate description to specified word limit
    const truncateDescription = (text: string, wordLimit: number): string => {
        const words = text.split(' ');
        return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : text;
    };

    // Determine chip color based on advertisement type
    const getChipColor = (): 'error' | 'primary' | 'default' => {
        switch (pack.advertisementTypeEnum) {
            case 'VIP':
                return 'error';
            case 'STANDARD':
                return 'primary';
            default:
                return 'default';
        }
    };

    return (
        <Card
            sx={{
                height: '100%', // Đảm bảo card co giãn đều trong Grid
                minHeight: 450, // Chiều cao tối thiểu
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '0.5rem',
                backgroundColor: '#d32f2f',
                color: '#fff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}
        >
            <CardMedia
                component="img"
                sx={{
                    height: 250, // Giảm chiều cao ảnh
                    objectFit: 'cover', // Đảm bảo ảnh cover đúng tỷ lệ
                    width: '100%',
                }}
                image={pack.thumbnail || '/placeholder.svg?height=250&width=400'}
                alt={pack.name}
            />

            <Box
                sx={{
                    p: 2, // Giảm padding để tiết kiệm không gian
                    pb: 0,
                    flexShrink: 0, // Ngăn không cho phần này co lại
                }}
            >
                <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    component="h3"
                    sx={{
                        fontWeight: 'bold',
                        mb: 0.5,
                        fontSize: isMobile ? '1rem' : '1.1rem', // Điều chỉnh font size
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // Giới hạn số dòng
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {pack.name}
                </Typography>
            </Box>

            <CardContent
                sx={{
                    flex: '1 1 auto', // Cho phép phần này co giãn
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden', // Ẩn nội dung vượt quá
                }}
            >
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 1,
                            opacity: 0.9,
                            fontSize: '0.8rem',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2, // Giới hạn số dòng mô tả
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {pack.description}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                        }}
                    >
                        <Chip
                            label={pack.advertisementTypeEnum}
                            color={getChipColor()}
                            size="small"
                            sx={{
                                fontWeight: 'medium',
                                backgroundColor: '#fff',
                                color: '#000',
                                maxWidth: '60%',
                                fontSize: '0.7rem', // Giảm font size chip
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                opacity: 0.9,
                                fontSize: '1rem',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {pack.durationDay} ngày
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ flexShrink: 0 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            textAlign: 'right',
                        }}
                    >
                        {pack.price.toLocaleString()} VND
                    </Typography>
                </Box>
            </CardContent>

            <Box
                sx={{
                    p: 2,
                    pt: 0,
                    flexShrink: 0, // Ngăn không cho phần này co lại
                }}
            >
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => onViewDetails(pack)}
                            sx={{
                                borderColor: '#fff',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderColor: '#fff',
                                },
                                fontSize: '0.75rem',
                                py: 0.5,
                                minHeight: 36,
                            }}
                        >
                            Xem chi tiết
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => onBuy(pack)}
                            sx={{
                                backgroundColor: '#fff',
                                color: '#d32f2f',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0',
                                },
                                fontSize: '0.75rem',
                                py: 0.5,
                                minHeight: 36,
                            }}
                        >
                            Mua gói
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
};

export default AdvertisementPackageCard;
