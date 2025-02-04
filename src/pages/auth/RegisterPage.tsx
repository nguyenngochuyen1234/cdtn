import React, { useState } from 'react';
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
import authApi from '@/api/authApi';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async() => {
        try{
            const {username,email,password,confirmPassword,phone} = formData
            const result =await authApi.register({username,email,password,phone})
        }catch(err){

        }
    };

    return (
        <Box sx={{ width: '80%', maxWidth: 400 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Đăng ký</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
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
            >
                Đăng ký
            </Button>

            <Typography variant="body2" align="center">
                Bạn đã có tài khoản? <Link href="/auth/login">Đăng nhập</Link>
            </Typography>
            <Divider sx={{ my: 3 }}>or sign up with</Divider>

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
