'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

const PaymentResult: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [toast, setToast] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);

    const transactionStatus = searchParams.get('vnp_TransactionStatus');

    // Function to save transaction history via API
    const saveTransactionHistory = async () => {
        try {
            setLoading(true);
            const params = {
                vnp_TxnRef: searchParams.get('vnp_TxnRef') || '',
                vnp_ResponseCode: searchParams.get('vnp_ResponseCode') || '',
                vnp_TransactionStatus: searchParams.get('vnp_TransactionStatus') || '',
                vnp_SecureHash: searchParams.get('vnp_SecureHash') || '',
                vnp_PayDate: searchParams.get('vnp_PayDate') || '',
                vnp_OrderInfo: searchParams.get('vnp_OrderInfo') || '',
                vnp_BankCode: searchParams.get('vnp_BankCode') || '',
                vnp_TmnCode: searchParams.get('vnp_TmnCode') || '',
                vnp_TransactionNo: searchParams.get('vnp_TransactionNo') || '',
            };

            // Call the API to save transaction history
            await axios.get('http://localhost:8080/IPN', { params });
        } finally {
            setLoading(false);
        }
    };

    // Gọi API saveTransactionHistory đúng một lần khi component mount
    useEffect(() => {
        saveTransactionHistory();
    }, []); // Dependency array rỗng để chỉ chạy một lần khi mount

    // Hiển thị toast dựa trên transactionStatus
    useEffect(() => {
        if (transactionStatus) {
            if (transactionStatus === '00') {
                setToast({
                    open: true,
                    message: 'Thanh toán thành công!',
                    severity: 'success',
                });
            } else {
                setToast({
                    open: true,
                    message: 'Thanh toán thất bại!',
                    severity: 'error',
                });
            }
        }
    }, [transactionStatus]); // Chỉ chạy lại nếu transactionStatus thay đổi

    const handleToastClose = () => {
        setToast({ ...toast, open: false });
    };

    const handleViewHistory = () => {
        navigate('/owner/history'); // Navigate to the transaction history page
    };

    return (
        <Box
            sx={{
                minHeight: '50vh',
                p: { xs: 2, sm: 4 },
                maxWidth: '1200px',
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography
                        variant={isMobile ? 'h5' : 'h4'}
                        sx={{
                            mb: 4,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: transactionStatus === '00' ? 'success.main' : 'error.main',
                        }}
                    >
                        {transactionStatus === '00'
                            ? 'Thanh toán thành công'
                            : 'Thanh toán thất bại'}
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={handleViewHistory}
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#d32f2f',
                            '&:hover': {
                                backgroundColor: '#b71c1c',
                            },
                        }}
                    >
                        Xem lịch sử giao dịch
                    </Button>
                </>
            )}

            <Snackbar
                open={toast.open}
                autoHideDuration={6000}
                onClose={handleToastClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: '100%' }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PaymentResult;
