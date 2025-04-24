import shopApi from '@/api/shopApi';
import { OpenTime, StoreCreation } from '@/models';
import { AppDispatch, RootState } from '@/redux/stores';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    Snackbar,
    TextField,
    Typography,
    IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import CreationStepper from './StepperComponent';
import GoogleLocation from '@/components/location/GoogleLocation';
import DeleteIcon from '@mui/icons-material/Delete';
import OpeningHours from './OpenHouring';

interface Location {
    name: string;
    lat: number;
    lng: number;
}

const daysOfWeekLabel: { [key: string]: string } = {
    MONDAY: 'Thứ Hai',
    TUESDAY: 'Thứ Ba',
    WEDNESDAY: 'Thứ Tư',
    THURSDAY: 'Thứ Năm',
    FRIDAY: 'Thứ Sáu',
    SATURDAY: 'Thứ Bảy',
    SUNDAY: 'Chủ Nhật',
};

const App: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const store = useSelector((state: RootState) => state.newShop.newShop);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<StoreCreation>({
        name: '',
        avatar: '',
        imageBusiness: '',
        email: '',
        mediaUrls: [],
        description: '',
        urlWebsite: '',
        openTimeRequests: [],
        city: '',
        ward: '',
        district: '',
        longitude: 0,
        latitude: 0,
        categoryEnum: 'RESTAURANT',
        idCategory: '',
        phone: '',
        codeCity: undefined,
        codeWard: undefined,
        codeDistrict: undefined,
    });
    const [imagePreviews, setImagePreviews] = useState<{
        avatar: string | null;
        imageBusiness: string | null;
        mediaUrls: string[];
    }>({
        avatar: null,
        mediaUrls: [],
        imageBusiness: null,
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [openTimes, setOpenTimes] = useState<OpenTime[]>([
        { id: '1', dayOfWeekEnum: 'MONDAY', openTime: '09:00', closeTime: '17:00', dayOff: false },
        { id: '2', dayOfWeekEnum: 'TUESDAY', openTime: '09:00', closeTime: '17:00', dayOff: false },
        {
            id: '3',
            dayOfWeekEnum: 'WEDNESDAY',
            openTime: '09:00',
            closeTime: '17:00',
            dayOff: false,
        },
        {
            id: '4',
            dayOfWeekEnum: 'THURSDAY',
            openTime: '09:00',
            closeTime: '17:00',
            dayOff: false,
        },
        { id: '5', dayOfWeekEnum: 'FRIDAY', openTime: '09:00', closeTime: '17:00', dayOff: false },
        {
            id: '6',
            dayOfWeekEnum: 'SATURDAY',
            openTime: '09:00',
            closeTime: '17:00',
            dayOff: false,
        },
        { id: '7', dayOfWeekEnum: 'SUNDAY', openTime: '09:00', closeTime: '17:00', dayOff: false },
    ]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const bizEmail = localStorage.getItem('EMAIL_BIZ');
    const bizIdCategory = localStorage.getItem('IDCATEGORY_BIZ');

    useEffect(() => {
        const storedLocation = localStorage.getItem('userLocation');
        const locationFromStorage = storedLocation ? JSON.parse(storedLocation) : null;
        setFormData((prev) => ({
            ...prev,
            email: bizEmail || '',
            idCategory: bizIdCategory || '',
            openTimeRequests: openTimes,
            city: store?.city || '',
            ward: store?.ward || '',
            district: store?.district || '',
            longitude: locationFromStorage?.lng || prev.longitude, // Lấy trực tiếp từ localStorage
            latitude: locationFromStorage?.lat || prev.latitude, // Lấy trực tiếp từ localStorage
            phone: store?.phone || '',
            codeCity: store?.codeCity,
            codeDistrict: store?.codeDistrict,
            codeWard: store?.codeWard,
        }));
    }, [bizEmail, bizIdCategory, store, openTimes, selectedLocation]);

    const handleInputChange = (field: keyof StoreCreation, value: string | number | string[]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        if (files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                mediaUrls: [...(prev.mediaUrls as File[]), ...files],
            }));
            setImagePreviews((prev) => ({
                ...prev,
                mediaUrls: [...prev.mediaUrls, ...files.map((file) => URL.createObjectURL(file))],
            }));
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            mediaUrls: (prev.mediaUrls as File[]).filter((_, i) => i !== index),
        }));
        setImagePreviews((prev) => ({
            ...prev,
            mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name) newErrors.name = 'Tên cửa hàng là trường bắt buộc';
        if (!formData.email) newErrors.email = 'Email là trường bắt buộc';
        if (openTimes.length !== 7) {
            newErrors.openTimes = 'Phải có thời gian hoạt động cho cả 7 ngày trong tuần';
        } else {
            openTimes.forEach((time, index) => {
                if (!time.dayOfWeekEnum) {
                    newErrors[`openTime_${index}_day`] = 'Ngày trong tuần là bắt buộc';
                }
                if (!time.dayOff && (!time.openTime || !time.closeTime)) {
                    newErrors[`openTime_${index}_time`] =
                        'Giờ mở và đóng cửa là bắt buộc nếu không nghỉ';
                }
                if (
                    !time.dayOff &&
                    time.openTime &&
                    time.closeTime &&
                    time.openTime >= time.closeTime
                ) {
                    newErrors[`openTime_${index}_time`] = 'Giờ mở cửa phải trước giờ đóng cửa';
                }
            });
            // Ensure all 7 days are present
            const uniqueDays = new Set(openTimes.map((time) => time.dayOfWeekEnum));
            if (uniqueDays.size !== 7) {
                newErrors.openTimes = 'Mỗi ngày trong tuần phải được chọn đúng một lần';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleOpenTimeChange = (id: string, field: keyof OpenTime, value: string | boolean) => {
        setOpenTimes((prev) =>
            prev.map((time) => (time.id === id ? { ...time, [field]: value } : time))
        );
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!validateForm()) {
                setSnackbarMessage('Vui lòng sửa các lỗi trong biểu mẫu.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            const mediaUrlsResponse = await shopApi.uploadMultipleImage(
                formData.mediaUrls as File[],
                formData.email
            );

            const response = await shopApi.createShop({
                ...formData,
                avatar: localStorage.getItem('AVATAR') || '',
                imageBusiness: localStorage.getItem('IMAGE_BUSINESS') || '',
                mediaUrls: mediaUrlsResponse.data.data,
                openTimeRequests: openTimes,
                longitude: selectedLocation?.lng || formData.longitude, // Sửa: lng cho longitude
                latitude: selectedLocation?.lat || formData.latitude, // Sửa: lat cho latitude
            });

            if (response.data) {
                setSnackbarMessage(response.data.message || 'Tạo cửa hàng thành công!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => navigate('/'), 2000); // Navigate after toast
            } else {
                setSnackbarMessage(response.data.message || 'Tạo cửa hàng thất bại.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Gửi biểu mẫu thất bại. Vui lòng thử lại.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                sx={{
                    p: { xs: 2, md: 4 },
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1,
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom fontWeight="bold">
                            Tạo Cửa Hàng
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Điền thông tin chi tiết để hoàn tất việc tạo cửa hàng của bạn.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Tên cửa hàng"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            margin="normal"
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Website URL"
                            fullWidth
                            value={formData.urlWebsite}
                            onChange={(e) => handleInputChange('urlWebsite', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Mô tả"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            margin="normal"
                        />
                        <Box mt={3}>
                            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                                Vị trí cửa hàng <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <GoogleLocation />
                            {errors.address && (
                                <Typography color="error" variant="caption">
                                    {errors.address}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box mb={3}>
                            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                                Thời gian hoạt động
                            </Typography>
                            <OpeningHours
                                openTimes={openTimes}
                                handleOpenTimeChange={handleOpenTimeChange}
                            />
                            {errors.openTimes && (
                                <Typography color="error" variant="caption">
                                    {errors.openTimes}
                                </Typography>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                                Tải các ảnh cửa hàng
                            </Typography>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                style={{ display: 'block', marginBottom: 16 }}
                            />
                            <Box display="flex" flexWrap="wrap" gap={2}>
                                {imagePreviews.mediaUrls.map((src, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            position: 'relative',
                                            width: 100,
                                            height: 100,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={src}
                                            alt={`Media Preview ${index + 1}`}
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                objectFit: 'cover',
                                                borderRadius: 2,
                                                boxShadow: 1,
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveImage(index)}
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                bgcolor: 'background.paper',
                                                '&:hover': { bgcolor: 'grey.200' },
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{ width: '100%', py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Tạo cửa hàng'}
                        </Button>
                    </Grid>
                </Grid>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default App;
