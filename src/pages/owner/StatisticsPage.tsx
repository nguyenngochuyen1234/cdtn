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
import { RateReview, Favorite, Refresh } from '@mui/icons-material';
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
}

interface ChartData {
    name: string;
    value: number;
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
    const [selectedTab, setSelectedTab] = useState(0);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [dateRange, setDateRange] = useState<{
        start: Dayjs;
        end: Dayjs;
    }>({
        start: dayjs('2023-01-01'),
        end: dayjs(),
    });
    const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('year');

    const fetchSummaryData = async () => {
        setLoading(true);
        try {
            const [reviewResponse, favoriteResponse] = await Promise.all([
                analyticApi.countReviewShop({
                    startDate: new Date('2023-01-01'),
                    endDate: new Date(),
                }),
                analyticApi.countFavoriteShop({
                    startDate: new Date('2023-01-01'),
                    endDate: new Date(),
                }),
            ]);

            setReviewData(reviewResponse.data.data.total || 0);
            setFavoriteData(favoriteResponse.data.data.total || 0);
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
            if (selectedTab === 0) {
                response = await analyticApi.countReviewShop({
                    startDate: dateRange.start.toDate(),
                    endDate: dateRange.end.toDate(),
                });
            } else {
                response = await analyticApi.countFavoriteShop({
                    startDate: dateRange.start.toDate(),
                    endDate: dateRange.end.toDate(),
                });
            }

            const chartData = transformApiResponseToChartData(
                response,
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

    const transformApiResponseToChartData = (
        response: any,
        start: Dayjs,
        end: Dayjs,
        timeFrame: string
    ): ChartData[] => {
        const data: ChartData[] = [];
        let current = start.clone();
        let format = 'DD/MM';

        if (timeFrame === 'year') {
            format = 'MM/YYYY';
        } else if (timeFrame === 'week' || timeFrame === 'month') {
            format = 'DD/MM';
        }

        const timeSeriesData = response.data.data.timeSeries || null;

        if (timeSeriesData && Array.isArray(timeSeriesData)) {
            return timeSeriesData.map((item: any) => ({
                name: dayjs(item.date).format(format),
                value: item.total,
            }));
        } else {
            const total = response.data.data.total || 0;
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
                    value: Math.floor(avgValue),
                });

                if (timeFrame === 'year') {
                    current = current.add(1, 'month');
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

        const end = dayjs();
        let start;

        switch (newTimeFrame) {
            case 'week':
                start = end.subtract(7, 'day');
                break;
            case 'month':
                start = end.subtract(30, 'day');
                break;
            case 'year':
                start = dayjs('2023-01-01');
                break;
        }

        setDateRange({ start, end });
    };

    const handleRefresh = () => {
        fetchSummaryData();
        fetchChartData();
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
                    <Grid item xs={12} md={6}>
                        <StatCard
                            title="Tổng số bài đánh giá"
                            value={reviewData}
                            icon={<RateReview sx={{ fontSize: 32 }} />}
                            color={theme.palette.warning.main}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StatCard
                            title="Tổng số yêu thích"
                            value={favoriteData}
                            icon={<Favorite sx={{ fontSize: 32 }} />}
                            color={theme.palette.error.main}
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                {/* Chart Section */}
                <Paper elevation={2} sx={{ borederRadius: 3, overflow: 'hidden', mb: 4 }}>
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
                                    icon={<RateReview sx={{ fontSize: 20 }} />}
                                    iconPosition="start"
                                    label="Đánh giá"
                                    sx={{ minHeight: 48 }}
                                />
                                <Tab
                                    icon={<Favorite sx={{ fontSize: 20 }} />}
                                    iconPosition="start"
                                    label="Yêu thích"
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
                                                            ? theme.palette.warning.main
                                                            : theme.palette.error.main
                                                    }
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor={
                                                        selectedTab === 0
                                                            ? theme.palette.warning.main
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
                                                    ? theme.palette.warning.main
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
