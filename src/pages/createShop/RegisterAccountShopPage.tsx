import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField,
    Button,
    Grid,
    Box,
    Snackbar,
    CircularProgress,
    Alert,
    Typography,
} from '@mui/material';
import { RegisterUser } from '@/models';
import authApi from '@/api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/redux/stores';
import provincesApi from '@/api/provincesApi';
import AddressSelector from '@/components/AddressSelector';
import { setNewShop } from '@/redux/createShop';
import axios from 'axios';
import CreationStepper from './StepperComponent';

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
    } = useForm<RegisterUser>({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
        },
    });

    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [provinceName, setProvinceName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [wardName, setWardName] = useState('');
    const [codeCity, setCodeCity] = useState<number | undefined>(undefined);
    const [codeDistrict, setCodeDistrict] = useState<number | undefined>(undefined);
    const [codeWard, setCodeWard] = useState<number | undefined>(undefined);

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

    const fetchCoordinates = async (ward: string, district: string, province: string) => {
        try {
            const query = `${ward}, ${district}, ${province}, Vietnam`;
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'json',
                    limit: 1,
                },
            });
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
            }
            return null;
        } catch (error) {
            console.error('Lỗi khi lấy tọa độ:', error);
            return null;
        }
    };

    const handleProvinceChange = (provinceCode: string) => {
        const province = provinces.find((p) => p.code === provinceCode);
        setProvinceName(province?.name || '');
        setCodeCity(province?.code ? parseInt(province.code) : undefined);
        setSelectedProvince(provinceCode);
        setSelectedDistrict('');
        setSelectedWard('');
        setDistrictName('');
        setWardName('');
        setCodeDistrict(undefined);
        setCodeWard(undefined);
        fetchDistricts(provinceCode);
    };

    const handleDistrictChange = (districtCode: string) => {
        const district = districts.find((d) => d.code === districtCode);
        setDistrictName(district?.name || '');
        setCodeDistrict(district?.code ? parseInt(district.code) : undefined);
        setSelectedDistrict(districtCode);
        setSelectedWard('');
        setWardName('');
        setCodeWard(undefined);
        fetchWards(districtCode);
    };

    const handleWardChange = async (wardCode: string) => {
        const ward = wards.find((w) => w.code === wardCode);
        setWardName(ward?.name || '');
        setCodeWard(ward?.code ? parseInt(ward.code) : undefined);
        setSelectedWard(wardCode);
        const coords = await fetchCoordinates(ward?.name || '', districtName, provinceName);
        dispatch(
            setNewShop({
                ...store,
                city: provinceName,
                district: districtName,
                ward: ward?.name || '',
                codeCity,
                codeDistrict,
                codeWard: ward?.code ? parseInt(ward.code) : undefined,
                latitude: coords?.latitude || 21.0285,
                longitude: coords?.longitude || 105.8542,
            })
        );
    };

    const onSubmit = async (data: RegisterUser) => {
        setLoading(true);
        try {
            const result: AxiosResponse = await authApi.registerShop({
                email: data.email,
                password: data.password,
                phone: data.phone,
                city: provinceName,
                ward: wardName,
                district: districtName,
                codeCity,
                codeDistrict,
                codeWard,
            });
            if (result?.data?.success) {
                localStorage.setItem('EMAIL_BIZ', data.email);
                dispatch(
                    setNewShop({
                        ...store,
                        email: data.email,
                        phone: data.phone,
                        city: provinceName,
                        ward: wardName,
                        district: districtName,
                        codeCity,
                        codeDistrict,
                        codeWard,
                        latitude: store?.latitude || 21.0285,
                        longitude: store?.longitude || 105.8542,
                    })
                );
                setSnackbar({ open: true, message: 'Đăng ký thành công!', severity: 'success' });
                navigate('/biz/create-tag');
            } else {
                setSnackbar({
                    open: true,
                    message: result?.data?.message || 'Đăng ký thất bại.',
                    severity: 'error',
                });
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Có lỗi xảy ra. Vui lòng thử lại.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: 'auto',
                my: 4,
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <CreationStepper />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Đăng Ký cửa hàng
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    {[
                        { name: 'email', label: 'Email *' },
                        { name: 'password', label: 'Mật khẩu *', type: 'password' },
                        { name: 'confirmPassword', label: 'Nhập lại mật khẩu *', type: 'password' },
                        { name: 'phone', label: 'Số điện thoại *' },
                    ].map(({ name, label, type = 'text' }) => (
                        <Grid item xs={12} key={name}>
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
                                    pattern:
                                        name === 'email'
                                            ? {
                                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                  message: 'Email không hợp lệ',
                                              }
                                              : undefined,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={label}
                                        type={type}
                                        fullWidth
                                        error={!!errors[name as keyof RegisterUser]}
                                        helperText={errors[name as keyof RegisterUser]?.message}
                                    />
                                )}
                            />
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <AddressSelector
                            disable={false}
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
                    sx={{ mt: 3, width: '100%' }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Tiếp theo'}
                </Button>
            </form>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default RegisterAccountShopPage;
