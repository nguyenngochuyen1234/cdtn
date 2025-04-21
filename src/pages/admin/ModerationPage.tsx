'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Skeleton,
    Snackbar,
    Stack,
    Tab,
    Tabs,
    Typography,
    Alert,
    useTheme,
    alpha,
    Modal,
    Divider,
    IconButton,
} from '@mui/material';
import {
    CheckCircleOutline,
    BlockOutlined,
    Visibility,
    VisibilityOff,
    Store,
    Refresh,
    Close,
} from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';
import { PROVINCE_API } from '@/common';
import type { StoreCreation } from '@/models';
import axios from 'axios';
import { Image } from 'antd';
import cmsApi from '@/api/cmsApi';
import shopApi from '@/api/shopApi';

// Custom TabPanel component
function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`shop-tabpanel-${index}`}
            aria-labelledby={`shop-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

const ModerationPage: React.FC = () => {
    const theme = useTheme();
    const [shops, setShops] = useState<StoreCreation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [locationCache, setLocationCache] = useState<{ [key: string]: string }>({});
    const [tabIndex, setTabIndex] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedShop, setSelectedShop] = useState<StoreCreation | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

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

    const fetchShopDetails = async (id: string) => {
        setDetailLoading(true);
        setDetailError(null);
        try {
            const response = await shopApi.getShopById(id);
            const shopDetails: StoreCreation = response.data.data;
            const updatedDetails = {
                ...shopDetails,
                cityName: await fetchLocationName('p', shopDetails.city ?? ''),
                districtName: await fetchLocationName('d', shopDetails.district ?? ''),
                wardName: await fetchLocationName('w', shopDetails.ward ?? ''),
            };
            setSelectedShop(updatedDetails);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết cửa hàng:', error);
            setDetailError('Không thể tải chi tiết cửa hàng.');
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, [tabIndex, page, refreshKey]);

    const handleShopAction = async (id: string, action: 'activate' | 'block') => {
        const confirmText =
            action === 'activate'
                ? 'Bạn có chắc chắn muốn **kích hoạt** cửa hàng này không?'
                : 'Bạn có chắc chắn muốn **khóa** cửa hàng này không?';

        const confirmed = window.confirm(confirmText);
        if (!confirmed) return;

        setActionLoading((prev) => ({ ...prev, [id]: true }));
        try {
            const res =
                action === 'activate'
                    ? await cmsApi.activeShop(id)
                    : await cmsApi.blockShopById(id);

            setSnackbarMessage(res.data.message);
            setSnackbarSeverity(res.data.success ? 'success' : 'error');

            if (res.data.success) {
                setRefreshKey((prev) => prev + 1);
            }
        } catch (error) {
            console.error(`Lỗi khi ${action}:`, error);
            setSnackbarMessage(`Lỗi khi ${action === 'activate' ? 'kích hoạt' : 'khóa'} cửa hàng.`);
            setSnackbarSeverity('error');
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    const getStatusChip = (status: string) => {
        if (status === 'ACTIVE') {
            return (
                <Chip
                    label="Đã kích hoạt"
                    color="success"
                    size="medium"
                    icon={<CheckCircleOutline />}
                    variant="filled"
                    sx={{ fontWeight: 'medium', fontSize: '0.875rem', px: 1 }}
                />
            );
        } else {
            return (
                <Chip
                    label="Chưa kích hoạt"
                    color="error"
                    size="medium"
                    icon={<BlockOutlined />}
                    variant="filled"
                    sx={{ fontWeight: 'medium', fontSize: '0.875rem', px: 1 }}
                />
            );
        }
    };

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleShopClick = (id: string) => {
        fetchShopDetails(id);
    };

    const handleCloseModal = () => {
        setSelectedShop(null);
        setDetailError(null);
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 4 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Quản lý cửa hàng
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Kiểm duyệt và quản lý các cửa hàng trong hệ thống
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                        sx={{ height: 40 }}
                        disabled={loading}
                    >
                        Làm mới
                    </Button>
                </Stack>

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Tabs
                        value={tabIndex}
                        onChange={(_, newValue) => {
                            setTabIndex(newValue);
                            setPage(1);
                        }}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            backgroundColor: alpha(theme.palette.primary.main, 0.04),
                            '& .MuiTab-root': {
                                py: 2,
                                fontWeight: 500,
                            },
                        }}
                        variant="fullWidth"
                    >
                        <Tab
                            label="Đã kiểm duyệt"
                            icon={<VisibilityOff fontSize="small" />}
                            iconPosition="start"
                            sx={{ textTransform: 'none' }}
                        />
                        <Tab
                            label="Chưa kiểm duyệt"
                            icon={<Visibility fontSize="small" />}
                            iconPosition="start"
                            sx={{ textTransform: 'none' }}
                        />
                    </Tabs>

                    <TabPanel value={tabIndex} index={0}>
                        {renderShopsList()}
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        {renderShopsList()}
                    </TabPanel>
                </Paper>
            </Box>

            {/* Shop Details Modal */}
            <Modal open={!!selectedShop} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 600, md: 800 },
                        maxHeight: '90vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        overflowY: 'auto',
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >
                        <Typography variant="h5" fontWeight="bold">
                            Chi tiết cửa hàng: {selectedShop?.name}
                        </Typography>
                        <IconButton onClick={handleCloseModal}>
                            <Close />
                        </IconButton>
                    </Stack>

                    {detailLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : detailError ? (
                        <Alert severity="error">{detailError}</Alert>
                    ) : (
                        selectedShop && (
                            <Stack spacing={2}>
                                {/* Basic Info */}
                                <Box>
                                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                                        Thông tin cơ bản
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Tên:</strong> {selectedShop.name || 'Chưa cung cấp'}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Email:</strong>{' '}
                                        {selectedShop.email || 'Chưa cung cấp'}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Website:</strong>{' '}
                                        {selectedShop.urlWebsite || 'Chưa cung cấp'}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Mô tả:</strong>{' '}
                                        {selectedShop.description || 'Chưa cung cấp'}
                                    </Typography>
                                </Box>

                                {/* Address */}
                                <Box>
                                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                                        Địa chỉ
                                    </Typography>
                                    <Typography variant="body1">
                                        {[
                                            selectedShop.wardName,
                                            selectedShop.districtName,
                                            selectedShop.cityName,
                                        ]
                                            .filter(Boolean)
                                            .join(', ') || 'Chưa cung cấp'}
                                    </Typography>
                                </Box>

                                {/* Images */}
                                <Box>
                                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                                        Hình ảnh
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1" fontWeight="medium">
                                            Giấy phép kinh doanh:
                                        </Typography>
                                        {selectedShop.imageBusiness ? (
                                            <Image
                                                src={selectedShop.imageBusiness as string}
                                                width={200}
                                                height={150}
                                                style={{ objectFit: 'cover', borderRadius: 8 }}
                                                fallback="/placeholder.svg?height=150&width=200"
                                            />
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Chưa cung cấp
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" fontWeight="medium">
                                            Hình ảnh cửa hàng:
                                        </Typography>
                                        {selectedShop.mediaUrls?.length ? (
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                sx={{ overflowX: 'auto', py: 1 }}
                                            >
                                                {(selectedShop.mediaUrls as string[]).map(
                                                    (url, index) => (
                                                        <Image
                                                            key={index}
                                                            src={url}
                                                            width={150}
                                                            height={100}
                                                            style={{
                                                                objectFit: 'cover',
                                                                borderRadius: 8,
                                                            }}
                                                            fallback="/placeholder.svg?height=100&width=150"
                                                        />
                                                    )
                                                )}
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Chưa cung cấp
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Stack>
                        )
                    )}
                </Box>
            </Modal>

            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={3000}
                onClose={() => setSnackbarMessage(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarMessage(null)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );

    function renderShopsList() {
        if (loading) {
            return (
                <Box sx={{ p: 3 }}>
                    {[1, 2, 3].map((item) => (
                        <Card key={item} sx={{ mb: 2, overflow: 'hidden' }}>
                            <CardContent sx={{ p: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={2}>
                                        <Skeleton
                                            variant="rectangular"
                                            width="100%"
                                            height={100}
                                            sx={{ borderRadius: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={10}>
                                        <Skeleton
                                            variant="text"
                                            width="40%"
                                            height={30}
                                            sx={{ mb: 1 }}
                                        />
                                        <Skeleton
                                            variant="text"
                                            width="70%"
                                            height={20}
                                            sx={{ mb: 1 }}
                                        />
                                        <Skeleton variant="text" width="30%" height={20} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            );
        }

        if (shops.length === 0) {
            return (
                <Box
                    sx={{
                        p: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Store
                        sx={{
                            fontSize: 60,
                            color: alpha(theme.palette.text.secondary, 0.4),
                            mb: 2,
                        }}
                    />
                    <Typography variant="h6" gutterBottom>
                        Không có cửa hàng nào trong mục này
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Tất cả các cửa hàng đã được kiểm duyệt hoặc chưa có cửa hàng mới
                    </Typography>
                </Box>
            );
        }

        return (
            <Box>
                <Box sx={{ p: 3 }}>
                    {shops.map((shop) => (
                        <Card
                            key={shop.id}
                            sx={{
                                mb: 2,
                                overflow: 'hidden',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    boxShadow: theme.shadows[4],
                                },
                            }}
                        >
                            <CardContent sx={{ p: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={2}>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: '100%',
                                                height: 100,
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Image
                                                preview={false}
                                                width="100%"
                                                height={100}
                                                style={{ objectFit: 'cover' }}
                                                src={(shop.avatar as string) || '/placeholder.svg'}
                                                fallback="/placeholder.svg?height=100&width=100"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={7}>
                                        <Typography
                                            variant="h6"
                                            fontWeight="medium"
                                            gutterBottom
                                            sx={{
                                                cursor: 'pointer',
                                                color: theme.palette.primary.main,
                                            }}
                                            onClick={() => handleShopClick(shop.id || '')}
                                        >
                                            {shop.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {shop.description}
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="body2" color="text.secondary">
                                                Địa chỉ:
                                            </Typography>
                                            <Typography variant="body2">
                                                {[shop.wardName, shop.districtName, shop.cityName]
                                                    .filter(Boolean)
                                                    .join(', ') || 'Hoàng Mai, Hà Nội'}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Stack spacing={2} alignItems="flex-end">
                                            {getStatusChip(shop.statusShopEnums || '')}
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleShopClick(shop.id || '')}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Chi tiết
                                            </Button>
                                            {shop.statusShopEnums === 'ACTIVE' ? (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    disabled={actionLoading[shop.id || '']}
                                                    onClick={() =>
                                                        handleShopAction(shop.id || '', 'block')
                                                    }
                                                    startIcon={
                                                        actionLoading[shop.id || ''] ? (
                                                            <CircularProgress size={16} />
                                                        ) : (
                                                            <BlockOutlined />
                                                        )
                                                    }
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Khóa cửa hàng
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    disabled={actionLoading[shop.id || '']}
                                                    onClick={() =>
                                                        handleShopAction(shop.id || '', 'activate')
                                                    }
                                                    startIcon={
                                                        actionLoading[shop.id || ''] ? (
                                                            <CircularProgress
                                                                size={16}
                                                                color="inherit"
                                                            />
                                                        ) : (
                                                            <CheckCircleOutline />
                                                        )
                                                    }
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Kích hoạt
                                                </Button>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, newPage) => setPage(newPage)}
                        color="primary"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            </Box>
        );
    }
};

// Days of Week Label for OpenTimeRequests
const daysOfWeekLabel: { [key: string]: string } = {
    MONDAY: 'Thứ Hai',
    TUESDAY: 'Thứ Ba',
    WEDNESDAY: 'Thứ Tư',
    THURSDAY: 'Thứ Năm',
    FRIDAY: 'Thứ Sáu',
    SATURDAY: 'Thứ Bảy',
    SUNDAY: 'Chủ Nhật',
};

export default ModerationPage;
