'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, Typography, Box, Grid, Stack } from '@mui/material';
import shopApi from '@/api/shopApi';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define the marker icon
const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
});

interface BusinessHoursSectionProps {
    shop: any;
    shopId: string;
}

interface OpenTime {
    dayOfWeekEnum: string;
    openTime: string;
    closeTime: string;
    dayOff: boolean;
}

export default function BusinessHoursSection({ shop, shopId }: BusinessHoursSectionProps) {
    const [openTimes, setOpenTimes] = useState<OpenTime[]>([]);
    const daysOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    // Get current day and time
    const today = new Date().toLocaleString('en-US', { weekday: 'long' });
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Convert time string (e.g., "09:00") to 24-hour format for comparison
    const convertTimeTo24Hour = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return { hours, minutes };
    };

    const isCurrentlyOpen = () => {
        const currentDay = today.toUpperCase();
        const todayOpenTime = openTimes.find((time) => time.dayOfWeekEnum === currentDay);

        if (!todayOpenTime || todayOpenTime.dayOff) {
            return false;
        }

        const open = convertTimeTo24Hour(todayOpenTime.openTime);
        const close = convertTimeTo24Hour(todayOpenTime.closeTime);

        const openMinutes = open.hours * 60 + open.minutes;
        const closeMinutes = close.hours * 60 + close.minutes;
        const currentMinutes = currentHour * 60 + currentMinute;

        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    };

    useEffect(() => {
        const fetchOpenTimes = async () => {
            try {
                const response = await shopApi.getOpenTimeByIdShop(shopId);
                setOpenTimes(
                    response?.data?.data ||
                        daysOfWeek.map((day) => ({
                            dayOfWeekEnum: day.toUpperCase(),
                            openTime: '09:00',
                            closeTime: '19:30',
                            dayOff: false,
                        }))
                );
            } catch (error) {
                console.error('Error fetching open times:', error);
                setOpenTimes(
                    daysOfWeek.map((day) => ({
                        dayOfWeekEnum: day.toUpperCase(),
                        openTime: '09:00',
                        closeTime: '19:30',
                        dayOff: false,
                    }))
                );
            }
        };

        fetchOpenTimes();
    }, [shopId]);

    const hasValidCoordinates =
        shop?.latitude && shop?.longitude && shop.latitude !== 0 && shop.longitude !== 0;

    const mapPosition: [number, number] = [shop?.latitude || 37.7749, shop?.longitude || -122.4194];

    const addressParts = [shop?.address, shop?.ward, shop?.district, shop?.city].filter(Boolean);
    const detailedAddress = addressParts.length > 0 ? addressParts.join(', ') : null;

    return (
        <Card sx={{ mt: 4 }}>
            <CardHeader
                title={
                    <Typography variant="h6" fontWeight="bold">
                        Địa chỉ và thời gian hoạt động
                    </Typography>
                }
                sx={{ pb: 1 }}
            />

            <CardContent>
                <Grid container spacing={3}>
                    {/* Left side - Map and Address (only shown if coordinates are valid) */}
                    {hasValidCoordinates && (
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: 200,
                                    width: '100%',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    mb: 2,
                                }}
                            >
                                <MapContainer
                                    center={mapPosition}
                                    zoom={13}
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={mapPosition} icon={markerIcon} />
                                </MapContainer>
                            </Box>

                            {/* {detailedAddress && (
                                <Stack spacing={1}>
                                    <Typography variant="body2" color="text.secondary">
                                        Địa chỉ:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {detailedAddress}
                                    </Typography>
                                </Stack>
                            )} */}
                        </Grid>
                    )}

                    {/* Right side - Business Hours */}
                    <Grid item xs={12} md={hasValidCoordinates ? 6 : 12}>
                        <Stack spacing={1}>
                            {daysOfWeek.map((day, index) => {
                                const openTime = openTimes.find(
                                    (time) => time.dayOfWeekEnum === day.toUpperCase()
                                );
                                const isToday = day === today;

                                // Simplify the time display (remove "AM/PM" and "Next day")
                                const displayOpenTime =
                                    openTime?.openTime?.replace(/ (AM|PM)/, '') || '09:00';
                                const displayCloseTime =
                                    openTime?.closeTime?.replace(
                                        / (AM|PM|Next day|\(Next day\))/g,
                                        ''
                                    ) || '19:30';

                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            py: 0.5,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: isToday ? 'medium' : 'normal',
                                                color: isToday ? 'text.primary' : 'text.secondary',
                                            }}
                                        >
                                            {day.substring(0, 3)}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontWeight: isToday ? 'medium' : 'normal' }}
                                            >
                                                {openTime && !openTime.dayOff
                                                    ? `${displayOpenTime} - ${displayCloseTime}`
                                                    : 'Đóng cửa'}
                                            </Typography>
                                            {isToday && (
                                                <Typography
                                                    variant="body2"
                                                    color={
                                                        isCurrentlyOpen()
                                                            ? 'success.main'
                                                            : 'error.main'
                                                    }
                                                >
                                                    {isCurrentlyOpen() ? 'Đang mở' : ''}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
