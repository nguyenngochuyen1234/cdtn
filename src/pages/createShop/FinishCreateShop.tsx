import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    FormControl,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import { StoreCreation } from '@/models';
import AddressSelector from '@/components/AddressSelector';
import provincesApi from '@/api/provincesApi';
import shopApi from '@/api/shopApi';

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
        owner: false,
    });

    const [imagePreviews, setImagePreviews] = useState<{
        avatar: string | null;
        imageBusiness: string | null;
        mediaUrls: string[] | null;
    }>({
        avatar: null,
        mediaUrls: null,
        imageBusiness: null,
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await provincesApi.getProvince();
                setProvinces(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh:', error);
            }
        };
        fetchProvinces();
    }, []);

    const fetchDistricts = async (provinceCode: string) => {
        try {
            const response = await provincesApi.getDistrict(provinceCode);
            setDistricts(response.data.districts);
            setWards([]);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách huyện:', error);
        }
    };

    const fetchWards = async (districtCode: string) => {
        try {
            const response = await provincesApi.getWard(districtCode);
            setWards(response.data.wards);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách xã/phường:', error);
        }
    };

    const handleProvinceChange = (provinceCode: string) => {
        setSelectedProvince(provinceCode);
        setSelectedDistrict('');
        setSelectedWard('');

        setFormData((prev) => ({
            ...prev,
            city: provinceCode,
        }));

        fetchDistricts(provinceCode);
    };

    const handleDistrictChange = (districtCode: string) => {
        setSelectedDistrict(districtCode);
        setSelectedWard('');

        setFormData((prev) => ({
            ...prev,
            district: districtCode,
        }));

        fetchWards(districtCode);
    };

    const handleWardChange = (wardCode: string) => {
        setSelectedWard(wardCode);

        setFormData((prev) => ({
            ...prev,
            ward: wardCode,
        }));
    };

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

    const handleAddOpenTime = () => {
        setFormData((prev) => ({
            ...prev,
            openTimeRequests: [
                ...(prev?.openTimeRequests || []),
                { dayOfWeekEnum: 'MONDAY', openTime: '', closeTime: '', dayOff: false },
            ],
        }));
    };

    const handleFileChange =
        (field: 'avatar' | 'imageBusiness' | 'mediaUrls') =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files ? Array.from(event.target.files) : [];
            if (field === 'avatar' && files.length > 0) {
                const file = files[0];
                setFormData((prev) => ({
                    ...prev,
                    avatar: file,
                }));
                setImagePreviews((prev) => ({
                    ...prev,
                    avatar: URL.createObjectURL(file),
                }));
            } else if (field === 'imageBusiness' && files.length > 0) {
                const file = files[0];
                setFormData((prev) => ({
                    ...prev,
                    imageBusiness: file,
                }));
                setImagePreviews((prev) => ({
                    ...prev,
                    imageBusiness: URL.createObjectURL(file),
                }));
            } else if (field === 'mediaUrls' && files.length > 0) {
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

        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.longitude) newErrors.longitude = 'Longitude is required';
        if (!formData.latitude) newErrors.latitude = 'Latitude is required';
        if (!selectedProvince) newErrors.province = 'Province is required';
        if (!selectedDistrict) newErrors.district = 'District is required';
        if (!selectedWard) newErrors.ward = 'Ward is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        const phoneRegex = /^[0-9]{10,15}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number';
        }
        console.log(newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            if (validateForm()) {
                console.log('Form data submitted:', formData);
                console.log('Avatar file:', formData.avatar);
                const avatarLink = await shopApi.uploadImageShop(
                    formData.avatar as File,
                    formData.email
                );
                console.log(avatarLink);

                setSnackbarMessage('Form submitted successfully!');
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
            <Typography variant="h4" className="mb-4 font-bold">
                Full Form
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                fullWidth
                                value={formData?.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                fullWidth
                                value={formData?.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone"
                                fullWidth
                                value={formData?.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Website URL"
                                fullWidth
                                value={formData?.urlWebsite}
                                onChange={(e) => handleInputChange('urlWebsite', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={formData?.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} spacing={2}>
                            <Grid>
                                <TextField
                                    label="Longitude"
                                    fullWidth
                                    type="number"
                                    value={formData?.longitude}
                                    onChange={(e) =>
                                        handleInputChange('longitude', parseFloat(e.target.value))
                                    }
                                />
                            </Grid>
                            <Grid style={{ marginTop: 8 }}>
                                <TextField
                                    label="Latitude"
                                    fullWidth
                                    type="number"
                                    value={formData?.latitude}
                                    onChange={(e) =>
                                        handleInputChange('latitude', parseFloat(e.target.value))
                                    }
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <AddressSelector
                                provinces={provinces}
                                districts={districts}
                                wards={wards}
                                selectedProvince={formData.city}
                                selectedDistrict={formData.district}
                                selectedWard={formData.ward}
                                onProvinceChange={handleProvinceChange}
                                onDistrictChange={handleDistrictChange}
                                onWardChange={handleWardChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.owner}
                                        onChange={(e) =>
                                            handleInputChange('owner', e.target.checked)
                                        }
                                    />
                                }
                                label="Owner"
                            />
                        </Grid>

                        {/* Open Time Requests Section */}
                        <Grid item xs={12} sm={8}>
                            <Typography variant="h6">Open Time Requests</Typography>
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
                                                            {day.charAt(0) +
                                                                day.slice(1).toLowerCase()}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                label="Open Time"
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
                                                label="Close Time"
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
                                                Remove
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                            <Button variant="outlined" onClick={handleAddOpenTime}>
                                Add Open Time
                            </Button>
                        </Grid>
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

                <Grid item xs={12} sm={4}>
                    <Box>
                        <Typography variant="h6" className="mb-2">
                            Avatar
                        </Typography>
                        <input type="file" accept="image/*" onChange={handleFileChange('avatar')} />
                        {imagePreviews.avatar && (
                            <Box mt={2}>
                                <img
                                    src={imagePreviews.avatar}
                                    alt="Avatar Preview"
                                    style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
                                />
                            </Box>
                        )}
                    </Box>

                    <Box mt={4}>
                        <Typography variant="h6" className="mb-2">
                            Business Images
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange('imageBusiness')}
                        />
                        <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                            {imagePreviews.imageBusiness && (
                                <img
                                    src={imagePreviews.imageBusiness}
                                    alt={`Business Image Preview`}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                    <Box mt={4}>
                        <Typography variant="h6" className="mb-2">
                            Media URLs
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange('mediaUrls')}
                        />
                        <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                            {imagePreviews.mediaUrls &&
                                imagePreviews.mediaUrls?.map((src, index) => (
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
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default App;
