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
    Grid,
    Link,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await authApi.login({ username, password });
            setSnackbarMessage(result.data.message);
            setSnackbarSeverity(result.data.success ? 'success' : 'error');
            setSnackbarOpen(true);

            if (result.data.success) {
                dispatch(setUser(result.data.data));

                localStorage.setItem('access_token', result.data.data.accessToken);
                if (result.data.data.userInfoResponse.role[0] === 'OWNER') {
                    navigate('/owner');
                } else if (result.data.data.userInfoResponse.role[0] === 'ADMIN') {
                    navigate('/admin');
                }
            }
        } catch (err) {
            setSnackbarMessage('Đăng nhập thất bại');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
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
                <FormControlLabel control={<Checkbox />} label="Nhớ tài khoản" />
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

            <Grid container spacing={2}>
                <Button variant="outlined" color="error" fullWidth startIcon={<GoogleIcon />}>
                    Google
                </Button>
            </Grid>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginPage;
