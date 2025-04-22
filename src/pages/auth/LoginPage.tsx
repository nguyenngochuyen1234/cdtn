import React, { useState, useEffect } from 'react';
import authApi from '@/api/authApi';
import { setUser } from '@/redux/userSlice';
import GoogleIcon from '@mui/icons-material/Google';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    Link,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRoleByToken } from '@/utils/JwtService';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const savedUsername = localStorage.getItem('saved_username');
        const savedPassword = localStorage.getItem('saved_password');
        const savedRememberMe = localStorage.getItem('remember_me') === 'true';

        if (savedUsername && savedPassword && savedRememberMe) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);
        }

        const token = localStorage.getItem('access_token');
        if (token) {
            const from = location.state?.from || '/';
            navigate(from, { replace: true });
        }
    }, [navigate, location]);

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            if (!username) {
                toast.error('Vui lòng nhập tên đăng nhập');
                return;
            }
            if (!password) {
                toast.error('Vui lòng nhập mật khẩu');
                return;
            }
            const result = await authApi.login({ username, password });
            setSnackbarMessage(result.data.message);
            setSnackbarSeverity(result.data.success ? 'success' : 'error');
            setSnackbarOpen(true);

            if (result.data.success) {
                dispatch(setUser(result.data.data));
                localStorage.setItem('access_token', result.data.data.accessToken);

                if (rememberMe) {
                    localStorage.setItem('saved_username', username);
                    localStorage.setItem('saved_password', password);
                    localStorage.setItem('remember_me', 'true');
                } else {
                    localStorage.removeItem('saved_username');
                    localStorage.removeItem('saved_password');
                    localStorage.removeItem('remember_me');
                }

                const role = getRoleByToken();
                toast.success('Đăng nhập thành công');
                if (role?.[0] === 'OWNER') {
                    navigate('/owner');
                } else if (role?.[0] === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            toast.error('Đăng nhập thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinueWithGoogle = () => {
        const callbackUrl = 'http://localhost:5173/authenticate';
        const authUrl = 'https://accounts.google.com/o/oauth2/auth';
        const googleClientId =
            '50673866762-neghnt6bhpf0chqd41r5u5sekfkic27a.apps.googleusercontent.com';

        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
            callbackUrl
        )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;
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
                label="Mật khẩu"
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
                sx={{ mb: 2, mt: 2 }}
                onClick={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
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
