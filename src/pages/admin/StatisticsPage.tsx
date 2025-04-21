'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    useTheme,
    alpha,
    Tabs,
    Tab,
    Skeleton,
    Paper,
    Divider,
    Button,
    ButtonGroup,
    Stack,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    PeopleAlt,
    Store,
    RateReview,
    TrendingUp,
    Refresh,
    Campaign,
    AttachMoney,
} from '@mui/icons-material';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
} from 'recharts';
import analyticApi from '@/api/analyticApi';
import dayjs, { type Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/vi';

// Types
interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    loading: boolean;
    percentChange?: number;
}

interface ChartData {
    name: string;
    value: number;
}

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    color,
    loading,
    percentChange,
}) => {
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

                {percentChange !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <TrendingUp
                            sx={{
                                fontSize: 16,
                                color: percentChange >= 0 ? 'success.main' : 'error.main',
                                mr: 0.5,
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: percentChange >= 0 ? 'success.main' : 'error.main',
                            }}
                        >
                            {percentChange >= 0 ? '+' : ''}
                            {percentChange}% so với tháng trước
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

// Main Component
export default function StatisticsPage() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [accountData, setAccountData] = useState(0);
    const [storeData, setStoreData] = useState(0);
    const [reviewData, setReviewData] = useState(0);
    const [adsData, setAdsData] = useState(0);
    const [revenueData, setRevenueData] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [dateRange, setDateRange] = useState<{
        start: Dayjs;
        end: Dayjs;
    }>({
        start: dayjs('2024-01-01'), // Default to January 1, 2024
        end: dayjs('2025-04-10'), // Default to April 10, 2025 (current date)
    });
    const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('year'); // Default to 'year' for 2024-2025 range

    // Mock percentage changes (replace with real data if available)
    const percentChanges = {
        accounts: 12.5,
        stores: 8.3,
        reviews: 15.7,
        ads: 10.2,
        revenue: 18.4,
    };

    const fetchSummaryData = async () => {
        setLoading(true);
        try {
            const [accountResponse, storeResponse, reviewResponse, adsAndRevenueResponse] =
                await Promise.all([
                    analyticApi.countUser({
                        startDate: new Date('2024-01-01'), // Align with default date range
                        endDate: new Date('2025-04-10'),
                    }),
                    analyticApi.countShop({
                        startDate: new Date('2024-01-01'),
                        endDate: new Date('2025-04-10'),
                    }),
                    analyticApi.countReview({
                        startDate: new Date('2024-01-01'),
                        endDate: new Date('2025-04-10'),
                    }),
                    analyticApi.countAdsAndRevenue(),
                ]);

            setAccountData(accountResponse.data.data.total || 0);
            setStoreData(storeResponse.data.data.total || 0);
            setReviewData(reviewResponse.data.data.total || 0);
            setAdsData(adsAndRevenueResponse.data.data.totalAds || 0);
            setRevenueData(adsAndRevenueResponse.data.data.totalRevenue || 0);
        } catch (error) {
            console.error('Error fetching summary data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChartData = async () => {
        setLoading(true);
        try {
            let response;
            switch (selectedTab) {
                case 0: // Accounts
                    response = await analyticApi.countUser({
                        startDate: dateRange.start.toDate(),
                        endDate: dateRange.end.toDate(),
                    });
                    break;
                case 1: // Shops
                    response = await analyticApi.countShop({
                        startDate: dateRange.start.toDate(),
                        endDate: dateRange.end.toDate(),
                    });
                    break;
                case 2: // Reviews
                    response = await analyticApi.countReview({
                        startDate: dateRange.start.toDate(),
                        endDate: dateRange.end.toDate(),
                    });
                    break;
                case 3: // Ads
                case 4: // Revenue
                    response = await analyticApi.countAdsAndRevenue();
                    break;
            }

            const chartData = transformApiResponseToChartData(
                response,
                selectedTab,
                dateRange.start,
                dateRange.end,
                timeFrame
            );
            setChartData(chartData);
        } catch (error) {
            console.error('Error fetching chart data', error);
        } finally {
            setLoading(false);
        }
    };

    // Transform API response to chart data format
    const transformApiResponseToChartData = (
        response: any,
        tab: number,
        start: Dayjs,
        end: Dayjs,
        timeFrame: string
    ): ChartData[] => {
        const data: ChartData[] = [];
        let current = start.clone();
        let format = 'DD/MM';

        if (timeFrame === 'year') {
            format = 'MM/YYYY';
        } else if (timeFrame === 'week') {
            format = 'DD/MM';
        } else if (timeFrame === 'month') {
            format = 'DD/MM';
        }

        // Check if the API response contains time-series data
        const timeSeriesData = response.data.data.timeSeries || null;

        if (timeSeriesData && Array.isArray(timeSeriesData)) {
            // If the API provides time-series data (e.g., [{ date: "2024-01-01", total: 100 }, ...])
            return timeSeriesData.map((item: any) => ({
                name: dayjs(item.date).format(format),
                value:
                    tab === 0 || tab === 1 || tab === 2
                        ? item.total
                        : tab === 3
                          ? item.totalAds || 0
                          : item.totalRevenue || 0,
            }));
        } else {
            // Fallback: If the API only returns a total, distribute it across the date range
            const total =
                tab === 0 || tab === 1 || tab === 2
                    ? response.data.data.total || 0
                    : tab === 3
                      ? response.data.data.totalAds || 0
                      : response.data.data.totalRevenue || 0;

            const daysDiff = end.diff(start, 'day') + 1;
            const monthsDiff = end.diff(start, 'month') + 1;
            let avgValue: number;

            if (timeFrame === 'year') {
                avgValue = total / monthsDiff;
            } else {
                avgValue = total / daysDiff;
            }

            while (current.isBefore(end) || current.isSame(end, 'day')) {
                data.push({
                    name: current.format(format),
                    value: Math.floor(avgValue), // Distribute the total evenly
                });

                if (timeFrame === 'year') {
                    current = current.add(1, 'month');
                } else if (timeFrame === 'month') {
                    current = current.add(1, 'day');
                } else {
                    current = current.add(1, 'day');
                }
            }

            return data;
        }
    };

    useEffect(() => {
        fetchSummaryData();
    }, []);

    useEffect(() => {
        fetchChartData();
    }, [selectedTab, dateRange, timeFrame]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const handleTimeFrameChange = (newTimeFrame: 'week' | 'month' | 'year') => {
        setTimeFrame(newTimeFrame);

        // Adjust date range based on time frame
        const end = dayjs('2025-04-10'); // Current date
        let start;

        switch (newTimeFrame) {
            case 'week':
                start = end.subtract(7, 'day');
                break;
            case 'month':
                start = end.subtract(30, 'day');
                break;
            case 'year':
                start = dayjs('2024-01-01'); // Keep the start as 2024-01-01 for yearly view
                break;
        }

        setDateRange({ start, end });
    };

    const handleRefresh = () => {
        fetchSummaryData();
        fetchChartData();
    };

    // Format revenue as currency (VND)
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

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4} lg={2.4}>
                        <StatCard
                            title="Tổng số tài khoản"
                            value={accountData}
                            icon={<PeopleAlt sx={{ fontSize: 32 }} />}
                            color={theme.palette.primary.main}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2.4}>
                        <StatCard
                            title="Tổng số cửa hàng"
                            value={storeData}
                            icon={<Store sx={{ fontSize: 32 }} />}
                            color={theme.palette.success.main}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2.4}>
                        <StatCard
                            title="Tổng số đánh giá"
                            value={reviewData}
                            icon={<RateReview sx={{ fontSize: 32 }} />}
                            color={theme.palette.warning.main}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2.4}>
                        <StatCard
                            title="Tổng số gói quảng cáo"
                            value={adsData}
                            icon={<Campaign sx={{ fontSize: 32 }} />}
                            color={theme.palette.info.main}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={2.4}>
                        <StatCard
                            title="Tổng doanh thu"
                            value={formatRevenue(revenueData)}
                            icon={<AttachMoney sx={{ fontSize: 32 }} />}
                            color={theme.palette.error.main}
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                {/* Chart Section */}
                <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Biểu đồ thống kê
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {/* Chart Controls */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 3,
                            }}
                        >
                            <Tabs
                                value={selectedTab}
                                onChange={handleTabChange}
                                textColor="primary"
                                indicatorColor="primary"
                                aria-label="chart tabs"
                            >
                                <Tab
                                    icon={<PeopleAlt sx={{ fontSize: 20 }} />}
                                    iconPosition="start"
                                    label="Tài khoản"
                                    sx={{ minHeight: 48 }}
                                />
                                <Tab
                                    icon={<Store sx={{ fontSize: 20 }} />}
                                    iconPosition="start"
                                    label="Cửa hàng"
                                    sx={{ minHeight: 48 }}
                                />
                                <Tab
                                    icon={<RateReview sx={{ fontSize: 20 }} />}
                                    iconPosition="start"
                                    label="Đánh giá"
                                    sx={{ minHeight: 48 }}
                                />
                                <Tab
                                    icon={<Campaign sx={{ fontSize: 20 }} />}
                                    iconPosition="start"
                                    label="Quảng cáo"
                                    sx={{ minHeight: 48 }}
                                />
                                <Tab
                                    icon={<AttachMoney sx={{ fontSize: 20 }} />}
                                    iconPosition="start"
                                    label="Doanh thu"
                                    sx={{ minHeight: 48 }}
                                />
                            </Tabs>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <ButtonGroup variant="outlined" size="small">
                                    <Button
                                        onClick={() => handleTimeFrameChange('week')}
                                        variant={timeFrame === 'week' ? 'contained' : 'outlined'}
                                    >
                                        Tuần
                                    </Button>
                                    <Button
                                        onClick={() => handleTimeFrameChange('month')}
                                        variant={timeFrame === 'month' ? 'contained' : 'outlined'}
                                    >
                                        Tháng
                                    </Button>
                                    <Button
                                        onClick={() => handleTimeFrameChange('year')}
                                        variant={timeFrame === 'year' ? 'contained' : 'outlined'}
                                    >
                                        Năm
                                    </Button>
                                </ButtonGroup>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <DatePicker
                                        label="Từ ngày"
                                        value={dateRange.start}
                                        onChange={(newValue) =>
                                            newValue &&
                                            setDateRange({ ...dateRange, start: newValue })
                                        }
                                        slotProps={{ textField: { size: 'small' } }}
                                    />
                                    <DatePicker
                                        label="Đến ngày"
                                        value={dateRange.end}
                                        onChange={(newValue) =>
                                            newValue &&
                                            setDateRange({ ...dateRange, end: newValue })
                                        }
                                        slotProps={{ textField: { size: 'small' } }}
                                    />
                                </Box>
                            </Stack>
                        </Box>

                        {/* Chart */}
                        <Box sx={{ height: 400, width: '100%' }}>
                            {loading ? (
                                <Skeleton variant="rectangular" height={400} animation="wave" />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={chartData}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke={alpha(theme.palette.text.secondary, 0.2)}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke={theme.palette.text.secondary}
                                            tick={{
                                                fill: theme.palette.text.secondary,
                                                fontSize: 12,
                                            }}
                                        />
                                        <YAxis
                                            stroke={theme.palette.text.secondary}
                                            tick={{
                                                fill: theme.palette.text.secondary,
                                                fontSize: 12,
                                            }}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: theme.palette.background.paper,
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 8,
                                                boxShadow: theme.shadows[3],
                                            }}
                                        />
                                        <defs>
                                            <linearGradient
                                                id="colorValue"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor={
                                                        selectedTab === 0
                                                            ? theme.palette.primary.main
                                                            : selectedTab === 1
                                                              ? theme.palette.success.main
                                                              : selectedTab === 2
                                                                ? theme.palette.warning.main
                                                                : selectedTab === 3
                                                                  ? theme.palette.info.main
                                                                  : theme.palette.error.main
                                                    }
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor={
                                                        selectedTab === 0
                                                            ? theme.palette.primary.main
                                                            : selectedTab === 1
                                                              ? theme.palette.success.main
                                                              : selectedTab === 2
                                                                ? theme.palette.warning.main
                                                                : selectedTab === 3
                                                                  ? theme.palette.info.main
                                                                  : theme.palette.error.main
                                                    }
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={
                                                selectedTab === 0
                                                    ? theme.palette.primary.main
                                                    : selectedTab === 1
                                                      ? theme.palette.success.main
                                                      : selectedTab === 2
                                                        ? theme.palette.warning.main
                                                        : selectedTab === 3
                                                          ? theme.palette.info.main
                                                          : theme.palette.error.main
                                            }
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </LocalizationProvider>
    );
}