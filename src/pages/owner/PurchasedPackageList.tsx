'use client';

import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import adsSubAPI from '@/api/adssubAPI';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomPagination from '@/components/shop/CustomPagination';

interface PurchasedPackage {
    id: string;
    idShop: string;
    idAdvertisement: string;
    idHistoryPayment: string | null;
    issuedAt: number[];
    expiredAt: number[];
    status: string;
    statusPayment: string;
    vnpTxnRef: string;
    name: string;
    description: string;
    totalAccess: number | null;
    statusAds: string;
    createdAt: number | null;
    remainingDay: number | null;
    totalView: number | 0;
    thumbnail?: string;
}

interface Pagination {
    limit: number;
    page: number;
    sort?: string;
    keyword?: string;
}

interface PurchasedPackageDetailDialogProps {
    open: boolean;
    pack: PurchasedPackage | null;
    onClose: () => void;
}

const PurchasedPackageDetailDialog: React.FC<PurchasedPackageDetailDialogProps> = ({
    open,
    pack,
    onClose,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Convert array date format [year, month, day, hour, minute, second, nanosecond] to Date
    const convertToDate = (dateArray: number[] | undefined): string => {
        if (!dateArray) return 'N/A';
        const [year, month, day, hour, minute, second, nanosecond] = dateArray;
        return new Date(
            year,
            month - 1,
            day,
            hour,
            minute,
            second,
            nanosecond / 1000000
        ).toLocaleString();
    };

    if (!pack) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
                Chi tiết gói quảng cáo: {pack.name}
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body1">
                        <strong>Ngày bắt đầu:</strong> {convertToDate(pack.issuedAt)}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Ngày kết thúc:</strong> {convertToDate(pack.expiredAt)}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Trạng thái:</strong> {pack.statusAds}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Trạng thái thanh toán:</strong> {pack.statusPayment}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Mã giao dịch thanh toán:</strong> {pack.vnpTxnRef}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Tên gói:</strong> {pack.name}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Mô tả:</strong> {pack.description}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Tổng lượt truy cập:</strong>{' '}
                        {pack.totalAccess ? pack.totalAccess.toLocaleString() : 'Không giới hạn'}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Trạng thái quảng cáo:</strong> {pack.statusAds}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Tổng lượt xem:</strong> {pack.totalView ?? 10}
                    </Typography>
                    {pack.thumbnail && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Hình ảnh:</strong>
                            </Typography>
                            <img
                                src={pack.thumbnail}
                                alt={pack.name}
                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" sx={{ textTransform: 'none' }}>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const PurchasedPackagesList = ({
    purchasedPage,
    setPurchasedPage,
    purchasedTotal,
    setPurchasedTotal,
    purchasedLoading,
    setPurchasedLoading,
}: {
    purchasedPage: number;
    setPurchasedPage: React.Dispatch<React.SetStateAction<number>>;
    purchasedTotal: number;
    setPurchasedTotal: React.Dispatch<React.SetStateAction<number>>;
    purchasedLoading: boolean;
    setPurchasedLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [purchasedPackages, setPurchasedPackages] = useState<PurchasedPackage[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<PurchasedPackage | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const limit = 12;

    // Convert array date format [year, month, day, hour, minute, second, nanosecond] to Date
    const convertToDate = (dateArray: number[]): Date => {
        const [year, month, day, hour, minute, second, nanosecond] = dateArray;
        return new Date(year, month - 1, day, hour, minute, second, nanosecond / 1000000);
    };

    // Fetch purchased packages using getAddSub
    const fetchPurchasedPackages = async (page: number) => {
        try {
            setPurchasedLoading(true);
            const body: Pagination = {
                limit,
                page: page, // Adjust for 0-based API
            };
            const response = await adsSubAPI.getAddSub(body);
            setPurchasedPackages(response.data.data || []);
            setPurchasedTotal(response.data.meta?.total || 0);
        } catch (error) {
            console.error('Error fetching purchased packages:', error);
        } finally {
            setPurchasedLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchasedPackages(purchasedPage);
    }, [purchasedPage]);

    const handleViewDetails = (pack: PurchasedPackage) => {
        setSelectedPackage(pack);
        setDetailDialogOpen(true);
    };

    const totalPurchasedPages = Math.ceil(purchasedTotal / limit);

    return (
        <>
            {purchasedLoading ? (
                <Typography>Loading...</Typography>
            ) : (
                <>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                        {purchasedPackages.map((pack) => (
                            <Grid item key={pack.id} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        image={
                                            pack.thumbnail ||
                                            '/placeholder.svg?height=100&width=250'
                                        }
                                        alt={pack.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            gutterBottom
                                            variant={isMobile ? 'h6' : 'h5'}
                                            component="div"
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            {pack.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 1 }}
                                        >
                                            <strong>Tổng lượt truy cập:</strong>{' '}
                                            {pack.totalView
                                                ? pack.totalView.toLocaleString()
                                                : 'Không giới hạn'}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 1 }}
                                        >
                                            <strong>Bắt đầu:</strong>{' '}
                                            {pack.issuedAt
                                                ? convertToDate(pack.issuedAt).toLocaleString()
                                                : 'N/A'}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 1 }}
                                        >
                                            <strong>Kết thúc:</strong>{' '}
                                            {pack.expiredAt
                                                ? convertToDate(pack.expiredAt).toLocaleString()
                                                : 'N/A'}
                                        </Typography>
                                        <Chip
                                            label={pack.statusAds}
                                            size="small"
                                            sx={{ fontWeight: 'bold', mb: 2 }}
                                        />
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={() => handleViewDetails(pack)}
                                            sx={{ textTransform: 'none', mt: 1 }}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <CustomPagination
                            page={purchasedPage}
                            totalPages={totalPurchasedPages}
                            onPageChange={(page) => setPurchasedPage(page)}
                        />
                    </Box>
                </>
            )}
            <PurchasedPackageDetailDialog
                open={detailDialogOpen}
                pack={selectedPackage}
                onClose={() => setDetailDialogOpen(false)}
            />
        </>
    );
};

export default PurchasedPackagesList;
