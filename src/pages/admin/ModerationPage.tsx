import cmsApi from '@/api/cmsApi';
import { PROVINCE_API } from '@/common';
import { StoreCreation } from '@/models';
import {
    Button,
    CircularProgress,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tabs,
    Tab,
    Pagination,
} from '@mui/material';
import { Image } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ModerationPage: React.FC = () => {
    const [shops, setShops] = useState<StoreCreation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const [locationCache, setLocationCache] = useState<{ [key: string]: string }>({});
    const [shopsWithLocation, setShopsWithLocation] = useState<StoreCreation[]>([]);

    const [tabIndex, setTabIndex] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLocationName = async (type: 'p' | 'd' | 'w', code: string) => {
        if (!code) return '';
        if (locationCache[code]) return locationCache[code];

        try {
            const response = await axios.get(`${PROVINCE_API}${type}/${code}`);
            const name = response.data.name;
            setLocationCache((prev) => ({ ...prev, [code]: name }));
            return name;
        } catch (error) {
            console.error(`Lỗi khi lấy thông tin ${type}:`, error);
            return code;
        }
    };

    const fetchShops = async () => {
        setLoading(true);
        try {
            const isDeActive = tabIndex === 0;
            const response = await cmsApi.getAllListShopDeactive({
                page,
                size: 5,
                statusShopEnums: isDeActive ? 'ACTIVE' : 'DEACTIVE',
            });

            const fetchedShops: StoreCreation[] = response.data.data;
            setTotalPages(response.data.totalPage || 1);

            const updatedShops = await Promise.all(
                fetchedShops.map(async (shop) => ({
                    ...shop,
                    cityName: await fetchLocationName('p', shop.city ?? ''),
                    districtName: await fetchLocationName('d', shop.district ?? ''),
                    wardName: await fetchLocationName('w', shop.ward ?? ''),
                }))
            );
            setShops(updatedShops);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách cửa hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, [tabIndex, page]);

    const handleShopAction = async (id: string, action: 'activate' | 'block') => {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        try {
            const res =
                action === 'activate'
                    ? await cmsApi.activeShop(id)
                    : await cmsApi.blockShopById(id);
            setSnackbarMessage(res.data.message);
            setSnackbarSeverity(res.data.success ? 'success' : 'error');
            if (res.data.success) fetchShops();
        } catch (error) {
            console.error(`Lỗi khi ${action}:`, error);
            setSnackbarMessage(`Lỗi khi ${action === 'activate' ? 'kích hoạt' : 'khóa'} cửa hàng.`);
            setSnackbarSeverity('error');
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Quản lý cửa hàng
            </Typography>

            <Tabs
                value={tabIndex}
                onChange={(_, newValue) => {
                    setTabIndex(newValue);
                    setPage(1);
                }}
            >
                <Tab label="Chưa kiểm duyệt" />
                <Tab label="Đã kiểm duyệt" />
            </Tabs>

            {loading ? (
                <CircularProgress />
            ) : shops.length === 0 ? (
                <Typography variant="h6" style={{ marginTop: 20 }}>
                    Không có cửa hàng nào trong mục này.
                </Typography>
            ) : (
                <>
                    <TableContainer component={Paper} style={{ marginTop: 20 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ảnh đại diện</TableCell>
                                    <TableCell>Tên cửa hàng</TableCell>
                                    <TableCell>Mô tả</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shops.map((shop) => (
                                    <TableRow key={shop.id}>
                                        <TableCell>
                                            <Image
                                                preview={false}
                                                width={100}
                                                height={100}
                                                style={{ objectFit: 'cover' }}
                                                src={shop.avatar as string}
                                            />
                                        </TableCell>
                                        <TableCell>{shop.name}</TableCell>
                                        <TableCell>{shop.description}</TableCell>
                                        <TableCell>{shop.statusShopEnums}</TableCell>
                                        <TableCell>
                                            {shop.statusShopEnums === 'ACTIVE' ? (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    disabled={actionLoading[shop.id || '']}
                                                    onClick={() =>
                                                        handleShopAction(shop.id || '', 'block')
                                                    }
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
                                                    onClick={() =>
                                                        handleShopAction(shop.id || '', 'activate')
                                                    }
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

                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, newPage) => setPage(newPage)}
                        color="primary"
                        style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}
                    />
                </>
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
