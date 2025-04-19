import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Paper, Typography, CircularProgress, Alert, Box } from '@mui/material';

const ActiveCodeUser: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [enable, setEnable] = useState(false);
    const [notification, setNotification] = useState('');
    const [loading, setLoading] = useState(false);

    // Extract the code from the query string
    const activeCode = searchParams.get('code') || Array.from(searchParams)[0]?.[0] || '';

    useEffect(() => {
        if (activeCode) {
            handleActiveCode();
        } else {
            setNotification('Mã kích hoạt không hợp lệ hoặc thiếu.');
        }
    }, [activeCode]);

    const handleActiveCode = async () => {
        console.log('MaKichHoat:', activeCode);
        setLoading(true);
        try {
            const endpoint = `http://localhost:8080/auth/active-account?code=${encodeURIComponent(activeCode)}`;
            const response = await fetch(endpoint, { method: 'GET' });
            const data = await response.json();

            if (data.success) {
                setEnable(true);
                setNotification('Kích hoạt tài khoản thành công!');
            } else {
                setNotification(data.text || 'Kích hoạt thất bại.');
            }
        } catch (error) {
            console.error('Error during activation:', error);
            setNotification('Đã xảy ra lỗi trong quá trình kích hoạt.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    KÍCH HOẠT TÀI KHOẢN
                </Typography>
                {loading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="100px"
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {notification && (
                            <Alert severity={enable ? 'success' : 'error'} sx={{ mb: 2 }}>
                                {notification}
                            </Alert>
                        )}
                        {enable ? (
                            <Link to="/auth/login">
                                <Typography variant="body1" align="center">
                                    Tài khoản của bạn đã được kích hoạt thành công. Bạn có thể đăng
                                    nhập ngay bây giờ.
                                </Typography>
                            </Link>
                        ) : (
                            <Typography variant="body1" align="center">
                                Vui lòng kiểm tra lại liên kết kích hoạt hoặc liên hệ hỗ trợ.
                            </Typography>
                        )}
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default ActiveCodeUser;
