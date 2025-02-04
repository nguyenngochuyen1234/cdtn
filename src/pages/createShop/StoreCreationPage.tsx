import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Grid, Container, InputAdornment } from '@mui/material';
import { StoreCreation } from '@/models';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/stores';
import userApi from '@/api/shopApi';

const StoreCreationPage = () => {
    const user = useSelector((state: RootState) => state?.register.user);
    console.log(user);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<StoreCreation>();

    const onSubmit = async (data: StoreCreation) => {
        try {
            if (user) {
                const formData = {
                    name: data.name,
                    avatar: data.avatar,
                    imageBusiness: data.imageBusiness,
                    email: user?.email,
                    mediaUrls: ['ihfidikdg'],
                    description: data.description,
                    urlWebsite: data.urlWebsite,
                    openTimeRequests: [
                        {
                            dayOfWeekEnum: 'MONDAY',
                            openTime: '7:00',
                            closeTime: '8:00',
                            dayOff: true,
                        },
                    ],
                    city: data.city,
                    ward: data.ward,
                    district: data.district,
                    longitude: 0,
                    latitude: 0,
                    categoryEnum: 'RESTAURANT',
                    phone: user?.phone,
                    owner: true,
                };
                const result = await userApi.createShop(formData);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container>
            <h2>Tạo Cửa Hàng</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Store Name is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Store Name"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="avatar"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Avatar URL" fullWidth />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="imageBusiness"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Business Image URL" fullWidth />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: 'Email is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="mediaUrls"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Media URLs (comma separated)"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Description" fullWidth />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="urlWebsite"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Website URL" fullWidth />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="openTimeRequests"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Open Time Requests"
                                    fullWidth
                                    helperText="Please provide opening hours and close times for each day"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Phone" fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="categoryEnum"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Category" fullWidth />
                            )}
                        />
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary">
                    Tạo Cửa Hàng
                </Button>
            </form>
        </Container>
    );
};

export default StoreCreationPage;
