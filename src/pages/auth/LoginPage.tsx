import React, { useState } from 'react';
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
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import CarouselComponent from '@/components/CarouselComponent';
import { useNavigate } from 'react-router-dom';
import authApi from '@/api/authApi';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const result = await authApi.login({ username, password });
            console.log(result.data);
            if (result.data.data.accessToken) {
                localStorage.setItem('access_token', result.data.data.accessToken);
                navigate('/');
            }
        } catch (err) {}
    };

    return (
        <Box sx={{ width: '80%', maxWidth: 400 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Đăng nhập
            </Typography>
            {/* <Typography variant="body2" color="textSecondary" gutterBottom>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
            </Typography> */}

            {/* Email input */}
            <TextField
                label="Tên đăng nhập"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username} // Set the value to the state
                onChange={(e) => setUsername(e.target.value)} // Update state on change
            />

            {/* Password input */}
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password} // Set the value to the state
                onChange={(e) => setPassword(e.target.value)} // Update state on change
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
                sx={{ mb: 2 }}
                onClick={handleLogin}
            >
                Đăng nhập
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
        </Box>
    );
};

export default LoginPage;
