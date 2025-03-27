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
} from '@mui/material';
import { Image } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
    const [locationCache, setLocationCache] = useState<{ [key: string]: string }>({});

    const fetchLocationName = async (type: 'p' | 'd' | 'w', code: string) => {
        if (!code) return '';
        if (locationCache[code]) return locationCache[code]; // Lấy từ cache nếu có

        try {
            const response = await axios.get(`${PROVINCE_API}${type}/${code}`);
            const name = response.data.name;
            setLocationCache((prev) => ({ ...prev, [code]: name })); // Lưu vào cache
            return name;
        } catch (error) {
            console.error(`Lỗi khi lấy thông tin ${type}:`, error);
            return code; // Nếu lỗi, trả về mã số thay vì tên
        }
    };

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
    const [shopsWithLocation, setShopsWithLocation] = useState<StoreCreation[]>([]);

    useEffect(() => {
        const fetchLocationsForShops = async () => {
            const updatedShops = await Promise.all(
                shops.map(async (shop) => ({
                    ...shop,
                    cityName: await fetchLocationName('p', shop.city ?? ''),
                    districtName: await fetchLocationName('d', shop.district ?? ''),
                    wardName: await fetchLocationName('w', shop.ward ?? ''),
                }))
            );
            setShopsWithLocation(updatedShops);
        };

        if (shops.length > 0) fetchLocationsForShops();
    }, [shops]);

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
                            {shopsWithLocation.map((shop) => (
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
                                    <TableCell>{shop.cityName || shop.city}</TableCell>

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
