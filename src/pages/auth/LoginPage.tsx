import React from 'react';
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
import { useNavigate } from "react-router-dom"


const LoginPage: React.FC = () => {
    const navigate = useNavigate()


    return (
        <Box sx={{ width: '80%', maxWidth: 400 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Đăng nhập</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
            </Typography>

            <TextField label="Email" variant="outlined" fullWidth margin="normal" />
            <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <FormControlLabel
                    control={<Checkbox />}
                    label="Nhớ tài khoản"
                />
                <Link href="/auth/forgot-password" underline="hover">
                    Quên mật khẩu?
                </Link>
            </Box>
            <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }} onClick={() => navigate("/")}>
                Login
            </Button>

            <Typography variant="body2" align="center">
                Bạn chưa có tài khoản? <Link href="/auth/signup">Đăng ký</Link>
            </Typography>

            <Divider sx={{ my: 3 }}>or login with</Divider>

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

export default LoginPage;
