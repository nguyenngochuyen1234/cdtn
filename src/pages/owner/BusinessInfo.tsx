import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import ownerApi from '@/api/ownApi';
import { OpenTime } from '@/models';
import { daysOfWeek } from '@/common';

const BusinessInfo: React.FC = () => {
    const [restaurant, setRestaurant] = useState({
        name: '',
        email: '',
        description: '',
        urlWebsite: '',
        avatar: '',
        mediaUrls: [],
    });

    const [openTimes, setOpenTimes] = useState<OpenTime[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await ownerApi.getShop();
            if (res.data.success) {
                setRestaurant(res.data.data);
                setOpenTimes(res.data.data.listOpenTimes || []);
            }
        } catch (error) {
            console.error('Error fetching shop data:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'avatar' | 'mediaUrls'
    ) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setRestaurant({ ...restaurant, [field]: field === 'avatar' ? files[0] : files });
        }
    };

    const handleOpenTimeChange = (id: string, field: keyof OpenTime, value: string | boolean) => {
        setOpenTimes(
            openTimes.map((time) => (time.id === id ? { ...time, [field]: value } : time))
        );
    };

    const updateRestaurant = async () => {
        try {
            const resOpenTime = ownerApi.updateOpenTime(openTimes);
            const res = await ownerApi.updateShop({
                ...restaurant,
            });
            if (res.data.success) {
                alert('Cập nhật thành công!');
                fetchData();
            } else {
                alert('Cập nhật thất bại!');
            }
        } catch (error) {
            console.error('Error updating restaurant:', error);
            alert('Có lỗi xảy ra khi cập nhật!');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Cập nhật thông tin nhà hàng
                    </Typography>
                    <TextField
                        label="Tên nhà hàng"
                        name="name"
                        value={restaurant.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={restaurant.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mô tả"
                        name="description"
                        value={restaurant.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <TextField
                        label="Website"
                        name="urlWebsite"
                        value={restaurant.urlWebsite}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />

                    <Typography variant="subtitle1" mt={2}>
                        Ảnh đại diện
                    </Typography>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'avatar')}
                    />
                    {/* {restaurant.avatar && (
                        <img
                            src={
                                restaurant.avatar instanceof File
                                    ? URL.createObjectURL(restaurant.avatar)
                                    : restaurant.avatar
                            }
                            alt="Avatar"
                            style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10 }}
                        />
                    )} */}

                    <Typography variant="subtitle1" mt={2}>
                        Ảnh từ thiết bị
                    </Typography>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'mediaUrls')}
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                            marginTop: '10px',
                        }}
                    >
                        {/* {restaurant.mediaUrls.map((url, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(url) || ''}
                                alt={`Media ${index}`}
                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                            />
                        ))} */}
                    </div>
                    <Typography variant="h6" mt={2}>
                        Giờ mở cửa
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginBottom: 2 }}
                        onClick={() =>
                            setOpenTimes([
                                ...openTimes,
                                {
                                    id: Date.now().toString(),
                                    dayOfWeekEnum: '',
                                    openTime: '',
                                    closeTime: '',
                                    dayOff: false,
                                },
                            ])
                        }
                    >
                        Thêm giờ mở cửa
                    </Button>
                    {openTimes.map((time) => (
                        <div
                            key={time.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                marginBottom: 12,
                            }}
                        >
                            <Select
                                value={time.dayOfWeekEnum}
                                onChange={(e) =>
                                    handleOpenTimeChange(time.id, 'dayOfWeekEnum', e.target.value)
                                }
                                displayEmpty
                                sx={{ width: 120 }}
                            >
                                <MenuItem value="" disabled>
                                    Chọn ngày
                                </MenuItem>
                                {daysOfWeek.map((day) => (
                                    <MenuItem key={day.value} value={day.value}>
                                        {day.label}
                                    </MenuItem>
                                ))}
                            </Select>

                            <TimePicker
                                label="Mở cửa"
                                value={time.openTime ? dayjs(time.openTime) : null}
                                onChange={(newValue) =>
                                    handleOpenTimeChange(
                                        time.id,
                                        'openTime',
                                        newValue ? newValue.format('YYYY-MM-DDTHH:mm') : ''
                                    )
                                }
                            />
                            <TimePicker
                                label="Đóng cửa"
                                value={time.closeTime ? dayjs(time.closeTime) : null}
                                onChange={(newValue) =>
                                    handleOpenTimeChange(
                                        time.id,
                                        'closeTime',
                                        newValue ? newValue.format('YYYY-MM-DDTHH:mm') : ''
                                    )
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={time.dayOff}
                                        onChange={(e) =>
                                            handleOpenTimeChange(
                                                time.id,
                                                'dayOff',
                                                e.target.checked
                                            )
                                        }
                                    />
                                }
                                label="Nghỉ"
                            />
                        </div>
                    ))}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={updateRestaurant}
                    >
                        Lưu thông tin
                    </Button>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
};

export default BusinessInfo;
