import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Link,
    Divider,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import CarouselComponent from '@/components/CarouselComponent';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import authApi from '@/api/authApi';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (formData.password !== formData.confirmPassword) {
            setSnackbarMessage('Mật khẩu và xác nhận mật khẩu không khớp!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            const { username, email, password, phone } = formData;
            const result = await authApi.register({ username, email, password, phone });
            if (result?.data.success) {
                setSnackbarMessage(result.data.message);
                setSnackbarSeverity('success');
                setSnackbarOpen(true);

                setTimeout(() => {
                    navigate('/auth/login');
                }, 1500);
            } else {
                setSnackbarMessage(result.data.message);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (err) {
            setSnackbarMessage('Đăng ký thất bại');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '80%', maxWidth: 400 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Đăng ký
            </Typography>

            <TextField
                label="Họ và tên"
                variant="outlined"
                fullWidth
                margin="normal"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
            />
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
            />
            <TextField
                label="Mật khẩu"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
            />
            <TextField
                label="Xác nhận mật khẩu"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
            />
            <TextField
                label="Số điện thoại"
                type="text"
                variant="outlined"
                fullWidth
                margin="normal"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Đăng ký'}
            </Button>

            <Typography variant="body2" align="center">
                Bạn đã có tài khoản? <Link href="/auth/login">Đăng nhập</Link>
            </Typography>
            <Divider sx={{ my: 3 }}>or sign up with</Divider>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        startIcon={<FacebookIcon />}
                    >
                        Facebook
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined" color="error" fullWidth startIcon={<GoogleIcon />}>
                        Google
                    </Button>
                </Grid>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RegisterPage;
