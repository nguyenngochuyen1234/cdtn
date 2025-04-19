import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Chip,
    Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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

const PackageDetailDialog = ({
    open,
    pack,
    onClose,
    onBuy,
}: {
    open: boolean;
    pack: AdvertisementPackage | null;
    onClose: () => void;
    onBuy: (pack: AdvertisementPackage) => Promise<void>;
}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    if (!pack) return null;

    return (
        <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ backgroundColor: '#d32f2f', color: '#fff' }}>
                Chi tiết gói quảng cáo
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: '#f5f5f5' }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ color: '#d32f2f' }}>
                        {pack.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip
                            label={pack.advertisementTypeEnum}
                            sx={{ mr: 1, fontWeight: 'bold' }}
                        />
                    </Box>
                    <Typography variant="h5" color="primary" gutterBottom>
                        {pack.price.toLocaleString()} VND
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Mô tả:</strong> {pack.description}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Thời hạn:</strong> {pack.durationDay} ngày
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PackageDetailDialog;
