import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    Grid,
    Alert,
    Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/redux/stores';
import { useDispatch, useSelector } from 'react-redux';
import CreationStepper from './StepperComponent';

function UploadImagePage() {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const store = useSelector((state: RootState) => state.newShop.newShop);

    const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>({
        'shop-logo': null,
        'food-safety': null,
    });
    const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string | null }>({
        'shop-logo': null,
        'food-safety': null,
    });
    const [uploading, setUploading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleFileChange = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setImageFiles((prev) => ({
                ...prev,
                [type]: file,
            }));
            setPreviewUrls((prev) => ({
                ...prev,
                [type]: URL.createObjectURL(file),
            }));
        }
    };

    const handleUpload = async () => {
        setUploading(true);
        const email = localStorage.getItem('EMAIL_BIZ');
        if (!email) {
            setSnackbar({
                open: true,
                message: 'Không tìm thấy email. Vui lòng đăng nhập lại.',
                severity: 'error',
            });
            setUploading(false);
            return;
        }

        if (!imageFiles['shop-logo'] || !imageFiles['food-safety']) {
            setSnackbar({
                open: true,
                message: 'Vui lòng chọn cả ảnh đại diện và giấy phép kinh doanh.',
                severity: 'error',
            });
            setUploading(false);
            return;
        }

        const uploadPromises = Object.entries(imageFiles).map(async ([type, file], index) => {
            if (!file) return null;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('email', email);
            try {
                const response = await fetch('http://localhost:8080/shops/upload-image-shop', {
                    method: 'PUT',
                    body: formData,
                });
                const data = await response.json();
                if (data.success) {
                    if (index === 0) {
                        localStorage.setItem('AVATAR', data.data);
                    } else if (index === 1) {
                        localStorage.setItem('IMAGE_BUSINESS', data.data);
                    }
                    return `Tải lên ${type} thành công`;
                } else {
                    throw new Error(`Không thể tải lên ${type}.`);
                }
            } catch (error) {
                throw new Error(`Không thể tải lên ${type}.`);
            }
        });

        try {
            await Promise.all(uploadPromises);
            setSnackbar({
                open: true,
                message: 'Tải ảnh lên thành công!',
                severity: 'success',
            });
            navigate('/finish-create-shop');
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || 'Tải ảnh thất bại. Vui lòng thử lại.',
                severity: 'error',
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 800,
                mx: 'auto',
                my: 4,
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <CreationStepper />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Tải Ảnh Cửa Hàng
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Tải lên ảnh đại diện và giấy phép kinh doanh để hoàn tất hồ sơ cửa hàng.
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Ảnh đại diện cửa hàng <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange('shop-logo')}
                                style={{ display: 'block', marginBottom: 16 }}
                            />
                            {imageFiles['shop-logo'] && (
                                <Typography variant="body2" color="text.secondary">
                                    Đã chọn: {imageFiles['shop-logo']?.name}
                                </Typography>
                            )}
                        </CardContent>
                        {previewUrls['shop-logo'] && (
                            <CardMedia
                                component="img"
                                image={previewUrls['shop-logo']}
                                alt="Shop Logo Preview"
                                sx={{ height: 200, objectFit: 'contain', borderRadius: 2 }}
                            />
                        )}
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Giấy phép kinh doanh <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange('food-safety')}
                                style={{ display: 'block', marginBottom: 16 }}
                            />
                            {imageFiles['food-safety'] && (
                                <Typography variant="body2" color="text.secondary">
                                    Đã chọn: {imageFiles['food-safety']?.name}
                                </Typography>
                            )}
                        </CardContent>
                        {previewUrls['food-safety'] && (
                            <CardMedia
                                component="img"
                                image={previewUrls['food-safety']}
                                alt="Food Safety Certificate Preview"
                                sx={{ height: 200, objectFit: 'contain', borderRadius: 2 }}
                            />
                        )}
                    </Card>
                </Grid>
            </Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                sx={{ mt: 4, width: '100%' }}
                disabled={uploading}
            >
                {uploading ? <CircularProgress size={24} /> : 'Tải ảnh lên'}
            </Button>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}

export default UploadImagePage;
