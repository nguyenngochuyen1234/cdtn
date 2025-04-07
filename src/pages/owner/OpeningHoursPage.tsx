import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ownerApi from '@/api/ownApi';
import { OpenTime } from '@/models';
import OpeningHours from '@/utils/OpeningHours';

const OpeningHoursPage: React.FC = () => {
    const [openTimes, setOpenTimes] = useState<OpenTime[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await ownerApi.getShop();
            if (res.data.success) {
                setOpenTimes(res.data.data.listOpenTimes || []);
            }
        } catch (error) {
            console.error('Error fetching shop data:', error);
        }
    };

    const handleOpenTimeChange = (id: string, field: keyof OpenTime, value: string | boolean) => {
        setOpenTimes(
            openTimes.map((time) => (time.id === id ? { ...time, [field]: value } : time))
        );
    };

    const updateOpenTimes = async () => {
        try {
            const res = await ownerApi.updateOpenTime(openTimes);
            if (res.data.success) {
                alert('Cập nhật giờ mở cửa thành công!');
                fetchData();
            } else {
                alert('Cập nhật giờ mở cửa thất bại!');
            }
        } catch (error) {
            console.error('Error updating open times:', error);
            alert('Có lỗi xảy ra khi cập nhật giờ mở cửa!');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Giờ mở cửa
                    </Typography>
                    <OpeningHours
                        openTimes={openTimes}
                        setOpenTimes={setOpenTimes}
                        handleOpenTimeChange={handleOpenTimeChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={updateOpenTimes}
                    >
                        Lưu giờ mở cửa
                    </Button>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
};

export default OpeningHoursPage;
