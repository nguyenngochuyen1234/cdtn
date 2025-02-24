import userApi from '@/api/userApi';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar, TextField, Button } from '@mui/material';
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
    province: string;
    district: string;
    ward: string;
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [birthDate, setBirthDate] = useState<Dayjs | null>(null);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
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
    const fetchUser = async () => {
        try {
            const userData = await userApi.getUser();
            if (userData.data.success) {
                const userDataObj = userData.data.data;
                setUser(userDataObj);
                setFormData(userDataObj);
                setBirthDate(dayjs(userDataObj.birthDate)); // Convert string to dayjs
            }
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    const updateUser = async () => {
        if (!formData) return;
        try {
            const updatedUser = { ...formData, birthDate: birthDate?.format('YYYY-MM-DD') || '' };
            console.log({ updateUser });
            setUser(updatedUser);
            setFormData(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user data', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData!, [e.target.name]: e.target.value });
    };

    const handleBirthDateChange = (newDate: Dayjs | null) => {
        setBirthDate(newDate);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <Card sx={{ maxWidth: 500, margin: 'auto', padding: 2 }}>
            <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        src={formData?.avatar}
                        sx={{ width: 80, height: 80, marginBottom: 2 }}
                    />
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
                        >
                            Lưu
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
        </Card>
    );
};

export default ProfilePage;
