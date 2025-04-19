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
            const res = await ownerApi.getListOpenTime();
            if (res.data.success) {
                const fetchedOpenTimes = res.data.data || [];
                // Định nghĩa 7 ngày mặc định
                const defaultOpenTimes: OpenTime[] = [
                    {
                        id: '1',
                        dayOfWeekEnum: 'MONDAY',
                        openTime: '',
                        closeTime: '',
                        dayOff: false,
                    },
                    {
                        id: '2',
                        dayOfWeekEnum: 'TUESDAY',
                        openTime: '',
                        closeTime: '',
                        dayOff: false,
                    },
                    {
                        id: '3',
                        dayOfWeekEnum: 'WEDNESDAY',
                        openTime: '',
                        closeTime: '',
                        dayOff: false,
                    },
                    {
                        id: '4',
                        dayOfWeekEnum: 'THURSDAY',
                        openTime: '',
                        closeTime: '',
                        dayOff: false,
                    },
                    {
                        id: '5',
                        dayOfWeekEnum: 'FRIDAY',
                        openTime: '',
                        closeTime: '',
                        dayOff: false,
                    },
                    {
                        id: '6',
                        dayOfWeekEnum: 'SATURDAY',
                        openTime: '',
                        closeTime: '',
                        dayOff: false,
                    },
                    {
                        id: '7',
                        dayOfWeekEnum: 'SUNDAY',
                        openTime: '',
                        closeTime: '',
                        dayOff: false,
                    },
                ];

                // Ánh xạ dữ liệu từ API vào 7 ngày mặc định
                const updatedOpenTimes = defaultOpenTimes.map((defaultDay) => {
                    const apiDay = fetchedOpenTimes.find(
                        (apiDay: OpenTime) => apiDay.dayOfWeekEnum === defaultDay.dayOfWeekEnum
                    );
                    if (apiDay) {
                        return {
                            ...defaultDay,
                            id: apiDay.id, // Sử dụng id từ API
                            openTime: apiDay.openTime || '',
                            closeTime: apiDay.closeTime || '',
                            dayOff: apiDay.dayOff || false,
                        };
                    }
                    return defaultDay;
                });

                setOpenTimes(updatedOpenTimes);
            }
        } catch (error) {
            console.error('Error fetching open times:', error);
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
