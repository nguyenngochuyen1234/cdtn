import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Grid, Container, Box, Snackbar, CircularProgress } from '@mui/material';
import { RegisterUser } from '@/models';
import authApi from '@/api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/redux/stores';
import provincesApi from '@/api/provincesApi';
import AddressSelector from '@/components/AddressSelector';
import { setNewShop } from '@/redux/createShop';

const RegisterAccountShopPage = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const store = useSelector((state: RootState) => state.newShop.newShop);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterUser>();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const password = watch('password', '');
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
    const onSubmit = async (data: RegisterUser) => {
        setLoading(true);
        try {
            const result: AxiosResponse = await authApi.registerShop({
                email: data.email,
                password: data.password,
                phone: data.phone,
                city: selectedProvince,
                ward: selectedWard,
                district: selectedDistrict,
            });
            if (result?.data?.success) {
                localStorage.setItem('EMAIL_BIZ', data.email);
                dispatch(setNewShop({ ...data, ...store }));
                setSnackbar({ open: true, message: 'Đăng ký thành công!', severity: 'success' });
                navigate('/biz/create-tag');
            } else {
                setSnackbar({
                    open: true,
                    message: result?.data?.message,
                    severity: 'error',
                });
            }
        } catch (err) {
            console.log(err);
            setSnackbar({
                open: true,
                message: 'Có lỗi xảy ra. Vui lòng thử lại.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };
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

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Box sx={{ my: 4 }}>
                <Grid container spacing={2}>
                    <h2>Đăng Ký Tài Khoản</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            {[
                                // { name: 'username', label: 'Username' },
                                { name: 'email', label: 'Email *'},
                                { name: 'password', label: 'Mật khẩu *', type: 'password' },
                                {
                                    name: 'confirmPassword',
                                    label: 'Nhập lại mật khẩu *',
                                    type: 'password',
                                },
                                { name: 'phone', label: 'Số điện thoại *' },
                            ].map(({ name, label, type = 'text' }) => (
                                <Grid item xs={12} sm={6} key={name}>
                                    <Controller
                                        name={name as keyof RegisterUser}
                                        control={control}
                                        rules={{
                                            required: `${label} là trường bắt buộc`,
                                            validate:
                                                name === 'confirmPassword'
                                                    ? (value) =>
                                                          value === watch('password') ||
                                                          'Mật khẩu không khớp'
                                                    : undefined,
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label={label}
                                                type={type}
                                                fullWidth
                                                error={!!errors[name as keyof RegisterUser]}
                                                helperText={
                                                    errors[name as keyof RegisterUser]?.message
                                                }
                                                InputLabelProps={
                                                    type === 'date' ? { shrink: true } : undefined
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                            ))}
                            <Grid item xs={24} sm={12}>
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
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, position: 'relative' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress
                                    size={24}
                                    sx={{ color: 'white', position: 'absolute' }}
                                />
                            ) : (
                                'Tiếp theo'
                            )}
                        </Button>
                    </form>
                </Grid>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
};

export default RegisterAccountShopPage;
