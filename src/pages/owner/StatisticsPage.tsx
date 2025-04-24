'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    useTheme,
    alpha,
    IconButton,
    Tooltip,
    Skeleton,
} from '@mui/material';
import { RateReview, Favorite, Refresh, Visibility } from '@mui/icons-material';
import analyticApi from '@/api/analyticApi';
import dayjs, { type Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/vi';
import ReviewLineChart from './RevenuLineShop';

// Types
interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    loading: boolean;
}

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading }) => {
    const theme = useTheme();

    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 3,
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[10],
                },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    backgroundColor: color,
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            backgroundColor: alpha(color, 0.1),
                            color: color,
                            mr: 2,
                        }}
                    >
                        {icon}
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                        {loading ? (
                            <Skeleton variant="text" width={100} height={40} />
                        ) : (
                            <Typography variant="h4" fontWeight="bold">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Main Component
export default function StatisticsPage() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [reviewData, setReviewData] = useState(0);
    const [favoriteData, setFavoriteData] = useState(0);
    const [viewAdsData, setViewAdsData] = useState(0);
    const [dateRange, setDateRange] = useState<{
        start: Dayjs;
        end: Dayjs;
    }>({
        start: dayjs('2023-01-01'),
        end: dayjs(),
    });

    const fetchSummaryData = async () => {
        setLoading(true);
        try {
            const [reviewResponse, favoriteResponse, viewAdsResponse] = await Promise.all([
                analyticApi.countReviewShop({
                    startDate: new Date('2000-01-01'),
                    endDate: new Date(),
                }),
                analyticApi.countFavoriteShop({
                    startDate: new Date('2000-01-01'),
                    endDate: new Date(),
                }),
                analyticApi.countViewAdsByShop(),
            ]);
            console.log('Review Response:', reviewResponse); // Log để kiểm tra dữ liệu
            console.log('Favorite Response:', favoriteResponse);
            console.log('View Ads Response:', viewAdsResponse);
            setReviewData(reviewResponse.data.data.total || 0);
            setFavoriteData(favoriteResponse.data.data.total || 0);
            setViewAdsData(viewAdsResponse.data.data.total || 0);
        } catch (error) {
            console.error('Error fetching summary data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummaryData();
    }, []);

    const handleRefresh = () => {
        fetchSummaryData();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <Box sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">
                        Thống kê
                    </Typography>
                    <Tooltip title="Làm mới dữ liệu">
                        <IconButton onClick={handleRefresh} color="primary">
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            title="Tổng số bài đánh giá"
                            value={reviewData}
                            icon={<RateReview sx={{ fontSize: 32 }} />}
                            color={theme.palette.warning.main}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            title="Tổng số yêu thích"
                            value={favoriteData}
                            icon={<Favorite sx={{ fontSize: 32 }} />}
                            color={theme.palette.error.main}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            title="Tổng số lượt xem quảng cáo"
                            value={viewAdsData}
                            icon={<Visibility sx={{ fontSize: 32 }} />}
                            color={theme.palette.info.main}
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                {/* Review Chart */}
                <ReviewLineChart
                    loading={loading}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            </Box>
        </LocalizationProvider>
    );
}
