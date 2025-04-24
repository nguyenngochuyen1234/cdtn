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
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({
        'shop-logo': false,
        'food-safety': false,
    });
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleFileChange =
        (type: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
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

                // Trigger upload immediately
                setUploading((prev) => ({ ...prev, [type]: true }));
                const email = localStorage.getItem('EMAIL_BIZ');
                if (!email) {
                    setSnackbar({
                        open: true,
                        message: 'Không tìm thấy email. Vui lòng đăng nhập lại.',
                        severity: 'error',
                    });
                    setUploading((prev) => ({ ...prev, [type]: false }));
                    return;
                }

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
                        if (type === 'shop-logo') {
                            localStorage.setItem('AVATAR', data.data);
                        } else if (type === 'food-safety') {
                            localStorage.setItem('IMAGE_BUSINESS', data.data);
                        }
                        setSnackbar({
                            open: true,
                            message: `Tải lên ${type === 'shop-logo' ? 'ảnh đại diện' : 'giấy phép kinh doanh'} thành công!`,
                            severity: 'success',
                        });
                    } else {
                        throw new Error(`Không thể tải lên ${type}.`);
                    }
                } catch (error: any) {
                    setSnackbar({
                        open: true,
                        message:
                            error.message ||
                            `Tải lên ${type === 'shop-logo' ? 'ảnh đại diện' : 'giấy phép kinh doanh'} thất bại. Vui lòng thử lại.`,
                        severity: 'error',
                    });
                } finally {
                    setUploading((prev) => ({ ...prev, [type]: false }));
                }
            }
        };

    const handleFinish = () => {
        if (!localStorage.getItem('AVATAR') || !localStorage.getItem('IMAGE_BUSINESS')) {
            setSnackbar({
                open: true,
                message:
                    'Vui lòng tải lên cả ảnh đại diện và giấy phép kinh doanh trước khi hoàn tất.',
                severity: 'error',
            });
            return;
        }
        navigate('/finish-create-shop');
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
                                disabled={uploading['shop-logo']}
                            />
                            {imageFiles['shop-logo'] && (
                                <Typography variant="body2" color="text.secondary">
                                    {uploading['shop-logo']
                                        ? 'Đang tải lên...'
                                        : `Đã chọn: ${imageFiles['shop-logo']?.name}`}
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
                                disabled={uploading['food-safety']}
                            />
                            {imageFiles['food-safety'] && (
                                <Typography variant="body2" color="text.secondary">
                                    {uploading['food-safety']
                                        ? 'Đang tải lên...'
                                        : `Đã chọn: ${imageFiles['food-safety']?.name}`}
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
                color="success"
                onClick={handleFinish}
                sx={{ mt: 4, width: '100%' }}
            >
                Tiếp theo
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
