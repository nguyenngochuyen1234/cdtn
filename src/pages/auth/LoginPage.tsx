import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Grid,
    TextField,
    Typography,
    Link,
    FormControlLabel,
    Snackbar,
    Alert,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import authApi from '@/api/authApi';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // State cho Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        // Kiểm tra nếu user đã đăng nhập
        const token = localStorage.getItem('access_token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleLogin = async () => {
        try {
            const result = await authApi.login({ username, password });
            console.log(result.data);
            if (result.data.success) {
                localStorage.setItem('access_token', result.data.data.accessToken);
                setSnackbarMessage('Đăng nhập thành công');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);

                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setSnackbarMessage(result.data.message);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (err) {
            setSnackbarMessage('Đăng nhập thất bại');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleContinueWithGoogle = () => {
        // Google OAuth configuration
        const callbackUrl = 'http://localhost:5173/authenticate';
        const authUrl = 'https://accounts.google.com/o/oauth2/auth';
        const googleClientId = '50673866762-neghnt6bhpf0chqd41r5u5sekfkic27a.apps.googleusercontent.com';
        
        // Build the OAuth URL with required parameters
        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
            callbackUrl
        )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;
        
        // Redirect to Google authentication page
        window.location.href = targetUrl;
    };

    return (
        <Box sx={{ width: '80%', maxWidth: 400 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Đăng nhập
            </Typography>

            <TextField
                label="Tên đăng nhập"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1,
                }}
            >
                <FormControlLabel 
                    control={
                        <Checkbox 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                    } 
                    label="Nhớ tài khoản" 
                />
                <Link href="/auth/forgot-password" underline="hover">
                    Quên mật khẩu?
                </Link>
            </Box>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
                onClick={handleLogin}
            >
                Đăng nhập
            </Button>

            <Typography variant="body2" align="center">
                Bạn chưa có tài khoản? <Link href="/auth/signup">Đăng ký</Link>
            </Typography>

            <Divider sx={{ my: 3 }}>Hoặc đăng nhập bằng</Divider>

            <Button 
                variant="outlined" 
                color="error" 
                fullWidth 
                startIcon={<GoogleIcon />}
                onClick={handleContinueWithGoogle}
            >
                Google
            </Button>

            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbarSeverity} 
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginPage;