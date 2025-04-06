'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import type { Shop } from '@/models';
import shopApi from '@/api/shopApi';
import usersCategory from '@/api/usersCategory';

interface ShopDetailProps {
    shop: Shop;
    shopId: string;
}

interface OpenTime {
    dayOfWeekEnum: string;
    openTime: string;
    closeTime: string;
    dayOff: boolean;
}

function HeaderDetailPost({ shop, shopId }: ShopDetailProps) {
    const [openTimes, setOpenTimes] = useState<OpenTime[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryNames, setCategoryNames] = useState<string[]>([]);

    useEffect(() => {
        const fetchOpenTimes = async () => {
            try {
                setLoading(true);
                const response = await shopApi.getOpenTimeByIdShop(shopId);
                setOpenTimes(response?.data?.data || []);
            } catch (error) {
                console.error('Error fetching open times:', error);
                setOpenTimes([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const categoryIds = shop?.idCategory || [];
                if (categoryIds.length > 0) {
                    const response = await usersCategory.getDetailsCategories(categoryIds);
                    const names = response?.data?.data.name
                        ? [response.data.data.name]
                        : ['Nhà Hàng'];
                    setCategoryNames(names);
                } else {
                    setCategoryNames(['Nhà Hàng']);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategoryNames(['Nhà Hàng']);
            }
        };
        console.log('Fetching open times in HeaderDetailPost', shopId);
        fetchOpenTimes();
        fetchCategories();
    }, [shopId, shop?.idCategory?.toString()]); // Convert idCategory to string to stabilize reference
    // Tính toán rating dựa trên point và countReview từ API
    const rating = shop?.point / shop?.countReview || 4.3;
    const reviews = shop?.countReview || 260;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
    const openTime = openTimes.find((time) => time.dayOfWeekEnum === today);
    const hours =
        openTime && !openTime.dayOff ? `${openTime.openTime} - ${openTime.closeTime}` : 'Closed';

    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 4,
                zIndex: 2,
                background:
                    'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography
                variant="h3"
                fontWeight="800"
                color="white"
                sx={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    mb: 1,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
            >
                {shop?.name || 'Four Kings'}
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                <Box display="flex" alignItems="center">
                    {[...Array(5)].map((_, index) => (
                        <StarIcon
                            key={index}
                            sx={{
                                color:
                                    index < fullStars
                                        ? '#f44336'
                                        : index === fullStars && hasHalfStar
                                          ? '#f44336'
                                          : '#e0e0e0',
                                fontSize: 24,
                            }}
                        />
                    ))}
                    <Typography variant="h6" fontWeight="bold" ml={1} color="white">
                        {rating.toFixed(1)} ({reviews} reviews)
                    </Typography>
                </Box>
            </Stack>
            <Typography
                variant="h6"
                color={hours === 'Closed' ? 'error.main' : 'error.main'}
                fontWeight="bold"
                sx={{
                    display: 'inline-block',
                    px: 1,
                    borderRadius: 1,
                }}
            >
                {hours === 'Closed' ? 'Closed' : `Open • ${hours}`}
            </Typography>
        </Box>
    );
}

export default HeaderDetailPost;
