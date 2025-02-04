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
} from '@mui/material';
import axios from 'axios';
import cmsApi from '@/api/cmsApi';

interface Shop {
    id: string;
    idShop: string;
    name: string;
    description: string;
    city: string;
    ward: string;
    district: string;
    countReview: number;
    price: number;
}

const ModerationPage: React.FC = () => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

    // Lấy danh sách cửa hàng chưa kích hoạt
    useEffect(() => {
        const fetchInactiveShops = async () => {
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

        fetchInactiveShops();
    }, []);

    // Xử lý kích hoạt cửa hàng
    const handleActivateShop = async (idShop: string) => {
        try {
            await axios.post(`/api/shops/activate/${idShop}`); // API kích hoạt
            setShops((prevShops) => prevShops.filter((shop) => shop.idShop !== idShop));
            setSnackbarMessage('Kích hoạt cửa hàng thành công!');
        } catch (error) {
            console.error('Lỗi khi kích hoạt cửa hàng:', error);
            setSnackbarMessage('Lỗi khi kích hoạt cửa hàng.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Danh sách cửa hàng chưa kích hoạt
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : shops?.length === 0 ? (
                <Typography variant="h6">Không có cửa hàng nào cần kích hoạt.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên cửa hàng</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Thành phố</TableCell>
                                <TableCell>Quận</TableCell>
                                <TableCell>Phường</TableCell>
                                <TableCell>Đánh giá</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shops?.map((shop) => (
                                <TableRow key={shop.id}>
                                    <TableCell>{shop.name}</TableCell>
                                    <TableCell>{shop.description}</TableCell>
                                    <TableCell>{shop.city}</TableCell>
                                    <TableCell>{shop.district}</TableCell>
                                    <TableCell>{shop.ward}</TableCell>
                                    <TableCell>{shop.countReview}</TableCell>
                                    {/* <TableCell>{shop.price.toLocaleString()} VND</TableCell> */}
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleActivateShop(shop.idShop)}
                                        >
                                            Kích hoạt
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Hiển thị thông báo Snackbar */}
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
