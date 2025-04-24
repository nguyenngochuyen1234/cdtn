'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import adsSubAPI from '@/api/adssubAPI';
import shopApi from '@/api/shopApi';
import CustomPagination from '@/components/shop/CustomPagination';

interface Transaction {
    id: string;
    transactionId: string;
    idShop: string;
    idAds: string;
    totalAmount: number;
    status: string;
    statusPayment: 'PENDING' | 'SUCCESS' | 'FAILURE';
    contentPayment: string;
    vnp_TransactionNo: string;
    shopName?: string;
    adsName?: string;
}

interface Pagination {
    limit: number;
    page: number;
    sort?: string;
    keyword?: string;
}

const TransactionDetailDialog: React.FC<{
    open: boolean;
    transaction: Transaction | null;
    onClose: () => void;
}> = ({ open, transaction, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!transaction) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
                Chi tiết giao dịch
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body1">
                        <strong>ID Giao dịch:</strong> {transaction.id}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Mã giao dịch:</strong> {transaction.transactionId}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Tên cửa hàng:</strong> {transaction.shopName || transaction.idShop}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Tên gói quảng cáo:</strong>{' '}
                        {transaction.adsName || transaction.idAds}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Số tiền:</strong> {transaction.totalAmount} VND
                    </Typography>
                    <Typography variant="body1">
                        <strong>Trạng thái thanh toán:</strong> {transaction.statusPayment}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Nội dung thanh toán:</strong> {transaction.contentPayment}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Mã giao dịch VNPay:</strong> {transaction.vnp_TransactionNo}
                    </Typography>
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

const PaymentStatus: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const limit = 6;

    // Fetch transaction history
    const fetchTransactionHistory = async (page: number) => {
        try {
            setLoading(true);
            const pagination: Pagination = {
                limit,
                page: page - 1, // Adjust for 0-based API
            };
            const response = await adsSubAPI.getListHistory(pagination);
            const data = response.data.data || [];
            // Fetch shop and ads names
            const enrichedData = await Promise.all(
                data.map(async (txn: Transaction) => {
                    const [shopRes, adsRes] = await Promise.all([
                        shopApi.getShopById(txn.idShop),
                        adsSubAPI.getAdsOwner(txn.idAds),
                    ]);
                    return {
                        ...txn,
                        shopName: shopRes.data.data.name || txn.idShop,
                        adsName: adsRes.data.data.name || txn.idAds,
                    };
                })
            );
            setTransactions(enrichedData);
            setTotalTransactions(response.data.meta?.total || 0);
        } catch (error) {
            console.error('Error fetching transaction history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactionHistory(page);
    }, [page]);

    const handleViewDetails = (txn: Transaction) => {
        setSelectedTransaction(txn);
        setDialogOpen(true);
    };

    return (
        <Box
            sx={{
                minHeight: '50vh',
                p: { xs: 2, sm: 4 },
                maxWidth: '1200px',
                mx: 'auto',
            }}
        >
            <Typography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}
            >
                Lịch sử giao dịch
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : transactions.length === 0 ? (
                <Typography sx={{ textAlign: 'center', py: 4 }}>
                    Không có giao dịch nào để hiển thị.
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Tên gói quảng cáo</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Tên cửa hàng</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Trạng thái thanh toán
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">
                                    Hành động
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((txn) => (
                                <TableRow key={txn.id}>
                                    <TableCell>{txn.adsName || txn.idAds}</TableCell>
                                    <TableCell>{txn.shopName || txn.idShop}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={txn.statusPayment}
                                            size="small"
                                            sx={{
                                                fontWeight: 'bold',
                                                backgroundColor:
                                                    txn.statusPayment === 'SUCCESS'
                                                        ? 'success.light'
                                                        : txn.statusPayment === 'PENDING'
                                                          ? 'warning.light'
                                                          : 'error.light',
                                                color:
                                                    txn.statusPayment === 'SUCCESS'
                                                        ? 'success.dark'
                                                        : txn.statusPayment === 'PENDING'
                                                          ? 'warning.dark'
                                                          : 'error.dark',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewDetails(txn)}
                                            sx={{
                                                textTransform: 'none',
                                                borderColor: '#d32f2f',
                                                color: '#d32f2f',
                                            }}
                                        >
                                            Chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CustomPagination
                    page={page}
                    totalPages={Math.ceil(totalTransactions / limit)}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </Box>

            <TransactionDetailDialog
                open={dialogOpen}
                transaction={selectedTransaction}
                onClose={() => setDialogOpen(false)}
            />
        </Box>
    );
};

export default PaymentStatus;
