import React, { useEffect, useState } from 'react';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import axios from 'axios';
import cmsApi from '@/api/cmsApi';
import { StoreCreation } from '@/models';
import { Image } from 'antd';
import { PROVINCE_API } from '@/common';

const ModerationPage: React.FC = () => {
    const [shops, setShops] = useState<StoreCreation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [selectedShop, setSelectedShop] = useState<StoreCreation | null>(null);
    const [provinces, setProvinces] = useState<{ [key: string]: string }>({});
    const [districts, setDistricts] = useState<{ [key: string]: string }>({});
    const [wards, setWards] = useState<{ [key: string]: string }>({});

    const fetchInactiveShops = async () => {
        setLoading(true);
        try {
            const response = await cmsApi.getAllListShopDeactive({
                page: 1,
                size: 5,
                deActive: true,
            });
            setShops(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách cửa hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInactiveShops();
    }, []);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const provincesRes = await axios.get(`${PROVINCE_API}p/`);
                const districtsRes = await axios.get(`${PROVINCE_API}d/`);
                const wardsRes = await axios.get(`${PROVINCE_API}w/`);

                setProvinces(
                    provincesRes.data.reduce(
                        (acc: any, item: any) => ({ ...acc, [item.code]: item.name }),
                        {}
                    )
                );
                setDistricts(
                    districtsRes.data.reduce(
                        (acc: any, item: any) => ({ ...acc, [item.code]: item.name }),
                        {}
                    )
                );
                setWards(
                    wardsRes.data.reduce(
                        (acc: any, item: any) => ({ ...acc, [item.code]: item.name }),
                        {}
                    )
                );
            } catch (error) {
                console.error('Lỗi khi lấy danh sách địa phương:', error);
            }
        };
        fetchLocations();
    }, []);

    const handleShopAction = async (id: string, action: 'activate' | 'block') => {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        try {
            const res =
                action === 'activate'
                    ? await cmsApi.activeShop(id)
                    : await cmsApi.blockShopById(id);
            setSnackbarMessage(res.data.message);
            setSnackbarSeverity(res.data.success ? 'success' : 'error');
            if (res.data.success) fetchInactiveShops();
        } catch (error) {
            console.error(
                `Lỗi khi ${action === 'activate' ? 'kích hoạt' : 'khóa'} cửa hàng:`,
                error
            );
            setSnackbarMessage(`Lỗi khi ${action === 'activate' ? 'kích hoạt' : 'khóa'} cửa hàng.`);
            setSnackbarSeverity('error');
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Danh sách cửa hàng chưa kích hoạt
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : shops.length === 0 ? (
                <Typography variant="h6">Không có cửa hàng nào cần kích hoạt.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ảnh đại diện</TableCell>
                                <TableCell>Tên cửa hàng</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Thành phố</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shops.map((shop) => (
                                <TableRow
                                    key={shop.id}
                                    onClick={() => setSelectedShop(shop)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <TableCell>
                                        <Image
                                            preview={{ mask: false }}
                                            width={100}
                                            src={shop.avatar as string}
                                        />
                                    </TableCell>
                                    <TableCell>{shop.name}</TableCell>
                                    <TableCell>{shop.description}</TableCell>
                                    <TableCell>{provinces[shop.city || 0] || shop.city}</TableCell>
                                    <TableCell>{shop.statusShopEnums}</TableCell>
                                    <TableCell>
                                        {shop.statusShopEnums === 'ACTIVE' ? (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                disabled={actionLoading[shop.id || '']}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShopAction(shop.id || '', 'block');
                                                }}
                                            >
                                                {actionLoading[shop.id || ''] ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    'Khóa'
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                disabled={actionLoading[shop.id || '']}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShopAction(shop.id || '', 'activate');
                                                }}
                                            >
                                                {actionLoading[shop.id || ''] ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    'Kích hoạt'
                                                )}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={3000}
                onClose={() => setSnackbarMessage(null)}
                message={snackbarMessage}
            />
        </div>
    );
};

export default ModerationPage;
