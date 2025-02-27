'use client';

import { useState } from 'react';
import { Typography, TextField, Button, Paper, Box } from '@mui/material';
import { Upload, Select, Input } from 'antd';
import {
    PlusOutlined,
    EnvironmentOutlined,
    ArrowRightOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { RichTextEditor } from '@/components/RichTextEditor';

const { Option } = Select;

interface StoreFormData {
    name: string;
    category: string;
    address: string;
    profileImage: any[];
    licenseImage: any[];
    descriptionImages: any[];
    description: string;
    operatingHours: string;
}

export default function StoreCreationForm() {
    const [formData, setFormData] = useState<StoreFormData>({
        name: '',
        category: '',
        address: '',
        profileImage: [],
        licenseImage: [],
        descriptionImages: [],
        description: '',
        operatingHours: '',
    });

    const handleChange = (name: keyof StoreFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        // Handle form submission logic here
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Paper elevation={0} className="max-w-6xl mx-auto">
            {/* Breadcrumb and Title */}
            <Box className="mb-8">
                <Box className="flex items-center gap-2 text-sm mb-4">
                    <span>Bước 2</span>
                    <ArrowRightOutlined style={{ fontSize: '12px' }} />
                    <span className="text-red-600">Tạo mới cửa hàng</span>
                </Box>
                <Typography variant="h5" className="flex items-center gap-2">
                    Tạo mới cửa hàng
                    <ArrowRightOutlined style={{ fontSize: '16px' }} />
                </Typography>
            </Box>

            {/* Form */}
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <Box className="space-y-6">
                    {/* Store Name */}
                    <Box className="space-y-2">
                        <Typography variant="subtitle1" className="font-medium">
                            TÊN CỬA HÀNG
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Nhập tên cửa hàng"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                    </Box>

                    {/* Store Category */}
                    <Box className="space-y-2">
                        <Typography variant="subtitle1" className="font-medium flex items-center">
                            DANH MỤC CỬA HÀNG
                            <span className="text-red-600 ml-1">*</span>
                        </Typography>
                        <Select
                            placeholder="Chọn danh mục cửa hàng"
                            style={{ width: '100%' }}
                            onChange={(value) => handleChange('category', value)}
                            suffixIcon={<EditOutlined />}
                        >
                            <Option value="restaurant">Nhà hàng</Option>
                            <Option value="retail">Bán lẻ</Option>
                            <Option value="service">Dịch vụ</Option>
                        </Select>
                        <Input placeholder="Nhập tên danh mục" style={{ marginTop: '8px' }} />
                    </Box>

                    <Box className="flex space-x-4">
                        <Box className="w-1/2 space-y-2">
                            <Typography
                                variant="subtitle1"
                                className="font-medium flex items-center"
                            >
                                ẢNH ĐẠI DIỆN CỦA HÀNG
                                <span className="text-red-600 ml-1">*</span>
                            </Typography>
                            <Upload
                                listType="picture-card"
                                fileList={formData.profileImage}
                                onChange={({ fileList }) => handleChange('profileImage', fileList)}
                            >
                                {formData.profileImage.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Box>

                        <Box className="w-1/2 space-y-2">
                            <Typography
                                variant="subtitle1"
                                className="font-medium flex items-center"
                            >
                                ẢNH GIẤY PHÉP KINH DOANH
                                <span className="text-red-600 ml-1">*</span>
                            </Typography>
                            <Upload
                                listType="picture-card"
                                fileList={formData.licenseImage}
                                onChange={({ fileList }) => handleChange('licenseImage', fileList)}
                            >
                                {formData.licenseImage.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Box>
                    </Box>
                </Box>

                {/* Right Column */}
                <Box className="space-y-6">
                    {/* Store Address */}
                    <Box className="space-y-2">
                        <Typography variant="subtitle1" className="font-medium flex items-center">
                            ĐỊA CHỈ
                            <span className="text-red-600 ml-1">*</span>
                        </Typography>
                        <Input
                            placeholder="Nhập địa chỉ bài viết..."
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            suffix={<EnvironmentOutlined />}
                        />
                    </Box>

                    {/* Store Description Images */}
                    <Box className="space-y-2">
                        <Typography variant="subtitle1" className="font-medium flex items-center">
                            ẢNH MÔ TẢ CỬA HÀNG
                            <span className="text-red-600 ml-1">*</span>
                        </Typography>
                        <Upload
                            listType="picture-card"
                            fileList={formData.descriptionImages}
                            onChange={({ fileList }) => handleChange('descriptionImages', fileList)}
                        >
                            {formData.descriptionImages.length >= 8 ? null : uploadButton}
                        </Upload>
                    </Box>

                    <Box className="space-y-2 mt-6">
                        <Typography variant="h6" className="flex items-center">
                            Thông tin khác
                            <EditOutlined style={{ marginLeft: '8px' }} />
                        </Typography>

                        {/* Operating Hours */}
                        <Box className="space-y-2">
                            <Typography variant="subtitle1" className="font-medium">
                                THỜI GIAN HOẠT ĐỘNG
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Nhập thời gian hoạt động"
                                value={formData.operatingHours}
                                onChange={(e) => handleChange('operatingHours', e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className="space-y-2">
                <Typography variant="subtitle1" className="font-medium flex items-center">
                    MÔ TẢ CỬA HÀNG
                    <span className="text-red-600 ml-1">*</span>
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Nhập mô tả cửa hàng"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    variant="outlined"
                    size="small"
                    multiline
                    rows={4}
                />
            </Box>

            {/* Submit Button */}
            <Box className="mt-8 flex justify-center">
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleSubmit}
                    style={{
                        textTransform: 'none',
                        borderRadius: '4px',
                        padding: '8px 24px',
                    }}
                >
                    Yêu cầu tạo cửa hàng
                </Button>
            </Box>
        </Paper>
    );
}
