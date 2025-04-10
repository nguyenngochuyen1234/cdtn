import React, { useEffect, useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ownerApi from '@/api/ownApi';
import axios from 'axios';

const shopApi = {
    uploadMultipleImage: (files: File[], email: string) =>
        axios.post('http://localhost:8080/shops/upload-multiple-images', { files, email }),
};

interface Restaurant {
    name: string;
    email: string;
    description: string;
    urlWebsite: string;
    avatar: string | File;
    mediaUrls: (string | File)[];
}

const BusinessInfo: React.FC = () => {
    const [restaurant, setRestaurant] = useState<Restaurant>({
        name: '',
        email: '',
        description: '',
        urlWebsite: '',
        avatar: '',
        mediaUrls: [],
    });
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string>('');

    useEffect(() => {
        fetchData();
        return () => {
            if (restaurant.avatar instanceof File) {
                URL.revokeObjectURL(restaurant.avatar);
            }
            restaurant.mediaUrls.forEach((url) => {
                if (url instanceof File) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []);
    const handleRemoveImage = (indexToRemove: number) => {
        const updatedMediaUrls = restaurant.mediaUrls.filter((_, index) => index !== indexToRemove);

        setRestaurant((prev) => ({
            ...prev,
            mediaUrls: updatedMediaUrls,
        }));
    };

    const fetchData = async () => {
        try {
            const res = await ownerApi.getShop();
            if (res.data.success) {
                setRestaurant(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching shop data:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'avatar' | 'mediaUrls'
    ) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            if (field === 'avatar' && restaurant.avatar instanceof File) {
                URL.revokeObjectURL(restaurant.avatar);
            } else if (field === 'mediaUrls') {
                restaurant.mediaUrls.forEach((url) => {
                    if (url instanceof File) URL.revokeObjectURL(url);
                });
            }
            setRestaurant({
                ...restaurant,
                [field]: field === 'avatar' ? files[0] : files,
            });
            setUploadError('');
        }
    };

    const updateRestaurant = async () => {
        setUploading(true);
        setUploadError('');

        try {
            if (restaurant.avatar instanceof File) {
                const formData = new FormData();
                formData.append('file', restaurant.avatar);
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
                    setRestaurant((prev) => ({
                        ...prev,
                        avatar: response.data.data,
                    }));
                } else {
                    throw new Error('Không nhận được URL ảnh đại diện từ server.');
                }
            }

            const newMediaFiles = restaurant.mediaUrls.filter(
                (url) => url instanceof File
            ) as File[];
            if (newMediaFiles.length > 0) {
                const mediaUrls = await shopApi.uploadMultipleImage(
                    newMediaFiles,
                    restaurant.email
                );
                if (mediaUrls.data.success) {
                    setRestaurant((prev) => ({
                        ...prev,
                        mediaUrls: prev.mediaUrls.filter((url) => !(url instanceof File)),
                    }));
                } else {
                    throw new Error('Không nhận được URL ảnh từ server.');
                }
            }
            console.log(restaurant);
            const res = await ownerApi.updateShop(restaurant);
            if (res.data.success) {
                alert('Cập nhật thành công!');
                fetchData();
            } else {
                throw new Error('Cập nhật thông tin doanh nghiệp thất bại!');
            }
        } catch (error: any) {
            console.error('Error updating restaurant:', error);
            setUploadError(error.message || 'Có lỗi xảy ra khi cập nhật!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Cập nhật thông tin doanh nghiệp
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
                        onChange={(e) => handleFileChange(e, 'avatar')}
                    />
                    {restaurant.avatar && (
                        <img
                            src={
                                restaurant.avatar instanceof File
                                    ? URL.createObjectURL(restaurant.avatar)
                                    : restaurant.avatar
                            }
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
                        onChange={(e) => handleFileChange(e, 'mediaUrls')}
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
                            <div
                                key={index}
                                style={{
                                    position: 'relative',
                                    width: 100,
                                    height: 100,
                                }}
                            >
                                <img
                                    src={url instanceof File ? URL.createObjectURL(url) : url}
                                    alt={`Media ${index}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: 4,
                                    }}
                                />
                                <Button
                                    size="small"
                                    onClick={() => handleRemoveImage(index)}
                                    style={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        minWidth: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        padding: 0,
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        fontSize: '16px',
                                        lineHeight: 1,
                                    }}
                                >
                                    ×
                                </Button>
                            </div>
                        ))}
                    </div>

                    {uploadError && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {uploadError}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={updateRestaurant}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                            'Lưu thông tin'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
};

export default BusinessInfo;
