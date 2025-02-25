import userApi from '@/api/userApi';
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    TextField,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import AddressSelector from '@/components/AddressSelector';
import provincesApi from '@/api/provincesApi';

interface UserProfile {
    avatar: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    city: string;
    district: string;
    ward: string;
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchUser();
    }, []);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const fetchUser = async () => {
        try {
            const userData = await userApi.getUser();
            if (userData.data.success) {
                const userDataObj = userData.data.data;
                setUser(userDataObj);
                setFormData(userDataObj);
                setBirthDate(dayjs(userDataObj.birthDate));

                // Cập nhật tỉnh/thành phố trước
                setSelectedProvince(userDataObj.city);

                // Gọi fetch danh sách huyện/xã sau khi set tỉnh
                if (userDataObj.city) {
                    fetchDistricts(userDataObj.city).then(() => {
                        setSelectedDistrict(userDataObj.district);

                        if (userDataObj.district) {
                            fetchWards(userDataObj.district).then(() => {
                                setSelectedWard(userDataObj.ward);
                            });
                        }
                    });
                }
            }
        } catch (error) {
            showSnackbar('Lỗi khi tải thông tin người dùng!', 'error');
        }
    };

    const updateUser = async () => {
        if (!formData) return;
        setLoading(true);
        try {
            if (avatarFile) {
                await userApi.uploadImage(avatarFile);
            }
            const updatedUserData = {
                ...formData,
                birthDate: birthDate?.format('YYYY-MM-DD') || '',
                city: selectedProvince,
                ward: selectedWard,
                district: selectedDistrict,
            };
            const response = await userApi.updateProfile(updatedUserData);
            if (response.data.success) {
                setUser(updatedUserData);
                setFormData(updatedUserData);
                setIsEditing(false);
                showSnackbar(response.data.message, 'success');
            } else {
                showSnackbar(response.data.message, 'error');
            }
        } catch (error) {
            showSnackbar('Lỗi khi cập nhật thông tin!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData!, [e.target.name]: e.target.value });
    };

    const handleBirthDateChange = (newDate: Dayjs | null) => {
        setBirthDate(newDate);
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData((prev) => ({ ...prev!, avatar: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };
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

    const handleProvinceChange = (provinceCode: string) => {
        setSelectedProvince(provinceCode);
        setSelectedDistrict('');
        setSelectedWard('');
        fetchDistricts(provinceCode);
    };

    const handleDistrictChange = (districtCode: string) => {
        setSelectedDistrict(districtCode);
        setSelectedWard('');
        fetchWards(districtCode);
    };

    const handleWardChange = (wardCode: string) => {
        setSelectedWard(wardCode);
    };

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

    return (
        <Card sx={{ maxWidth: 700, margin: 'auto', padding: 2 }}>
            <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        src={formData?.avatar}
                        sx={{ width: 150, height: 150, marginBottom: 2 }}
                    />
                    {isEditing && (
                        <Button variant="outlined" component="label" sx={{ marginBottom: 2 }}>
                            Chọn ảnh
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </Button>
                    )}
                    <Typography variant="h5" gutterBottom>
                        {user?.firstName} {user?.lastName}
                    </Typography>
                    <TextField
                        label="Email"
                        name="email"
                        value={formData?.email || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        disabled={!isEditing}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Số điện thoại"
                        name="phone"
                        value={formData?.phone || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        disabled={!isEditing}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Ngày sinh"
                            value={birthDate}
                            onChange={handleBirthDateChange}
                            disabled={!isEditing}
                            format="DD/MM/YYYY"
                            slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                        />
                    </LocalizationProvider>
                    <AddressSelector
                        disable={!isEditing}
                        provinces={provinces}
                        districts={districts}
                        wards={wards}
                        selectedProvince={selectedProvince}
                        selectedDistrict={selectedDistrict}
                        selectedWard={selectedWard}
                        onProvinceChange={handleProvinceChange}
                        onDistrictChange={handleDistrictChange}
                        onWardChange={handleWardChange}
                    />
                    {isEditing ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={updateUser}
                            sx={{ marginTop: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Lưu'}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsEditing(true)}
                            sx={{ marginTop: 2 }}
                        >
                            Chỉnh sửa
                        </Button>
                    )}
                </div>
            </CardContent>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default ProfilePage;
