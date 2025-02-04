'use client';

import { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    Container,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import imageBackground from '@/assets/images/bgUser.png';
import provincesApi from '@/api/provincesApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import { User, UserProfile } from '@/models';
import userApi from '@/api/userApi';
interface SocialLink {
    platform: string;
    url: string;
}

export default function ProfilePage() {
    const [selectedTab, setSelectedTab] = useState(0);
    const user = useSelector((state: RootState) => state.user.user);
    const [profile, setProfile] = useState<UserProfile | null>(user);
    useEffect(() => {
        if (user) {
            console.log(user);
            setProfile(user);
        }
    }, [user]);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };
    const handleInputChange = (field: keyof UserProfile, value: string) => {
        if (field) {
            setProfile((prevProfile) => ({
                ...prevProfile,
                [field]: value,
            }));
        }
    };
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

    const handleProvinceChange = (event: SelectChangeEvent<string>) => {
        const provinceCode = event.target.value;
        setSelectedProvince(provinceCode);
        setSelectedDistrict('');
        setSelectedWard('');
        fetchDistricts(provinceCode);
    };

    const handleDistrictChange = (event: SelectChangeEvent<string>) => {
        const districtCode = event.target.value;
        setSelectedDistrict(districtCode);
        setSelectedWard('');
        fetchWards(districtCode);
    };

    const handleWardChange = (event: SelectChangeEvent<string>) => {
        setSelectedWard(event.target.value);
    };
    const updateUserProfile = async (field: keyof UserProfile, value: string) => {
        try {
            if (profile) {
                const { phone, city, avatar, ward, district, firstName, lastName, dateOfBirth } =
                    profile;
                const oldData: UserProfile = {
                    phone,
                    city,
                    avatar,
                    ward,
                    district,
                    firstName,
                    lastName,
                    dateOfBirth,
                };
                const updatedProfile: UserProfile = {
                    ...oldData,
                    [field]: value,
                };
                console.log(updatedProfile);
                const updatedUser = await userApi.updateProfile(updatedProfile);
            }
            // setProfile(updatedUser);
            alert('Cập nhật thành công!');
        } catch (error) {
            alert('Cập nhật thất bại!');
        }
    };
    const inputStyle = {
        flex: 1,
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none',
            },
        },
    };
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${imageBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: 4,
            }}
        >
            <Box sx={{ position: 'relative', mb: 8 }}>
                <Box
                    sx={{
                        height: 200,
                        backgroundImage:
                            "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrDlX6zaneCG2iU_wo4EWF8Qto6g0F2fOP7A&s')",
                        borderRadius: '16px',
                    }}
                />

                <Avatar
                    sx={{
                        width: 120,
                        height: 120,
                        border: '4px solid white',
                        position: 'absolute',
                        bottom: -60,
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                    src="/placeholder.svg"
                    alt={profile?.avatar}
                />
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleChange}
                    aria-label="Segmented buttons"
                    centered
                    TabIndicatorProps={{
                        style: { backgroundColor: 'red', height: 2 },
                    }}
                >
                    <Tab label="Tài khoản của tôi" />
                    <Tab label="Các bài đăng của tôi" />
                    <Tab label="Các hoạt động của tôi" />
                </Tabs>
            </Box>
            <Card sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '7 1 0', minWidth: 300 }}>
                        <Typography variant="h6" gutterBottom sx={{ marginBottom: 4 }}>
                            Thông tin về bản thân
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    label="Họ"
                                    value={profile?.firstName}
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: !!profile?.firstName,
                                    }}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onClick={(e) =>
                                        updateUserProfile('firstName', profile?.firstName || '')
                                    }
                                >
                                    Thay đổi
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    label="Tên"
                                    value={profile?.lastName}
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: !!profile?.lastName,
                                    }}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onClick={(e) =>
                                        updateUserProfile('lastName', profile?.lastName || '')
                                    }
                                >
                                    Thay đổi
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    label="Ngày sinh"
                                    value={profile?.dateOfBirth}
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: !!profile?.dateOfBirth,
                                    }}
                                    onChange={(e) =>
                                        handleInputChange('dateOfBirth', e.target.value)
                                    }
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onClick={(e) =>
                                        updateUserProfile('dateOfBirth', profile?.dateOfBirth || '')
                                    }
                                >
                                    Thay đổi
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    label="Số điện thoại"
                                    value={profile?.phone}
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: !!profile?.phone,
                                    }}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onClick={(e) =>
                                        updateUserProfile('phone', profile?.phone || '')
                                    }
                                >
                                    Thay đổi
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Tỉnh/Thành phố</InputLabel>
                                    <Select
                                        value={selectedProvince}
                                        onChange={handleProvinceChange}
                                    >
                                        {provinces.map((province: any) => (
                                            <MenuItem key={province.code} value={province.code}>
                                                {province.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onClick={(e) =>
                                        updateUserProfile('city', selectedProvince || '')
                                    }
                                >
                                    Thay đổi
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FormControl fullWidth disabled={!selectedProvince}>
                                    <InputLabel>Quận/Huyện</InputLabel>
                                    <Select
                                        value={selectedDistrict}
                                        onChange={handleDistrictChange}
                                    >
                                        {districts.map((district: any) => (
                                            <MenuItem key={district.code} value={district.code}>
                                                {district.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onClick={(e) =>
                                        updateUserProfile('district', selectedDistrict || '')
                                    }
                                >
                                    Thay đổi
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FormControl fullWidth disabled={!selectedDistrict}>
                                    <InputLabel>Xã/Phường</InputLabel>
                                    <Select value={selectedWard} onChange={handleWardChange}>
                                        {wards.map((ward: any) => (
                                            <MenuItem key={ward.code} value={ward.code}>
                                                {ward.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onClick={(e) => updateUserProfile('ward', selectedWard || '')}
                                >
                                    Thay đổi
                                </Button>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ flex: '3 1 0', minWidth: 200 }}>
                        <Typography variant="h6" gutterBottom>
                            Liên kết mạng xã hội khác
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton color="primary">
                                    <Facebook />
                                </IconButton>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    placeholder="https://www.facebook.com/"
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton color="primary">
                                    <Instagram />
                                </IconButton>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    placeholder="https://www.instagram.com/"
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton color="primary">
                                    <Twitter />
                                </IconButton>
                                <TextField
                                    sx={inputStyle}
                                    fullWidth
                                    placeholder="https://twitter.com/"
                                    variant="outlined"
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                    gap: 1,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Thay đổi
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}
