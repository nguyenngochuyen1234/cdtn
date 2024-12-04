import React from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Link,
} from '@mui/material';
import CarouselComponent from '@/components/CarouselComponent';

const ResetPasswordPage: React.FC = () => {
    return (
        <Box sx={{ width: '80%', maxWidth: 400 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Đổi Mật Khẩu
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Nhập mật khẩu mới của bạn để hoàn tất quá trình thay đổi.
            </Typography>

            <TextField
                label="Mật khẩu mới"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <TextField
                label="Xác nhận mật khẩu mới"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Xác thực tài khoản
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

export default ResetPasswordPage;
