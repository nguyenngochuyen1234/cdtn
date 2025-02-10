import shopApi from '@/api/shopApi';
import { StoreCreation } from '@/models';
import { RootState } from '@/redux/stores';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MapComponent from './MapComponent';

interface OpenTimeRequest {
    dayOfWeekEnum: string;
    openTime: string;
    closeTime: string;
    dayOff: boolean;
}

const App: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);

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
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const bizEmail = localStorage.getItem('EMAIL_BIZ');
    const bizIdCategory = localStorage.getItem('IDCATEGORY_BIZ');
    useEffect(() => {
        if (bizEmail) {
            setFormData((prev) => ({
                ...prev,
                email: bizEmail || '',
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
        console.log('hi');
        const files = event.target.files ? Array.from(event.target.files) : [];

        if (files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                mediaUrls: files,
            }));

            setImagePreviews((prev) => ({
                ...prev,
                mediaUrls: files.map((file) => URL.createObjectURL(file)), // Create object URLs for previews
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

    const validateForm = () => {
        console.log(formData);
        const newErrors: { [key: string]: string } = {};

        if (!formData.name) newErrors.name = 'Tên cửa hàng là trường bắt buộc';

        console.log(newErrors);
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
    const handleOpenTimeChange = (
        index: number,
        field: keyof OpenTimeRequest,
        value: string | boolean
    ) => {
        setFormData((prev) => {
            const updatedRequests = [...(prev?.openTimeRequests || [])];
            updatedRequests[index] = {
                ...updatedRequests[index],
                [field]: value,
            };
            return { ...prev, openTimeRequests: updatedRequests };
        });
    };

    const handleSubmit = async () => {
        try {
            if (validateForm()) {
                await shopApi.uploadMultipeImage(
                    formData.mediaUrls as File[],
                    formData.email as string
                );
                setSnackbarMessage('Gửi yêu cầu đăng ký cửa hàng thành công vui lòng đợi admin xét duyệt!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } else {
                console.log('Validation failed. Fix errors and try again.');

                setSnackbarMessage('Please fix the errors in the form.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (err) {}
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
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
                        {(formData?.openTimeRequests || []).map((request, index) => (
                            <Box key={index} className="mb-4">
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={4}>
                                        <FormControl fullWidth>
                                            <Select
                                                value={request.dayOfWeekEnum}
                                                onChange={(e) =>
                                                    handleOpenTimeChange(
                                                        index,
                                                        'dayOfWeekEnum',
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {[
                                                    'MONDAY',
                                                    'TUESDAY',
                                                    'WEDNESDAY',
                                                    'THURSDAY',
                                                    'FRIDAY',
                                                    'SATURDAY',
                                                    'SUNDAY',
                                                ].map((day) => (
                                                    <MenuItem key={day} value={day}>
                                                        {day.charAt(0) + day.slice(1).toLowerCase()}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Thời gian mở cửa"
                                            fullWidth
                                            value={request.openTime}
                                            onChange={(e) =>
                                                handleOpenTimeChange(
                                                    index,
                                                    'openTime',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Thời gian đóng cửa"
                                            fullWidth
                                            value={request.closeTime}
                                            onChange={(e) =>
                                                handleOpenTimeChange(
                                                    index,
                                                    'closeTime',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleRemoveOpenTime(index)}
                                        >
                                            Xóa
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={handleAddOpenTime}>
                            Add Open Time
                        </Button>
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
                    >
                        Submit
                    </Button>
                </Grid>

                {/* Right side: Static Text */}
                <Grid item xs={6} display="flex" alignItems="center" justifyContent="center">
                    <MapComponent />
                </Grid>
            </Grid>
        </Box>
    );
};

export default App;
