'use client';
import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    Grid,
    IconButton,
    Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EditIcon from '@mui/icons-material/Edit';
import { vi } from 'date-fns/locale';
import provincesApi from '@/api/provincesApi';
import userApi from '@/api/userApi';
import { User } from '@/models';

interface Province {
    code: string;
    name: string;
}

interface District {
    code: string;
    name: string;
}

interface Ward {
    code: string;
    name: string;
}

export default function UserProfile() {
    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [date, setDate] = useState<Date | null>(new Date());
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [formData, setFormData] = useState<User>({
        username: '',
        id: '',
        avatar: '',
        email: '',
        role: [],
        phone: '',
        dateOfBirth: '',
        statusUser: 'ACTIVE',
        city: '',
        district: '',
        ward: '',
        ratingUser: 0,
        quantityImage: 0,
        helpful: 0,
        notLike: 0,
        like: 0,
        firstName: '',
        lastName: '',
        activeCode: '',
    });

    // Lấy thông tin user từ API bằng token
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await userApi.getUser();
                if (response?.data) {
                    const userData = response.data.data;
                    console.log(userData);
                    setFormData({ ...userData });
                    setDate(userData.dateOfBirth ? new Date(userData.dateOfBirth) : new Date());
                    setSelectedProvince(userData.city || '');
                    setSelectedDistrict(userData.district || '');
                    setSelectedWard(userData.ward || '');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    // Lấy danh sách tỉnh/thành phố
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await provincesApi.getProvince();
                setProvinces(response.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchProvinces();
    }, []);

    // Lấy danh sách quận/huyện khi chọn tỉnh/thành phố
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await provincesApi.getDistrict(selectedProvince);
                    setDistricts(response.data.districts);
                    if (!isEditing) {
                        setSelectedDistrict(formData?.district || '');
                    } else {
                        setSelectedDistrict('');
                    }
                    setWards([]);
                    setSelectedWard('');
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            };
            fetchDistricts();
        }
    }, [selectedProvince, isEditing, formData?.district]);

    // Lấy danh sách phường/xã khi chọn quận/huyện
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await provincesApi.getWard(selectedDistrict);
                    setWards(response.data.wards);
                    if (!isEditing) {
                        setSelectedWard(formData?.ward || '');
                    } else {
                        setSelectedWard('');
                    }
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            };
            fetchWards();
        }
    }, [selectedDistrict, isEditing, formData?.ward]);

    // Xử lý thay đổi form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Xử lý thay đổi password fields
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
        setPasswordError('');
    };

    // Xử lý lưu thông tin
    const handleSave = async () => {
        const updatedData: User = {
            ...formData,
            city: selectedProvince,
            district: selectedDistrict,
            ward: selectedWard,
            dateOfBirth: date ? date.toISOString() : new Date().toISOString(),
        };
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await userApi.updateProfile(updatedData);
            if (response.data) {
                setFormData({ ...response.data.data });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    // Xử lý đổi mật khẩu
    const handleChangePassword = async () => {
        // Validate passwords
        if (
            !passwordData.oldPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {
            setPasswordError('Vui lòng điền đầy đủ các trường');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        try {
            const response = await userApi.changePassword({
                newPassword: passwordData.newPassword,
            });
            if (response.data.success) {
                // Clear password fields
                setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setOpenPasswordDialog(false);
                // Logout
                localStorage.removeItem('access_token');
                window.location.href = '/auth/login'; // Redirect to login page
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError('Đổi mật khẩu thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4} alignItems="stretch">
                    {/* Thông tin cá nhân */}
                    <Grid item xs={12} lg={8}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 3,
                            }}
                        >
                            <Typography variant="h6">Thông tin về bản thân</Typography>
                            {isEditing ? (
                                <Box>
                                    <Button onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>
                                        Hủy
                                    </Button>
                                    <Button variant="contained" onClick={handleSave}>
                                        Lưu
                                    </Button>
                                </Box>
                            ) : (
                                <Box>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsEditing(true)}
                                        sx={{ mr: 1 }}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => setOpenPasswordDialog(true)}
                                    >
                                        Đổi mật khẩu
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Stack spacing={3}>
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Họ"
                                        name="firstName"
                                        value={formData?.firstName || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        disabled={!isEditing}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton>
                                                    <EditIcon />
                                                </IconButton>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Tên"
                                        name="lastName"
                                        value={formData?.lastName || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        disabled={!isEditing}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton>
                                                    <EditIcon />
                                                </IconButton>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                <DatePicker
                                    label="Ngày sinh"
                                    value={date}
                                    onChange={(newValue) => setDate(newValue)}
                                    disabled={!isEditing}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton>
                                                        <EditIcon />
                                                    </IconButton>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>

                            <TextField
                                label="Số điện thoại"
                                name="phone"
                                value={formData?.phone || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={!isEditing}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton>
                                            <EditIcon />
                                        </IconButton>
                                    ),
                                }}
                            />

                            <TextField
                                label="Địa chỉ"
                                value={
                                    selectedWard && selectedDistrict && selectedProvince
                                        ? `${wards.find((w) => w.code === selectedWard)?.name || ''}, ${
                                              districts.find((d) => d.code === selectedDistrict)
                                                  ?.name || ''
                                          }, ${provinces.find((p) => p.code === selectedProvince)?.name || ''}`
                                        : 'Phường Phúc Xá, Quận Ba Đình, Hà Nội'
                                }
                                fullWidth
                                disabled={!isEditing}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => setOpenAddressDialog(true)}
                                            disabled={!isEditing}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Stack>
                    </Grid>

                    {/* Thống kê cảm xúc */}
                    <Grid item xs={12} lg={4}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Thống kê cảm xúc
                        </Typography>
                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <ThumbUpIcon sx={{ color: 'success.main', fontSize: 28 }} />
                                <Typography variant="body1">
                                    Thích: {formData?.like || 0}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <HelpOutlineIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                                <Typography variant="body1">
                                    Hữu ích: {formData?.helpful || 0}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <ThumbDownIcon sx={{ color: 'error.main', fontSize: 28 }} />
                                <Typography variant="body1">
                                    Không thích: {formData?.notLike || 0}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>

            {/* Dialog chọn địa chỉ */}
            <Dialog
                open={openAddressDialog}
                onClose={() => setOpenAddressDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Chọn địa chỉ</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ py: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Tỉnh/Thành phố</InputLabel>
                            <Select
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                                label="Tỉnh/Thành phố"
                            >
                                {provinces.map((province) => (
                                    <MenuItem key={province.code} value={province.code}>
                                        {province.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth disabled={!selectedProvince}>
                            <InputLabel>Quận/Huyện</InputLabel>
                            <Select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                label="Quận/Huyện"
                            >
                                {districts.map((district) => (
                                    <MenuItem key={district.code} value={district.code}>
                                        {district.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth disabled={!selectedDistrict}>
                            <InputLabel>Phường/Xã</InputLabel>
                            <Select
                                value={selectedWard}
                                onChange={(e) => setSelectedWard(e.target.value)}
                                label="Phường/Xã"
                            >
                                {wards.map((ward) => (
                                    <MenuItem key={ward.code} value={ward.code}>
                                        {ward.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddressDialog(false)}>Hủy</Button>
                    <Button onClick={() => setOpenAddressDialog(false)} variant="contained">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog đổi mật khẩu */}
            <Dialog
                open={openPasswordDialog}
                onClose={() => setOpenPasswordDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ py: 2 }}>
                        <TextField
                            label="Mật khẩu cũ"
                            name="oldPassword"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            fullWidth
                            error={!!passwordError}
                        />
                        <TextField
                            label="Mật khẩu mới"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            fullWidth
                            error={!!passwordError}
                        />
                        <TextField
                            label="Xác nhận mật khẩu mới"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            fullWidth
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPasswordDialog(false)}>Hủy</Button>
                    <Button onClick={handleChangePassword} variant="contained">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
