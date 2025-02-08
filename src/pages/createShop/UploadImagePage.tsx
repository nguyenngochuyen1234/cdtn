import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import axiosClient from '@/api/axiosClient';
import { useNavigate } from 'react-router-dom';

function UploadImagePage() {
    const navigate = useNavigate();

    const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>({
        'shop-logo': null,
        'food-safety': null,
    });
    const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string | null }>({
        'shop-logo': null,
        'food-safety': null,
    });
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string>('');
    const [uploadSuccess, setUploadSuccess] = useState<string>('');

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
            setUploadError('');
        }
    };

    const handleUpload = async () => {
        setUploading(true);
        setUploadError('');
        setUploadSuccess('');
        const email = localStorage.getItem('EMAIL_BIZ');
        if (email) {
            const uploadPromises = Object.entries(imageFiles).map(async ([type, file]) => {
                if (!file) return null;

                const formData = new FormData();
                formData.append('file', file);
                formData.append('email', email);
                try {
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

                    // if (response.status === 200) {
                    // navigate('/finish-create-shop');
                    //     return `${type} tải lên thành công.`;
                    // } else {
                    //     throw new Error(`${type} tải lên thất bại.`);
                    // }
                } catch (error) {
                    throw new Error(`Không thể tải lên ${type}.`);
                }
            });

            try {
                const results = await Promise.all(uploadPromises);
                const successMessages = results.filter((msg) => msg !== null).join('\n');
                setUploadSuccess(successMessages);
            } catch (error: any) {
                setUploadError(error.message);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3, boxShadow: 2, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Tải ảnh lên hệ thống
            </Typography>

            <Typography variant="body1" sx={{ mt: 3 }}>
                Chọn ảnh đại diện cửa hàng:
            </Typography>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange('shop-logo')}
                style={{ marginTop: 8 }}
            />
            {imageFiles['shop-logo'] && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Đã chọn file: {imageFiles['shop-logo']?.name}
                </Typography>
            )}
            {previewUrls['shop-logo'] && (
                <Box sx={{ mt: 2 }}>
                    <img
                        src={previewUrls['shop-logo']}
                        alt="Shop Logo Preview"
                        style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
                    />
                </Box>
            )}

            <Typography variant="body1" sx={{ mt: 3 }}>
                Chọn ảnh chứng nhận an toàn thực phẩm:
            </Typography>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange('food-safety')}
                style={{ marginTop: 8 }}
            />
            {imageFiles['food-safety'] && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Đã chọn file: {imageFiles['food-safety']?.name}
                </Typography>
            )}
            {previewUrls['food-safety'] && (
                <Box sx={{ mt: 2 }}>
                    <img
                        src={previewUrls['food-safety']}
                        alt="Food Safety Certificate Preview"
                        style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
                    />
                </Box>
            )}

            {uploadError && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {uploadError}
                </Typography>
            )}

            {uploadSuccess && (
                <Typography color="success.main" sx={{ mt: 2 }}>
                    {uploadSuccess}
                </Typography>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                sx={{ mt: 3, width: '100%' }}
                disabled={uploading}
            >
                {uploading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Tải ảnh lên'}
            </Button>
        </Box>
    );
}

export default UploadImagePage;
