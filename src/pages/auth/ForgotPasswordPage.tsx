import React from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from "react-router-dom"

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate()

    return (
        <Box sx={{ width: '80%', maxWidth: 400 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Quên Mật Khẩu
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu.
            </Typography>

            <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate("/auth/verfication")}
            >
                Gửi
            </Button>

            <Button
                variant="text"
                color="secondary"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => window.history.back()}
            >
                Quay lại
            </Button>
        </Box>
    );
};

export default ForgotPasswordPage;
