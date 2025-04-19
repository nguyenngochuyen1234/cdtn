import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRoleByToken } from '@/utils/JwtService';
import userApi from '@/api/userApi';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';

interface AuthProps {
    setIsLoggedIn?: (isLoggedIn: boolean) => void;
}

const Authenticate: React.FC<AuthProps> = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const authAttempted = useRef<boolean>(false);
    const dispatch = useDispatch();
    const authenticateUser = useCallback(
        async (authCode: string) => {
            if (authAttempted.current) return;
            authAttempted.current = true;
            setIsAuthenticating(true);

            // API endpoint để xác thực với Google OAuth code
            try {
                // Gửi authCode trong body của request
                const response = await userApi.loginGoogle({ code: authCode });
                if (response.data.success) {
                    dispatch(setUser(response.data.data));
                    setSnackbarMessage(response.data.message);
                    setSnackbarSeverity(response.data.success ? 'success' : 'error');
                    setSnackbarOpen(true);
                    localStorage.setItem('access_token', response.data.data.accessToken);
                    const role = getRoleByToken();
                    console.log('Decoded role:', role);
                    if (role?.[0] === 'OWNER') {
                      navigate('/owner');
                  } else if (role?.[0] === 'ADMIN') {
                      navigate('/admin');
                  } else {
                      navigate('/');
                  }
                } else {
                    throw new Error('Token not found in response');
                }
            } catch (err) {
                console.error('Error during authentication:', err);
                setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định');
            } finally {
                setIsAuthenticating(false);
            }
        },
        [navigate, setIsLoggedIn]
    );

    useEffect(() => {
        // Lấy auth code từ URL (callback từ Google)
        const params = new URLSearchParams(window.location.search);
        const authCode = params.get('code');

        // Kiểm tra nếu đã có access token
        const token = localStorage.getItem('access_token');

        if (authCode && !token && !isAuthenticating && !authAttempted.current) {
            authenticateUser(authCode);
        } else if (token) {
            navigate('/');
        }
    }, [authenticateUser, isAuthenticating, navigate]);

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '30px',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <CircularProgress />
            <Typography>Đang xác thực...</Typography>
        </Box>
    );
};

export default Authenticate;
