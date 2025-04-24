'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
    Box,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import analyticApi from '@/api/analyticApi';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Chart options
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Biểu đồ thống kê số lượng đánh giá',
        },
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    const value = context.parsed.y;
                    return `Số lượng đánh giá: ${value}`;
                },
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1, // Đảm bảo bước trên trục Y là số nguyên
            },
        },
    },
};

// Constants for labels
const BY_YEAR = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const BY_MONTH = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
];
const BY_LASTEST_3_DAYS = [
    dayjs().subtract(2, 'day').format('DD/MM/YYYY'),
    dayjs().subtract(1, 'day').format('DD/MM/YYYY'),
    dayjs().format('DD/MM/YYYY'),
];
const BY_LASTEST_7_DAYS = Array.from({ length: 7 }, (_, i) =>
    dayjs()
        .subtract(6 - i, 'day')
        .format('DD/MM/YYYY')
);
const BY_LASTEST_15_DAYS = Array.from({ length: 15 }, (_, i) =>
    dayjs()
        .subtract(14 - i, 'day')
        .format('DD/MM/YYYY')
);
const BY_LASTEST_30_DAYS = Array.from({ length: 30 }, (_, i) =>
    dayjs()
        .subtract(29 - i, 'day')
        .format('DD/MM/YYYY')
);

// Interface for review data
interface Review {
    id: string;
    reviewTitle: string | null;
    reviewContent: string;
    rating: number;
    mediaUrlReview: string[];
    like: number;
    helpful: number;
    notLike: number;
    idService: string | null;
    idUser: string;
    idShop: string;
    createdAt: number;
    updatedAt: number;
    edit: boolean;
}

// Props interface
interface ReviewLineChartProps {
    loading: boolean;
    dateRange: { start: Dayjs; end: Dayjs };
    setDateRange: React.Dispatch<React.SetStateAction<{ start: Dayjs; end: Dayjs }>>;
}

const ReviewLineChart: React.FC<ReviewLineChartProps> = ({
    loading: parentLoading,
    dateRange,
    setDateRange,
}) => {
    const [orderByStatistics, setOrderByStatistics] = useState('monthly');
    const [orderByMonthlyOfYear, setOrderByMonthlyOfYear] = useState(
        new Date().getFullYear().toString()
    );
    const [orderByLatestDate, setOrderByLatestDate] = useState('3');
    const [labels, setLabels] = useState<string[]>(BY_MONTH);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Refs to store chart data
    const dataReviewCount = useRef<number[]>(new Array(12).fill(0));

    // Fetch reviews data
    const fetchReviewsData = async () => {
        setLoading(true);
        try {
            const response = await analyticApi.listReview();
            const reviewsData: Review[] = response.data.data;
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching reviews data', error);
        } finally {
            setLoading(false);
        }
    };

    // Format date function
    const formatDate = (date: Date): string => {
        return dayjs(date).format('DD/MM/YYYY');
    };

    // Handle filter changes
    const handleChangeOrderByStatistics = (event: SelectChangeEvent<string>): void => {
        setOrderByStatistics(event.target.value);
        if (event.target.value === 'yearly') {
            setLabels(BY_YEAR);
            updateData(event.target.value);
        }
        if (event.target.value === 'monthly') {
            setLabels(BY_MONTH);
            updateData(event.target.value, new Date().getFullYear().toString());
        }
        if (event.target.value === 'daily') {
            setLabels(BY_LASTEST_3_DAYS);
            setOrderByLatestDate('3');
            updateData(event.target.value, new Date().getFullYear().toString(), BY_LASTEST_3_DAYS);
        }
    };

    const handleChangeOrderByLatestDate = (event: SelectChangeEvent<string>): void => {
        setOrderByLatestDate(event.target.value);
        switch (event.target.value) {
            case '3':
                setLabels(BY_LASTEST_3_DAYS);
                updateData(
                    orderByStatistics,
                    new Date().getFullYear().toString(),
                    BY_LASTEST_3_DAYS
                );
                break;
            case '7':
                setLabels(BY_LASTEST_7_DAYS);
                updateData(
                    orderByStatistics,
                    new Date().getFullYear().toString(),
                    BY_LASTEST_7_DAYS
                );
                break;
            case '15':
                setLabels(BY_LASTEST_15_DAYS);
                updateData(
                    orderByStatistics,
                    new Date().getFullYear().toString(),
                    BY_LASTEST_15_DAYS
                );
                break;
            case '30':
                setLabels(BY_LASTEST_30_DAYS);
                updateData(
                    orderByStatistics,
                    new Date().getFullYear().toString(),
                    BY_LASTEST_30_DAYS
                );
                break;
            default:
                break;
        }
    };

    const handleChangeOrderByMonthlyOfYear = (event: SelectChangeEvent<string>): void => {
        setOrderByMonthlyOfYear(event.target.value);
        updateData(orderByStatistics, event.target.value);
    };

    // Process review data
    const updateData = useMemo(
        () => (option: string, year?: string, latestDays?: string[]) => {
            const filteredReviews = reviews.filter((review) =>
                dayjs(review.createdAt * 1000).isBetween(
                    dateRange.start,
                    dateRange.end,
                    'day',
                    '[]'
                )
            );

            switch (option) {
                case 'yearly': {
                    const newDataReviewCount_Yearly = new Array(BY_YEAR.length).fill(0);
                    filteredReviews.forEach((review) => {
                        const reviewDate = new Date(review.createdAt * 1000);
                        const reviewYear = reviewDate.getFullYear().toString();
                        const yearIndex = BY_YEAR.indexOf(reviewYear);
                        if (yearIndex !== -1) {
                            newDataReviewCount_Yearly[yearIndex] += 1;
                        }
                    });
                    dataReviewCount.current = newDataReviewCount_Yearly;
                    break;
                }
                case 'monthly': {
                    const newDataReviewCount_Monthly = new Array(12).fill(0);
                    filteredReviews.forEach((review) => {
                        const reviewDate = new Date(review.createdAt * 1000);
                        if (
                            reviewDate.getFullYear() ===
                            parseInt(year || new Date().getFullYear().toString())
                        ) {
                            const month = reviewDate.getMonth();
                            newDataReviewCount_Monthly[month] += 1;
                        }
                    });
                    dataReviewCount.current = newDataReviewCount_Monthly;
                    break;
                }
                case 'daily': {
                    const newDataReviewCount_Daily = new Array(latestDays?.length || 0).fill(0);
                    filteredReviews.forEach((review) => {
                        const reviewDate = new Date(review.createdAt * 1000);
                        const reviewDateFormatted = formatDate(reviewDate);
                        if (latestDays?.includes(reviewDateFormatted)) {
                            const dayIndex = latestDays.indexOf(reviewDateFormatted);
                            newDataReviewCount_Daily[dayIndex] += 1;
                        }
                    });
                    dataReviewCount.current = newDataReviewCount_Daily;
                    break;
                }
                default:
                    break;
            }
        },
        [reviews, dateRange]
    );

    // Fetch data on mount
    useEffect(() => {
        fetchReviewsData();
    }, []);

    // Update data when filters or reviews change
    useEffect(() => {
        updateData(orderByStatistics, orderByMonthlyOfYear);
    }, [orderByStatistics, orderByMonthlyOfYear, reviews, dateRange, updateData]);

    // Chart data
    const data = {
        labels,
        datasets: [
            {
                label: 'Số lượng đánh giá',
                data: dataReviewCount.current,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    return (
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4, p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Thống Kê Số Lượng Đánh Giá
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <FormControl sx={{ m: 1, minWidth: 170 }} size="small">
                    <InputLabel id="statistics-select-label">Thống kê theo</InputLabel>
                    <Select
                        labelId="statistics-select-label"
                        id="statistics-select"
                        value={orderByStatistics}
                        label="Thống kê theo"
                        onChange={handleChangeOrderByStatistics}
                    >
                        <MenuItem value="yearly">Hàng năm</MenuItem>
                        <MenuItem value="monthly">Hàng tháng</MenuItem>
                        <MenuItem value="daily">Hàng ngày</MenuItem>
                    </Select>
                </FormControl>
                {orderByStatistics === 'daily' && (
                    <FormControl sx={{ m: 1, minWidth: 170 }} size="small">
                        <InputLabel id="latest-date-select-label">Lọc theo</InputLabel>
                        <Select
                            labelId="latest-date-select-label"
                            id="latest-date-select"
                            value={orderByLatestDate}
                            label="Lọc theo"
                            onChange={handleChangeOrderByLatestDate}
                        >
                            <MenuItem value="3">3 ngày gần đây</MenuItem>
                            <MenuItem value="7">7 ngày gần đây</MenuItem>
                            <MenuItem value="15">15 ngày gần đây</MenuItem>
                            <MenuItem value="30">30 ngày gần đây</MenuItem>
                        </Select>
                    </FormControl>
                )}
                {orderByStatistics === 'monthly' && (
                    <FormControl sx={{ m: 1, minWidth: 170 }} size="small">
                        <InputLabel id="year-select-label">Năm</InputLabel>
                        <Select
                            labelId="year-select-label"
                            id="year-select"
                            value={orderByMonthlyOfYear}
                            label="Năm"
                            onChange={handleChangeOrderByMonthlyOfYear}
                        >
                            {BY_YEAR.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <DatePicker
                    label="Từ ngày"
                    value={dateRange.start}
                    onChange={(newValue) =>
                        newValue && setDateRange({ ...dateRange, start: newValue })
                    }
                    slotProps={{ textField: { size: 'small' } }}
                />
                <DatePicker
                    label="Đến ngày"
                    value={dateRange.end}
                    onChange={(newValue) =>
                        newValue && setDateRange({ ...dateRange, end: newValue })
                    }
                    slotProps={{ textField: { size: 'small' } }}
                />
            </Stack>
            <Box sx={{ height: 400, width: '100%' }}>
                {loading || parentLoading ? (
                    <Skeleton variant="rectangular" height={400} animation="wave" />
                ) : (
                    <Line options={options} data={data} />
                )}
            </Box>
        </Paper>
    );
};

export default ReviewLineChart;
