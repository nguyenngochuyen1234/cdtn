import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Grid,
    TextField,
    Typography,
    FormControlLabel,
} from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';

function AuthPage() {
    const navigate = useNavigate();

    return (
        <Grid
            container
            sx={{
                minHeight: '100vh', // Đảm bảo chiều cao tối thiểu là 100vh
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column', // Xếp các phần tử theo cột
                padding: 2, // Thêm padding nếu cần
            }}
        >
            {/* Logo */}
            <Grid
                item
                xs={12}
                sx={{
                    textAlign: 'center',
                    mb: 3, // Margin bottom thay vì margin top để khoảng cách đều hơn
                }}
            >
                <Link to="/">
                    <img
                        src="/Bright Web.png"
                        alt="Logo"
                        style={{ height: '18px', width: 'auto' }}
                    />
                </Link>
            </Grid>

            {/* Phần Outlet */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%', // Đảm bảo chiếm toàn bộ chiều rộng có thể
                    maxWidth: '500px', // Giới hạn chiều rộng tối đa nếu cần
                }}
            >
                <Outlet />
            </Grid>
        </Grid>
    );
}

export default AuthPage;
