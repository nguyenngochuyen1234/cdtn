'use client';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    Skeleton,
    Paper,
    Chip,
    useTheme,
} from '@mui/material';
import { TrendingUp, EmojiEvents } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import adsApi from '@/api/adsApi';

// Define types for our data
interface AdItem {
    idAdvertisement: string;
    count: number;
}

interface AdDetails {
    id: string;
    name: string;
}

export default function TopSellingAds({
    data = [],
    loading = false,
    detailsLoading = false,
    adDetails = new Map<string, string>(),
}) {
    const theme = useTheme();
    const navigate = useNavigate();
    const [totalCount, setTotalCount] = useState(0);
    const [localDetailsLoading, setLocalDetailsLoading] = useState(detailsLoading);
    const [localAdDetails, setLocalAdDetails] = useState(adDetails);

    // Function to handle click on an ad item
    const handleAdClick = (adId: string) => {
        navigate(`/admin/advertisement?id=${adId}`);
    };

    // Fetch advertisement names for each idAdvertisement
    useEffect(() => {
        const fetchAdDetails = async () => {
            setLocalDetailsLoading(true);
            try {
                const detailsMap = new Map<string, string>();
                // Fetch details for each unique idAdvertisement
                const uniqueIds = Array.from(new Set(data.map((item) => item.idAdvertisement)));
                const promises = uniqueIds.map((id) => adsApi.getAdsById(id));
                const results = await Promise.all(promises);

                results.forEach((result) => {
                    const ad = result.data.data as AdDetails;
                    detailsMap.set(ad.id, ad.name);
                });

                setLocalAdDetails(detailsMap);
            } catch (error) {
                console.error('Error fetching advertisement details:', error);
            } finally {
                setLocalDetailsLoading(false);
            }
        };

        if (data.length > 0 && !loading) {
            fetchAdDetails();
        }
    }, [data, loading]);

    // Tính tổng count của top 3 gói quảng cáo
    useEffect(() => {
        if (!loading && data.length > 0) {
            const total = data.reduce((sum, item) => sum + item.count, 0);
            setTotalCount(total);
        } else {
            setTotalCount(0);
        }
    }, [data, loading]);

    // Function to get medal color based on ranking
    const getMedalColor = (index: number) => {
        switch (index) {
            case 0:
                return theme.palette.warning.main; // Gold
            case 1:
                return theme.palette.grey[400]; // Silver
            case 2:
                return theme.palette.warning.dark; // Bronze
            default:
                return theme.palette.primary.main;
        }
    };

    // Function to get medal icon based on ranking
    const getMedalIcon = (index: number) => {
        return index === 0 ? (
            <EmojiEvents sx={{ color: getMedalColor(index), mr: 1 }} />
        ) : (
            <TrendingUp sx={{ color: getMedalColor(index), mr: 1 }} />
        );
    };

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                mb: 4,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                },
            }}
        >
            <Box
                sx={{
                    p: 3,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}22, ${theme.palette.primary.light}11)`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingUp sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Top 3 Gói Quảng Cáo Bán Chạy
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Tổng số lượng bán: <strong>{totalCount.toLocaleString()}</strong>
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ width: '100%' }}>
                    {loading || localDetailsLoading ? (
                        <>
                            <Skeleton
                                variant="rectangular"
                                height={60}
                                animation="wave"
                                sx={{ mb: 1, borderRadius: 1 }}
                            />
                            <Skeleton
                                variant="rectangular"
                                height={60}
                                animation="wave"
                                sx={{ mb: 1, borderRadius: 1 }}
                            />
                            <Skeleton
                                variant="rectangular"
                                height={60}
                                animation="wave"
                                sx={{ borderRadius: 1 }}
                            />
                        </>
                    ) : data.length === 0 ? (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            textAlign="center"
                            sx={{ py: 4 }}
                        >
                            Không có dữ liệu để hiển thị
                        </Typography>
                    ) : (
                        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                            {data.map((item, index) => (
                                <ListItem
                                    key={item.idAdvertisement}
                                    sx={{
                                        borderRadius: 2,
                                        mb: index < data.length - 1 ? 1 : 0,
                                        py: 1.5,
                                        px: 2,
                                        bgcolor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: theme.palette.action.hover,
                                            transform: 'translateX(4px)',
                                        },
                                    }}
                                    onClick={() => handleAdClick(item.idAdvertisement)}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        {getMedalIcon(index)}
                                        <ListItemText
                                            primary={
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {localAdDetails.get(item.idAdvertisement) ||
                                                            item.idAdvertisement}
                                                    </Typography>
                                                    <Chip
                                                        label={`#${index + 1}`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: getMedalColor(index),
                                                            color: index === 0 ? 'black' : 'white',
                                                            fontWeight: 'bold',
                                                        }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    Số lượng bán:{' '}
                                                    <strong>{item.count.toLocaleString()}</strong>
                                                </Typography>
                                            }
                                        />
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Box>
        </Paper>
    );
}
