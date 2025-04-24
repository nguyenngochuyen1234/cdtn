'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import analyticApi from '@/api/analyticApi';
import RevenueLineChart from './RevenueLineChart';

// Interface for payment data
interface Payment {
    id: string;
    totalAmount: number;
    statusPayment: 'PENDING' | 'SUCCESS' | 'FAILURE';
    createdAt: number;
}

export default function StatisticsPage() {
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [dateRange, setDateRange] = useState<{
        start: Dayjs;
        end: Dayjs;
    }>({
        start: dayjs('2024-01-01'),
        end: dayjs('2025-04-10'),
    });

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
        fetchRevenueData();
    }, []);

    const handleRefresh = () => {
        fetchRevenueData();
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
