import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { Carousel } from 'antd';

import { useNavigate } from 'react-router-dom';

const VerificationCodePage: React.FC = () => {
    const navigate = useNavigate();

    const [timer, setTimer] = useState(30);
    const [code, setCode] = useState('');

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(countdown);
        }
    }, [timer]);

    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 16,
    };

    const handleVerification = () => {
        console.log('Mã xác thực:', code);
        navigate('/auth/reset-password');
    };

    return (
        <Box sx={{ width: '80%', maxWidth: 400 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Xác Thực Tài Khoản
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Nhập mã xác thực đã gửi tới email của bạn. Mã sẽ hết hạn trong {timer} giây.
            </Typography>

            <TextField
                label="Mã xác thực"
                variant="outlined"
                fullWidth
                margin="normal"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleVerification}
                disabled={timer === 0}
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

export default VerificationCodePage;
