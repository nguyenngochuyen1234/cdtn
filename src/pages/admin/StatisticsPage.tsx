'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Typography,
    Skeleton,
    Tooltip,
    IconButton,
    CardContent,
    Card,
    useTheme,
    alpha,
} from '@mui/material';
import { PeopleAlt, Store, RateReview, AttachMoney, Refresh } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import analyticApi from '@/api/analyticApi';
import RevenueLineChart from './RevenueLineChart';
import TopAdsChart from './TopAdsPage';

// Types
interface AdsSubscription {
    id: string;
    idAdvertisement: string;
    statusPayment: 'PENDING' | 'SUCCESS' | 'FAILURE';
}

interface Payment {
    id: string;
    totalAmount: number;
    statusPayment: 'PENDING' | 'SUCCESS' | 'FAILURE';
    createdAt: number;
}

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    loading: boolean;
    redirectPath?: string;
}

// StatCard Component
const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    color,
    loading,
    redirectPath,
}) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleClick = () => {
        if (redirectPath) {
            navigate(redirectPath);
        }
    };

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
                    cursor: redirectPath ? 'pointer' : 'default',
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
            onClick={handleClick}
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

export default function StatisticsPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [accountData, setAccountData] = useState(0);
    const [storeData, setStoreData] = useState(0);
    const [reviewData, setReviewData] = useState(0);
    const [revenueData, setRevenueData] = useState(0);
    const [topAdsData, setTopAdsData] = useState<{ idAdvertisement: string; count: number }[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [dateRange, setDateRange] = useState<{
        start: Dayjs;
        end: Dayjs;
    }>({
        start: dayjs('2024-01-01'),
        end: dayjs('2025-04-10'),
    });

    const fetchSummaryData = async () => {
        setLoading(true);
        try {
            const [accountResponse, storeResponse, reviewResponse, revenueResponse] =
                await Promise.all([
                    analyticApi.countUser({ startDate: null, endDate: null }),
                    analyticApi.countShop({ startDate: null, endDate: null }),
                    analyticApi.countReview({ startDate: null, endDate: null }),
                    analyticApi.countAdsAndRevenue(),
                ]);

            setAccountData(accountResponse.data.data.total || 0);
            setStoreData(storeResponse.data.data.total || 0);
            setReviewData(reviewResponse.data.data.total || 0);
            setRevenueData(revenueResponse.data.data.totalPayment || 0);
        } catch (error) {
            console.error('Error fetching summary data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopAdsData = async () => {
        setLoading(true);
        try {
            const response = await analyticApi.listadssub();
            const subscriptions: AdsSubscription[] = response.data.data;

            // Filter successful subscriptions and count by idAdvertisement
            const adsCount = subscriptions
                .filter((sub) => sub.statusPayment === 'SUCCESS')
                .reduce(
                    (acc, sub) => {
                        acc[sub.idAdvertisement] = (acc[sub.idAdvertisement] || 0) + 1;
                        return acc;
                    },
                    {} as Record<string, number>
                );

            const topAds = Object.entries(adsCount)
                .map(([idAdvertisement, count]) => ({
                    idAdvertisement,
                    count,
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3); 

            setTopAdsData(topAds);
        } catch (error) {
            console.error('Error fetching top ads data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRevenueData = async () => {
        setLoading(true);
        try {
            const response = await analyticApi.listRevenu();
            const paymentsData: Payment[] = response.data.data;
            setPayments(paymentsData);
        } catch (error) {
            console.error('Error fetching revenue data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummaryData();
        fetchTopAdsData();
        fetchRevenueData();
    }, []);

    useEffect(() => {
        fetchRevenueData();
    }, [dateRange]);

    const handleRefresh = () => {
        fetchSummaryData();
        fetchTopAdsData();
        fetchRevenueData();
    };

    const formatRevenue = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
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
                        Tổng quan
                    </Typography>
                    <Tooltip title="Làm mới dữ liệu">
                        <IconButton onClick={handleRefresh} color="primary">
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4} lg={3}>
                        <StatCard
                            title="Tổng số tài khoản"
                            value={accountData}
                            icon={<PeopleAlt sx={{ fontSize: 32 }} />}
                            color="#1976d2"
                            loading={loading}
                            redirectPath="/admin/users"
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <StatCard
                            title="Tổng số cửa hàng"
                            value={storeData}
                            icon={<Store sx={{ fontSize: 32 }} />}
                            color="#4caf50"
                            loading={loading}
                            redirectPath="/admin/moderation"
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <StatCard
                            title="Tổng số đánh giá"
                            value={reviewData}
                            icon={<RateReview sx={{ fontSize: 32 }} />}
                            color="#ff9800"
                            loading={loading}
                            redirectPath="/admin"
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <StatCard
                            title="Tổng doanh thu"
                            value={formatRevenue(revenueData)}
                            icon={<AttachMoney sx={{ fontSize: 32 }} />}
                            color="#f44336"
                            loading={loading}
                            redirectPath="/admin/advertisement"
                        />
                    </Grid>
                </Grid>

                <TopAdsChart data={topAdsData} loading={loading} />

                <RevenueLineChart
                    payments={payments}
                    loading={loading}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            </Box>
        </LocalizationProvider>
    );
}
