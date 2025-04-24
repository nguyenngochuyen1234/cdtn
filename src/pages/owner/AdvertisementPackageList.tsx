'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Tabs, Tab } from '@mui/material';
import PurchasedPackagesList from './PurchasedPackageList';
import CustomPagination from '@/components/shop/CustomPagination';
import AdvertisementPackageCard from './AdvertisementPackageCard';
import PackageDetailDialog from './PackageDetailDialog';
import adsSubAPI from '@/api/adssubAPI';

interface AdvertisementPackage {
    id: string;
    name: string;
    description: string;
    price: number;
    total_access: number | null;
    thumbnail: string;
    advertisementTypeEnum: string;
    statusAdvertisement: string;
    startDate: string | null;
    endDate: string | null;
    duration: number | null;
    durationDay: number;
    createdAt: number;
    updatedAt: number;
    discount?: string;
}

export default function AdvertisementPackageList() {
    const [selectedPackage, setSelectedPackage] = useState<AdvertisementPackage | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('packages');
    const [packages, setPackages] = useState<AdvertisementPackage[]>([]);
    const [packagesPage, setPackagesPage] = useState(1);
    const [packagesTotal, setPackagesTotal] = useState(0);
    const [packagesLoading, setPackagesLoading] = useState(false);
    const [purchasedPage, setPurchasedPage] = useState(0);
    const [purchasedTotal, setPurchasedTotal] = useState(0);
    const [purchasedLoading, setPurchasedLoading] = useState(false);

    const limit = 12;

    // Fetch advertisement packages
    const fetchPackages = async (page: number) => {
        try {
            setPackagesLoading(true);
            const response = await adsSubAPI.getAllAdsVertisement({
                limit,
                page: page - 1, // Adjust for 0-based API
                status: 'OPEN',
            });
            setPackages(response.data.data || []);
            setPackagesTotal(response.data.meta?.total || 0);
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setPackagesLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'packages') {
            fetchPackages(packagesPage);
        }
    }, [packagesPage, activeTab]);

    const handleViewDetails = (pack: AdvertisementPackage) => {
        setSelectedPackage(pack);
        setDetailDialogOpen(true);
    };

    const handleBuy = async (pack: AdvertisementPackage) => {
        try {
            const response = await adsSubAPI.createAds({
                idAdvertisement: pack.id,
                amount: pack.price,
            });
            if (response.data) {
                window.location.replace(response.data);
            }
        } catch (error) {
            console.error('Error buying package:', error);
        }
    };

    const totalPackagesPages = Math.ceil(packagesTotal / limit);

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 1, md: 2 } }}>
            <Typography
                variant="h4"
                component="h1"
                sx={{ mb: 1, fontWeight: 'bold', fontSize: { xs: '1.875rem', md: '2.25rem' } }}
            >
                Gói Quảng Cáo
            </Typography>

            <Box sx={{ mb: 8 }}>
                <Tabs
                    value={activeTab}
                    onChange={(event, newValue) => setActiveTab(newValue)}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Tab
                        label="Danh sách gói quảng cáo"
                        value="packages"
                        sx={{
                            textTransform: 'none',
                            fontWeight: activeTab === 'packages' ? 'bold' : 'normal',
                            color: activeTab === 'packages' ? '#d32f2f' : 'inherit',
                            borderBottom: activeTab === 'packages' ? '2px solid #d32f2f' : 'none',
                            '&:hover': {
                                color: '#d32f2f',
                            },
                        }}
                    />
                    <Tab
                        label="Gói đã mua"
                        value="purchased"
                        sx={{
                            textTransform: 'none',
                            fontWeight: activeTab === 'purchased' ? 'bold' : 'normal',
                            color: activeTab === 'purchased' ? '#d32f2f' : 'inherit',
                            borderBottom: activeTab === 'purchased' ? '2px solid #d32f2f' : 'none',
                            '&:hover': {
                                color: '#d32f2f',
                            },
                        }}
                    />
                </Tabs>

                {activeTab === 'packages' && (
                    <Box sx={{ mt: 6 }}>
                        {packagesLoading ? (
                            <Typography sx={{ textAlign: 'center', py: 8 }}>Đang tải...</Typography>
                        ) : (
                            <>
                                <Grid
                                    container
                                    spacing={{ xs: 2, sm: 3 }}
                                    columns={{ xs: 1, sm: 2, md: 3 }}
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'stretch', // Đảm bảo các card có chiều cao bằng nhau
                                    }}
                                >
                                    {packages.map((pack) => (
                                        <Grid item key={pack.id} xs={1}>
                                            <AdvertisementPackageCard
                                                pack={pack}
                                                onViewDetails={handleViewDetails}
                                                onBuy={handleBuy}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                                    <CustomPagination
                                        page={packagesPage}
                                        totalPages={totalPackagesPages}
                                        onPageChange={(page) => setPackagesPage(page)}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                )}

                {activeTab === 'purchased' && (
                    <Box sx={{ mt: 6 }}>
                        <PurchasedPackagesList
                            purchasedPage={purchasedPage}
                            setPurchasedPage={setPurchasedPage}
                            purchasedTotal={purchasedTotal}
                            setPurchasedTotal={setPurchasedTotal}
                            purchasedLoading={purchasedLoading}
                            setPurchasedLoading={setPurchasedLoading}
                        />
                    </Box>
                )}
            </Box>

            {selectedPackage && (
                <PackageDetailDialog
                    open={detailDialogOpen}
                    pack={selectedPackage}
                    onClose={() => setDetailDialogOpen(false)}
                    onBuy={handleBuy}
                />
            )}
        </Container>
    );
}
