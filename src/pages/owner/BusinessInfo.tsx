import React, { useState } from 'react';
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

interface OpenTime {
    id: string;
    dayOfWeekEnum: string;
    openTime: string;
    closeTime: string;
    dayOff: boolean;
}

const BusinessInfo: React.FC = () => {
    const [restaurant, setRestaurant] = useState({
        name: 'Nhà hàng của Bảo',
        email: 'truongducbao2904@gmail.com',
        description: 'Nhà hàng món ăn hàng đầu về chất lượng',
        urlWebsite: 'https://quannhautudo.com/bai-viet/quan-nhau-chill-ha-noi-163.htm',
        avatar: '',
        mediaUrls: [],
    });

    const [openTimes, setOpenTimes] = useState<OpenTime[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'avatar' | 'mediaUrls'
    ) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
            setRestaurant({ ...restaurant, [field]: field === 'avatar' ? files[0] : files });
        }
    };

    const handleOpenTimeChange = (id: string, field: keyof OpenTime, value: string | boolean) => {
        setOpenTimes(
            openTimes.map((time) => (time.id === id ? { ...time, [field]: value } : time))
        );
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
                    {restaurant.avatar && (
                        <img
                            src={restaurant.avatar}
                            alt="Avatar"
                            style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10 }}
                        />
                    )}

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
                        {restaurant.mediaUrls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Media ${index}`}
                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                            />
                        ))}
                    </div>

                    <Typography variant="h6" mt={2}>
                        Giờ mở cửa
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
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
                                marginBottom: 12,
                                marginTop: 12,
                                gap: 12,
                            }}
                        >
                            <TextField
                                label="Thứ"
                                value={time.dayOfWeekEnum}
                                onChange={(e) =>
                                    handleOpenTimeChange(time.id, 'dayOfWeekEnum', e.target.value)
                                }
                                sx={{ width: 100 }}
                            />
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

                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Lưu thông tin
                    </Button>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
};

export default BusinessInfo;
