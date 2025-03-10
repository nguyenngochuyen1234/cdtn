import shopApi from '@/api/shopApi';
import { OpenTime, StoreCreation } from '@/models';
import { AppDispatch, RootState } from '@/redux/stores';
import OpeningHours from '@/utils/OpeningHours';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MapComponent from './MapComponent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';

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
        // owner: false,
    });

    const [imagePreviews, setImagePreviews] = useState<{
        avatar: string | null;
        imageBusiness: string | null;
        mediaUrls: string[] | null;
    }>({
        avatar: null,
        mediaUrls: [],
        imageBusiness: null,
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [openTimes, setOpenTimes] = useState<OpenTime[]>([]);

    const bizEmail = localStorage.getItem('EMAIL_BIZ');
    const bizIdCategory = localStorage.getItem('IDCATEGORY_BIZ');
    useEffect(() => {
        if (bizEmail) {
            setFormData((prev) => ({
                ...prev,
                email: bizEmail || '',
                openTimeRequests: openTimes,
            }));
        }
        if (bizIdCategory) {
            setFormData((prev) => ({
                ...prev,
                idCategory: bizIdCategory || '',
            }));
        }
    }, [bizIdCategory, bizEmail]);

    const handleInputChange = (
        field: keyof StoreCreation,
        value: string | number | boolean | string[]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];

        if (files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                mediaUrls: files,
            }));

            setImagePreviews((prev) => ({
                ...prev,
                mediaUrls: files.map((file) => URL.createObjectURL(file)),
            }));
        }
    };

    const handleRemoveOpenTime = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            openTimeRequests: prev?.openTimeRequests?.filter((_, i) => i !== index),
        }));
    };

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleOpenTimeChange = (id: string, field: keyof OpenTime, value: string | boolean) => {
        setOpenTimes(
            openTimes.map((time) => (time.id === id ? { ...time, [field]: value } : time))
        );
    };
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name) newErrors.name = 'Tên cửa hàng là trường bắt buộc';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleAddOpenTime = () => {
        setFormData((prev) => ({
            ...prev,
            openTimeRequests: [
                ...(prev?.openTimeRequests || []),
                { dayOfWeekEnum: 'MONDAY', openTime: '', closeTime: '', dayOff: false },
            ],
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (validateForm()) {
                await shopApi.uploadMultipleImage(
                    formData.mediaUrls as File[],
                    formData.email as string
                );
                setSnackbarMessage(
                    'Gửi yêu cầu đăng ký cửa hàng thành công vui lòng đợi admin xét duyệt!'
                );
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } else {
                console.log('Validation failed. Fix errors and try again.');

                setSnackbarMessage('Please fix the errors in the form.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            const meadiaUrls = await shopApi.uploadMultipleImage(
                formData.mediaUrls as File[],
                formData.email as string
            );
            const response = await shopApi.createShop({
                name: formData.name,
                avatar: store?.avatar,
                imageBusiness: store?.imageBusiness,
                email: store?.email,
                mediaUrls: meadiaUrls.data.data,
                description: formData.description,
                urlWebsite: formData.urlWebsite,
                openTimeRequests: formData.openTimeRequests,
                city: store?.city,
                ward: store?.ward,
                district: store?.district,
                longitude: 0,
                latitude: 0,
                categoryEnum: 'RESTAURANT',
                idCategory: store?.idCategory,
                phone: store?.phone,
                owner: formData.owner,
            });
            if (response.data.success) {
                setSnackbarMessage(response.data.message);
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                navigate('/');
            } else {
                setSnackbarMessage(response.data.message);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Submission failed. Please try again.');
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className="p-8 rounded-lg">
                <Grid container spacing={2}>
                    {/* Left side: Inputs */}
                    <Grid item xs={6}>
                        <Typography variant="h4" className="mb-4 font-bold">
                            Tạo cửa hàng
                        </Typography>
                        <TextField
                            label="Tên cửa hàng"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            margin="normal"
                            required
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

                        {/* <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.owner}
                                onChange={(e) => handleInputChange('owner', e.target.checked)}
                            />
                        }
                        label="Owner"
                    /> */}
                        <Grid item xs={24} sm={12}>
                            <Typography variant="h6">Thời gian hoạt động của cửa hàng</Typography>
                            <OpeningHours
                                openTimes={openTimes}
                                setOpenTimes={setOpenTimes}
                                handleOpenTimeChange={handleOpenTimeChange}
                            />
                        </Grid>
                        <Grid item xs={24} sm={12}>
                            <Box mt={4}>
                                <Typography variant="h6" className="mb-2">
                                    Tải nhiều ảnh
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange()}
                                />
                                <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                                    {imagePreviews.mediaUrls &&
                                        imagePreviews.mediaUrls.map((src, index) => (
                                            <img
                                                key={index}
                                                src={src}
                                                alt={`Media URL Preview ${index + 1}`}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: 8,
                                                }}
                                            />
                                        ))}
                                </Box>
                            </Box>
                        </Grid>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 3 }}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Submit'}
                        </Button>
                    </Grid>

                    {/* Right side: Static Text */}
                    <Grid item xs={6} display="flex" alignItems="center" justifyContent="center">
                        <MapComponent />
                    </Grid>
                </Grid>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default App;
