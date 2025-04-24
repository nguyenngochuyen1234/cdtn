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
            text: 'Biểu đồ thống kê doanh thu',
        },
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    const value = context.parsed.y;
                    return `Doanh thu: ${new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(value)}`;
                },
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: (value: number) => {
                    return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(value);
                },
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

// Interface for payment data
interface Payment {
    id: string;
    totalAmount: number;
    statusPayment: 'PENDING' | 'SUCCESS' | 'FAILURE';
    createdAt: number;
}

// Props interface
interface RevenueLineChartProps {
    payments: Payment[];
    loading: boolean;
    dateRange: { start: Dayjs; end: Dayjs };
    setDateRange: React.Dispatch<React.SetStateAction<{ start: Dayjs; end: Dayjs }>>;
}

const RevenueLineChart: React.FC<RevenueLineChartProps> = ({
    payments,
    loading,
    dateRange,
    setDateRange,
}) => {
    const [orderByStatistics, setOrderByStatistics] = useState('monthly');
    const [orderByMonthlyOfYear, setOrderByMonthlyOfYear] = useState(
        new Date().getFullYear().toString()
    );
    const [orderByLatestDate, setOrderByLatestDate] = useState('3');
    const [labels, setLabels] = useState<string[]>(BY_MONTH);

    // Refs to store chart data
    const dataTotalRevenue = useRef<number[]>(new Array(12).fill(0));

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

    // Process payment data
    const updateData = useMemo(
        () => (option: string, year?: string, latestDays?: string[]) => {
            const filteredPayments = payments.filter(
                (payment) =>
                    payment.statusPayment === 'SUCCESS' &&
                    dayjs(payment.createdAt * 1000).isBetween(
                        dateRange.start,
                        dateRange.end,
                        'day',
                        '[]'
                    )
            );

            switch (option) {
                case 'yearly': {
                    const newDataTotalRevenue_Yearly = new Array(BY_YEAR.length).fill(0);
                    filteredPayments.forEach((payment) => {
                        const paymentDate = new Date(payment.createdAt * 1000);
                        const paymentYear = paymentDate.getFullYear().toString();
                        const yearIndex = BY_YEAR.indexOf(paymentYear);
                        if (yearIndex !== -1) {
                            newDataTotalRevenue_Yearly[yearIndex] += payment.totalAmount;
                        }
                    });
                    dataTotalRevenue.current = newDataTotalRevenue_Yearly;
                    break;
                }
                case 'monthly': {
                    const newDataTotalRevenue_Monthly = new Array(12).fill(0);
                    filteredPayments.forEach((payment) => {
                        const paymentDate = new Date(payment.createdAt * 1000);
                        if (
                            paymentDate.getFullYear() ===
                            parseInt(year || new Date().getFullYear().toString())
                        ) {
                            const month = paymentDate.getMonth();
                            newDataTotalRevenue_Monthly[month] += payment.totalAmount;
                        }
                    });
                    dataTotalRevenue.current = newDataTotalRevenue_Monthly;
                    break;
                }
                case 'daily': {
                    const newDataTotalRevenue_Daily = new Array(latestDays?.length || 0).fill(0);
                    filteredPayments.forEach((payment) => {
                        const paymentDate = new Date(payment.createdAt * 1000);
                        const paymentDateFormatted = formatDate(paymentDate);
                        if (latestDays?.includes(paymentDateFormatted)) {
                            const dayIndex = latestDays.indexOf(paymentDateFormatted);
                            newDataTotalRevenue_Daily[dayIndex] += payment.totalAmount;
                        }
                    });
                    dataTotalRevenue.current = newDataTotalRevenue_Daily;
                    break;
                }
                default:
                    break;
            }
        },
        [payments, dateRange]
    );

    // Update data when filters or payments change
    useEffect(() => {
        updateData(orderByStatistics, orderByMonthlyOfYear);
    }, [orderByStatistics, orderByMonthlyOfYear, payments, dateRange, updateData]);

    // Chart data
    const data = {
        labels,
        datasets: [
            {
                label: 'Tổng doanh thu (thành công)',
                data: dataTotalRevenue.current,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4, p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Thống Kê Doanh Thu
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
                {loading ? (
                    <Skeleton variant="rectangular" height={400} animation="wave" />
                ) : (
                    <Line options={options} data={data} />
                )}
            </Box>
        </Paper>
    );
};

export default RevenueLineChart;
