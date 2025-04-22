'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Grid,
    Box,
    Divider,
    Paper,
    Container,
    IconButton,
    Alert,
    Snackbar,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ownerApi from '@/api/ownApi';
import axios from 'axios';
import { toast } from 'react-toastify';

interface StoreCreation {
    statusShopEnums?: 'ACTIVE' | 'DEACTIVE' | 'BANNED';
    id?: string;
    name?: string;
    avatar?: string | File;
    imageBusiness?: string | File;
    email?: string;
    mediaUrls?: string[] | File[];
    description?: string;
    urlWebsite?: string;
    openTimeRequests?: Array<{
        dayOfWeekEnum?: string;
        openTime?: string;
        closeTime?: string;
        dayOff?: boolean;
    }>;
    city?: string;
    ward?: string;
    district?: string;
    longitude?: number;
    latitude?: number;
    categoryEnum?: string;
    idCategory?: string;
    phone?: string;
    owner?: boolean;
    codeCity?: number;
    codeWard?: number;
    codeDistrict?: number;
}

interface Restaurant {
    name: string;
    email: string;
    description: string;
    urlWebsite: string;
    avatar: string | File | null;
    mediaUrls: string[];
    imageBusiness: string[];
}

const shopApi = {
    uploadMultipleImage: async (files: File[], email: string) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('email', email);
        return axios.put('http://localhost:8080/shops/upload-multiple-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            },
        });
    },
};

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ImagePreview = styled(Paper)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: 150,
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover .delete-button': {
        opacity: 1,
    },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    opacity: 0,
    transition: 'opacity 0.2s',
    '&:hover': {
        backgroundColor: theme.palette.error.dark,
    },
    width: 30,
    height: 30,
    padding: 0,
}));

const StyledImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const BusinessInfo: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const [store, setStore] = useState<StoreCreation>({});
    const [restaurant, setRestaurant] = useState<Restaurant>({
        name: '',
        email: '',
        description: '',
        urlWebsite: '',
        avatar: null,
        mediaUrls: [],
        imageBusiness: [],
    });
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [openImageModal, setOpenImageModal] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
        return () => {
            if (restaurant.avatar instanceof File) {
                URL.revokeObjectURL(restaurant.avatar);
            }
            restaurant.imageBusiness.forEach((url) => {
                if (url instanceof File) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []);

    const fetchData = async () => {
        try {
            const res = await ownerApi.getShop();
            if (res.data.success) {
                const shopData = res.data.data;
                setStore(shopData); // Lưu toàn bộ dữ liệu cửa hàng
                setRestaurant({
                    name: shopData.name || '',
                    email: shopData.email || '',
                    description: shopData.description || '',
                    urlWebsite: shopData.urlWebsite || '',
                    avatar: shopData.avatar || null,
                    mediaUrls: shopData.mediaUrls || [],
                    imageBusiness: shopData.imageBusiness ? [shopData.imageBusiness] : [],
                });
            }
        } catch (error) {
            console.error('Error fetching shop data:', error);
            setUploadError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            setOpenSnackbar(true);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'avatar' | 'mediaUrls' | 'imageBusiness'
    ) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setUploading(true);
            try {
                if (field === 'avatar') {
                    if (restaurant.avatar instanceof File) {
                        URL.revokeObjectURL(restaurant.avatar);
                    }
                    const formData = new FormData();
                    formData.append('file', files[0]);
                    formData.append('email', restaurant.email);
                    const response = await axios.put(
                        'http://localhost:8080/shops/upload-image-shop',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Accept: 'application/json',
                            },
                        }
                    );
                    if (response.data.success) {
                        setRestaurant({
                            ...restaurant,
                            avatar: response.data.data,
                        });
                    }
                } else if (field === 'mediaUrls') {
                    if (restaurant.mediaUrls.length + files.length > 10) {
                        throw new Error('Tối đa 10 ảnh cửa hàng.');
                    }
                    const response = await shopApi.uploadMultipleImage(files, restaurant.email);
                    setRestaurant({
                        ...restaurant,
                        mediaUrls: [...restaurant.mediaUrls, ...response.data.data],
                    });
                } else if (field === 'imageBusiness') {
                    const formData = new FormData();
                    formData.append('file', files[0]);
                    formData.append('email', restaurant.email);
                    const response = await axios.put(
                        'http://localhost:8080/shops/upload-image-shop',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Accept: 'application/json',
                            },
                        }
                    );
                    if (response.data.success) {
                        setRestaurant({
                            ...restaurant,
                            imageBusiness: [response.data.data],
                        });
                    }
                }
                setSuccessMessage('Tải ảnh lên thành công!');
                setOpenSnackbar(true);
            } catch (error: any) {
                console.error('Error uploading files:', error);
                setUploadError(error.message || 'Có lỗi khi tải ảnh lên!');
                setOpenSnackbar(true);
            } finally {
                setUploading(false);
            }
        }
    };

    const handleRemoveImage = (field: 'mediaUrls' | 'imageBusiness', indexToRemove: number) => {
        if (field === 'mediaUrls') {
            const updatedMediaUrls = restaurant.mediaUrls.filter(
                (_, index) => index !== indexToRemove
            );
            setRestaurant({ ...restaurant, mediaUrls: updatedMediaUrls });
            setSuccessMessage('Xóa ảnh thành công!');
            setOpenSnackbar(true);
        } else {
            const updatedImageBusiness = restaurant.imageBusiness.filter(
                (_, index) => index !== indexToRemove
            );
            setRestaurant({ ...restaurant, imageBusiness: updatedImageBusiness });
            setSuccessMessage('Xóa ảnh giấy phép thành công!');
            setOpenSnackbar(true);
        }
    };

    const updateRestaurant = async () => {
        if (!restaurant.name) {
            toast.error('Vui lòng nhập tên doanh nghiệp');
            return;
        }
        setUploading(true);
        setUploadError('');

        try {
            const updatedStore: StoreCreation = {
                ...store,
                name: restaurant.name,
                email: restaurant.email,
                description: restaurant.description,
                urlWebsite: restaurant.urlWebsite,
                avatar: restaurant.avatar || undefined,
                mediaUrls: [],
                imageBusiness:
                    restaurant.imageBusiness.length > 0 ? restaurant.imageBusiness[0] : undefined,
            };

            const res = await ownerApi.updateShop(updatedStore);
            if (res.data.success) {
                setSuccessMessage('Cập nhật thông tin thành công!');
                setOpenSnackbar(true);
                fetchData();
            } else {
                throw new Error('Cập nhật thông tin doanh nghiệp thất bại!');
            }
        } catch (error: any) {
            console.error('Error updating restaurant:', error);
            setUploadError(error.message || 'Có lỗi xảy ra khi cập nhật!');
            setOpenSnackbar(true);
        } finally {
            setUploading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenImageModal = () => {
        setOpenImageModal(true);
    };

    const handleCloseImageModal = () => {
        setOpenImageModal(false);
    };

    const renderImageGrid = (images: string[], field: 'mediaUrls' | 'imageBusiness') => {
        const displayImages = field === 'mediaUrls' ? images.slice(0, 5) : images;
        return (
            <Grid container spacing={2}>
                {displayImages.map((url, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                        <ImagePreview elevation={3}>
                            <StyledImage src={url} alt={`Image ${index}`} />
                            <DeleteButton
                                className="delete-button"
                                size="small"
                                onClick={() => handleRemoveImage(field, index)}
                            >
                                <DeleteIcon fontSize="small" />
                            </DeleteButton>
                        </ImagePreview>
                    </Grid>
                ))}
                {field === 'mediaUrls' && images.length > 5 && (
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={handleOpenImageModal}
                            fullWidth
                        >
                            Xem tất cả ảnh ({images.length})
                        </Button>
                    </Grid>
                )}
            </Grid>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="lg">
                <Card sx={{ width: '100%', margin: 'auto', mt: 4, mb: 4 }}>
                    <CardContent>
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                        >
                            <BusinessIcon sx={{ mr: 1 }} />
                            Cập nhật thông tin doanh nghiệp
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <StoreIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Thông tin cơ bản
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <TextField
                                        label="Tên nhà hàng"
                                        name="name"
                                        value={restaurant.name}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <TextField
                                        label="Website"
                                        name="urlWebsite"
                                        value={restaurant.urlWebsite}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <TextField
                                        label="Mô tả"
                                        name="description"
                                        value={restaurant.description}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                    />

                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Ảnh đại diện
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    border: '1px solid #ddd',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#f5f5f5',
                                                }}
                                            >
                                                {restaurant.avatar ? (
                                                    <img
                                                        src={
                                                            restaurant.avatar instanceof File
                                                                ? URL.createObjectURL(
                                                                      restaurant.avatar
                                                                  )
                                                                : restaurant.avatar
                                                        }
                                                        alt="Avatar"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                ) : (
                                                    <StoreIcon
                                                        sx={{ fontSize: 40, color: '#bdbdbd' }}
                                                    />
                                                )}
                                            </Box>
                                            <Button
                                                component="label"
                                                variant="contained"
                                                startIcon={<AddPhotoAlternateIcon />}
                                                disabled={uploading}
                                            >
                                                Chọn ảnh
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, 'avatar')}
                                                />
                                            </Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Right column - Images */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <DescriptionIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Giấy phép kinh doanh
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<AddPhotoAlternateIcon />}
                                        fullWidth={isMobile}
                                        sx={{ mb: 2 }}
                                        disabled={uploading}
                                    >
                                        Thêm ảnh giấy phép
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'imageBusiness')}
                                        />
                                    </Button>

                                    {restaurant.imageBusiness.length > 0 ? (
                                        renderImageGrid(restaurant.imageBusiness, 'imageBusiness')
                                    ) : (
                                        <Box
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                backgroundColor: '#f5f5f5',
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Typography color="textSecondary">
                                                Chưa có ảnh giấy phép kinh doanh
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>

                                <Paper elevation={2} sx={{ p: 3 }}>
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <AddPhotoAlternateIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Ảnh từ cửa hàng
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<AddPhotoAlternateIcon />}
                                        fullWidth={isMobile}
                                        sx={{ mb: 2 }}
                                        disabled={uploading}
                                    >
                                        Thêm ảnh cửa hàng
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleFileChange(e, 'mediaUrls')}
                                        />
                                    </Button>

                                    {restaurant.mediaUrls.length > 0 ? (
                                        renderImageGrid(restaurant.mediaUrls, 'mediaUrls')
                                    ) : (
                                        <Box
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                backgroundColor: '#f5f5f5',
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Typography color="textSecondary">
                                                Chưa có ảnh cửa hàng
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={updateRestaurant}
                                disabled={uploading}
                                sx={{
                                    minWidth: isMobile ? '100%' : 200,
                                    py: 1.5,
                                }}
                            >
                                {uploading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    'Lưu thông tin'
                                )}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>

            <Dialog open={openImageModal} onClose={handleCloseImageModal} maxWidth="md" fullWidth>
                <DialogTitle>Tất cả ảnh cửa hàng</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {restaurant.mediaUrls.map((url, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                                <ImagePreview elevation={3}>
                                    <StyledImage src={url} alt={`Image ${index}`} />
                                    <DeleteButton
                                        className="delete-button"
                                        size="small"
                                        onClick={() => handleRemoveImage('mediaUrls', index)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </DeleteButton>
                                </ImagePreview>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={uploadError ? 'error' : 'success'}
                    sx={{ width: '100%' }}
                >
                    {uploadError || successMessage}
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
};

export default BusinessInfo;
