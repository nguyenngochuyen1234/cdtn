import React from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Link,
    Divider,
} from '@mui/material';
import CarouselComponent from '@/components/CarouselComponent';
import { useNavigate } from "react-router-dom"
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';


const RegisterPage: React.FC = () => {
    const navigate = useNavigate()
    return (
        <Box sx={{ width: '80%', maxWidth: 400 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Đăng ký</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
            </Typography>

            <TextField label="Họ và tên" variant="outlined" fullWidth margin="normal" />
            <TextField label="Email" variant="outlined" fullWidth margin="normal" />
            <TextField label="Mật khẩu" type="password" variant="outlined" fullWidth margin="normal" />
            <TextField label="Xác nhận mật khẩu" type="password" variant="outlined" fullWidth margin="normal" />

            <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>Đăng ký</Button>

            <Typography variant="body2" align="center">
                Bạn đã có tài khoản? <Link href="/auth/login">Đăng nhập</Link>
            </Typography>
            <Divider sx={{ my: 3 }}>or singup with</Divider>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button variant="outlined" color="primary" fullWidth startIcon={<FacebookIcon />}>
                        Facebook
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined" color="error" fullWidth startIcon={<GoogleIcon />}>
                        Google
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RegisterPage;
