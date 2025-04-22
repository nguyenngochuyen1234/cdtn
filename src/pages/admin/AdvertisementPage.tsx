'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    useTheme,
    Tabs,
    Tab,
    TablePagination,
} from '@mui/material';
import {
    Add as AddIcon,
    AttachMoney as AttachMoneyIcon,
    CalendarMonth as CalendarMonthIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Image as ImageIcon,
    Refresh as RefreshIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import userApi from '@/api/userApi';
import adsApi, { CreateAds, PaginationAdvertisementRequest } from '@/api/adsApi';
import { toast } from 'react-toastify';

interface Advertisement {
    id: string;
    name: string;
    description: string;
    price: number;
    advertisementTypeEnum: 'STANDARD' | 'PREMIUM' | 'VIP';
    thumbnail: string;
    durationDays: number;
    createdAt: string;
    status?: 'OPEN' | 'CLOSE';
}

const AdvertisementPage: React.FC = () => {
    const theme = useTheme();
    const [data, setData] = useState<Advertisement[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<Advertisement | null>(null);
    const [viewingItem, setViewingItem] = useState<Advertisement | null>(null);
    const [formValues, setFormValues] = useState<Partial<Advertisement>>({
        name: '',
        description: '',
        price: 0,
        advertisementTypeEnum: 'PREMIUM',
        thumbnail: '',
        durationDays: 30,
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [previewImage, setPreviewImage] = useState<string>('');
    const [fileUploaded, setFileUploaded] = useState<File | null>(null);
    const [selectedTab, setSelectedTab] = useState<'OPEN' | 'CLOSE'>('OPEN');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [confirmPauseOpen, setConfirmPauseOpen] = useState(false);
    const [adToPause, setAdToPause] = useState<string | null>(null);

    const getDisplayType = (type: string) => {
        switch (type) {
            case 'PREMIUM':
                return 'Cao cấp';
            case 'STANDARD':
                return 'Tiêu chuẩn';
            case 'VIP':
                return 'Đặc biệt';
            default:
                return type;
        }
    };

    const fetchAdvertisements = async () => {
        setLoading(true);
        try {
            const request: PaginationAdvertisementRequest = {
                limit: rowsPerPage,
                page,
                sort: 'createAt',
                keyword: '',
                status: selectedTab,
            };
            const response = await adsApi.getAllAdsvertisement(request);
            const ads = response.data.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                advertisementTypeEnum: item.advertisementType || 'PREMIUM',
                thumbnail: item.thumbnail,
                durationDays: item.durationDay || 0,
                createdAt: dayjs(item.createdAt * 1000).toISOString(),
                status: item.statusAdvertisement,
            }));
            setData(ads);
            setTotalItems(response.data.meta.total);
        } catch (error) {
            console.error('Error fetching advertisements', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvertisements();
    }, [page, rowsPerPage, selectedTab]);

    const handleAdd = () => {
        setEditingItem(null);
        setFormValues({
            name: '',
            description: '',
            price: 0,
            advertisementTypeEnum: 'PREMIUM',
            thumbnail: '',
            durationDays: 30,
        });
        setFormErrors({});
        setPreviewImage('');
        setFileUploaded(null);
        setModalVisible(true);
    };

    const handleEdit = async (record: Advertisement) => {
        try {
            const response = await adsApi.getAdsById(record.id);
            const ad = response.data.data;
            const updatedItem: Advertisement = {
                id: ad.id,
                name: ad.name,
                description: ad.description,
                price: ad.price,
                advertisementTypeEnum: ad.advertisementType || 'PREMIUM',
                thumbnail: ad.thumbnail,
                durationDays: ad.durationDay || 0,
                createdAt: dayjs(ad.createdAt * 1000).toISOString(),
                status: ad.statusAdvertisement,
            };
            setEditingItem(updatedItem);
            setFormValues({
                ...updatedItem,
                durationDays: updatedItem.durationDays,
            });
            setPreviewImage(updatedItem.thumbnail);
            setFileUploaded(null);
            setFormErrors({});
            setModalVisible(true);
        } catch (error) {
            console.error('Error fetching advertisement for editing', error);
            setEditingItem(record);
            setFormValues({
                ...record,
                durationDays: record.durationDays,
            });
            setPreviewImage(record.thumbnail);
            setFileUploaded(null);
            setFormErrors({});
            setModalVisible(true);
        }
    };

    const handleViewDetails = async (id: string) => {
        try {
            const response = await adsApi.getAdsById(id);
            const ad = response.data.data;
            setViewingItem({
                id: ad.id,
                name: ad.name,
                description: ad.description,
                price: ad.price,
                advertisementTypeEnum: ad.advertisementType || 'PREMIUM',
                thumbnail: ad.thumbnail,
                durationDays: ad.durationDay || 0,
                createdAt: dayjs(ad.createdAt * 1000).toISOString(),
                status: ad.statusAdvertisement,
            });
            setDetailsModalVisible(true);
        } catch (error) {
            console.error('Error fetching advertisement details', error);
        }
    };

    const handleDelete = (id: string) => {
        setAdToPause(id);
        setConfirmPauseOpen(true);
    };

    const confirmPause = async () => {
        if (adToPause) {
            try {
                await adsApi.deActive(adToPause);
                console.log('Paused advertisement with ID:', adToPause);
                fetchAdvertisements();
            } catch (error) {
                console.error('Error pausing advertisement', error);
            }
        }
        setConfirmPauseOpen(false);
        setAdToPause(null);
    };

    const handleReactivate = async (id: string) => {
        try {
            await adsApi.reActive(id);
            console.log('Reactivated advertisement with ID:', id);
            fetchAdvertisements();
        } catch (error) {
            console.error('Error reactivating advertisement', error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileUploaded(file);
            try {
                const response = await userApi.uploadImage(file);
                const imageUrl = response.data.data;
                setFormValues((prev) => ({ ...prev, thumbnail: imageUrl }));
                setPreviewImage(imageUrl);
            } catch (error) {
                console.error('Error uploading image', error);
                setFormErrors((prev) => ({
                    ...prev,
                    thumbnail: 'Không thể tải ảnh lên. Vui lòng thử lại.',
                }));
                setFileUploaded(null);
            }
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name as string]: value }));

        if (formErrors[name as string]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name as string];
                return newErrors;
            });
        }

        if (name === 'thumbnail') {
            setPreviewImage(value as string);
            setFileUploaded(null);
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formValues.name?.trim()) {
            errors.name = 'Tên chương trình quảng cáo không được để trống';
        }

        const hasThumbnailUrl = !!formValues.thumbnail?.trim();

        if (!formValues.durationDays || formValues.durationDays <= 0) {
            errors.durationDays = 'Không được để trống thời lượng của gói này';
        }

        if (!formValues.price || formValues.price < 0) {
            errors.price = 'Giá không được để trống và phải lớn hơn 0';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        const adData: CreateAds = {
            name: formValues.name || '',
            description: formValues.description || '',
            price: formValues.price || 0,
            advertisementTypeEnum: formValues.advertisementTypeEnum as
                | 'STANDARD'
                | 'PREMIUM'
                | 'VIP',
            thumbnail: formValues.thumbnail || '',
            durationDay: formValues.durationDays || 0,
        };

        try {
            if (editingItem) {
                const response = await adsApi.updateAds(adData, editingItem.id);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setModalVisible(false);
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const response = await adsApi.createAds(adData);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setModalVisible(false);
                } else {
                    toast.error(response.data.message);
                }
            }
            fetchAdvertisements();
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };

    const getTypeChip = (type: string) => {
        const color = type === 'PREMIUM' ? 'error' : type === 'VIP' ? 'success' : 'primary';
        return <Chip label={getDisplayType(type)} color={color} size="small" />;
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: 'OPEN' | 'CLOSE') => {
        setSelectedTab(newValue);
        setPage(0);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const AdvertisementRow = React.memo(
        ({
            item,
            index,
            page,
            handleViewDetails,
            handleEdit,
            handleDelete,
            handleReactivate,
            selectedTab,
        }: any) => (
            <TableRow
                key={item.id}
                sx={{
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                }}
            >
                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell>
                    <Box>
                        <Typography variant="body1" fontWeight="medium">
                            {item.name}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                        {item.price.toLocaleString()} VND
                    </Typography>
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarMonthIcon
                            fontSize="small"
                            sx={{
                                color: theme.palette.primary.main,
                                mr: 1,
                                opacity: 0.7,
                            }}
                        />
                        <Box>
                            <Typography variant="body2">{item.durationDays} ngày</Typography>
                        </Box>
                    </Box>
                </TableCell>
                <TableCell align="right">
                    <Tooltip title="Xem chi tiết">
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleViewDetails(item.id)}
                            sx={{ mr: 1 }}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(item)}
                            sx={{ mr: 1 }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    {selectedTab === 'OPEN' ? (
                        <Tooltip title="Tạm dừng">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(item.id)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Kích hoạt lại">
                            <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleReactivate(item.id)}
                            >
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </TableCell>
            </TableRow>
        )
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Quản lý quảng cáo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Quản lý các gói quảng cáo trong hệ thống
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            sx={{ height: 40 }}
                            onClick={fetchAdvertisements}
                        >
                            Làm mới
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAdd}
                            sx={{ height: 40 }}
                            color="primary"
                        >
                            Thêm mới quảng cáo
                        </Button>
                    </Stack>
                </Stack>

                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    sx={{ mb: 2 }}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="Đang hoạt động" value="OPEN" />
                    <Tab label="Đang tạm dừng" value="CLOSE" />
                </Tabs>

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <TableContainer component={Paper} elevation={0}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead sx={{ backgroundColor: theme.palette.background.default }}>
                                <TableRow>
                                    <TableCell width={50}>#</TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Tên quảng cáo
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Giá
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Thời hạn
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Thao tác
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography variant="body2">Đang tải...</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Box sx={{ textAlign: 'center', p: 3 }}>
                                                <ImageIcon
                                                    sx={{
                                                        fontSize: 48,
                                                        color: theme.palette.text.secondary,
                                                        opacity: 0.2,
                                                        mb: 1,
                                                    }}
                                                />
                                                <Typography variant="h6" gutterBottom>
                                                    Chưa có quảng cáo nào
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mb: 2 }}
                                                >
                                                    Hãy thêm quảng cáo mới để bắt đầu
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    onClick={handleAdd}
                                                    size="small"
                                                >
                                                    Thêm quảng cáo
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((item, index) => (
                                        <AdvertisementRow
                                            key={item.id}
                                            item={item}
                                            index={index}
                                            page={page}
                                            handleViewDetails={handleViewDetails}
                                            handleEdit={handleEdit}
                                            handleDelete={handleDelete}
                                            handleReactivate={handleReactivate}
                                            selectedTab={selectedTab}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 12, 25]}
                        component="div"
                        count={totalItems}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Box>

            <Dialog
                open={modalVisible}
                onClose={() => setModalVisible(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: theme.shadows[10],
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        {editingItem ? 'Chỉnh sửa quảng cáo' : 'Thêm mới quảng cáo'}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => setModalVisible(false)}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                label="Tên quảng cáo"
                                name="name"
                                value={formValues.name || ''}
                                onChange={handleInputChange}
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                                margin="normal"
                            />

                            <TextField
                                fullWidth
                                label="Mô tả"
                                name="description"
                                value={formValues.description || ''}
                                onChange={handleInputChange}
                                multiline
                                rows={3}
                                margin="normal"
                            />

                            <Grid container spacing={2} sx={{ mt: 0 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Giá"
                                        name="price"
                                        type="number"
                                        value={formValues.price || ''}
                                        onChange={handleInputChange}
                                        error={!!formErrors.price}
                                        helperText={formErrors.price}
                                        margin="normal"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AttachMoneyIcon />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">VND</InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="ad-type-label">Loại quảng cáo</InputLabel>
                                        <Select
                                            labelId="ad-type-label"
                                            name="advertisementTypeEnum"
                                            value={formValues.advertisementTypeEnum || 'PREMIUM'}
                                            onChange={handleInputChange}
                                            label="Loại quảng cáo"
                                        >
                                            <MenuItem value="PREMIUM">Cao cấp</MenuItem>
                                            <MenuItem value="STANDARD">Tiêu chuẩn</MenuItem>
                                            <MenuItem value="VIP">Đặc biệt</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<ImageIcon />}
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Tải ảnh lên
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImageUpload}
                                />
                            </Button>

                            <TextField
                                fullWidth
                                label="Thời lượng (ngày)"
                                name="durationDays"
                                type="number"
                                value={formValues.durationDays || ''}
                                onChange={handleInputChange}
                                error={!!formErrors.durationDays}
                                helperText={formErrors.durationDays}
                                margin="normal"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">ngày</InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Xem trước ảnh
                            </Typography>
                            <Paper
                                variant="outlined"
                                sx={{
                                    height: 200,
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    borderRadius: 1,
                                    mb: 2,
                                }}
                            >
                                {previewImage ? (
                                    <Box
                                        component="img"
                                        src={previewImage}
                                        alt="Preview"
                                        sx={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                ) : (
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <ImageIcon
                                            sx={{
                                                fontSize: 40,
                                                color: theme.palette.text.secondary,
                                                opacity: 0.3,
                                            }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            Nhập URL ảnh hoặc tải lên để xem trước
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>

                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Thông tin quảng cáo
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Loại:
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                            {getDisplayType(
                                                formValues.advertisementTypeEnum || 'PREMIUM'
                                            )}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Giá:
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                            {formValues.price?.toLocaleString() || 0} VND
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Thời lượng:
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                            {formValues.durationDays || 0} ngày
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button onClick={() => setModalVisible(false)} variant="outlined">
                        Hủy
                    </Button>
                    <Button onClick={handleFormSubmit} variant="contained" color="primary">
                        {editingItem ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={detailsModalVisible}
                onClose={() => setDetailsModalVisible(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: theme.shadows[10],
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Chi tiết quảng cáo
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => setDetailsModalVisible(false)}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ p: 3 }}>
                    {viewingItem && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Tên quảng cáo
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {viewingItem.name}
                                </Typography>

                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Mô tả
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {viewingItem.description}
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            Giá
                                        </Typography>
                                        <Typography variant="body1">
                                            {viewingItem.price.toLocaleString()} VND
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            Loại quảng cáo
                                        </Typography>
                                        <Typography variant="body1">
                                            {getDisplayType(viewingItem.advertisementTypeEnum)}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    gutterBottom
                                    sx={{ mt: 2 }}
                                >
                                    Thời hạn
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarMonthIcon
                                        fontSize="small"
                                        sx={{
                                            color: theme.palette.primary.main,
                                            mr: 1,
                                            opacity: 0.7,
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="body1">
                                            {viewingItem.durationDays} ngày
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Ảnh đại diện
                                </Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        height: 200,
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        borderRadius: 1,
                                    }}
                                >
                                    {viewingItem.thumbnail ? (
                                        <Box
                                            component="img"
                                            src={viewingItem.thumbnail}
                                            alt={viewingItem.name}
                                            sx={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain',
                                            }}
                                        />
                                    ) : (
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                            <ImageIcon
                                                sx={{
                                                    fontSize: 40,
                                                    color: theme.palette.text.secondary,
                                                    opacity: 0.3,
                                                }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                Không có ảnh
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDetailsModalVisible(false)} variant="outlined">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmPauseOpen}
                onClose={() => setConfirmPauseOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        Xác nhận tạm dừng
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Bạn có đồng ý tạm dừng kích hoạt quảng cáo này không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmPauseOpen(false)} variant="outlined">
                        Hủy
                    </Button>
                    <Button onClick={confirmPause} variant="contained" color="error">
                        Tạm dừng
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdvertisementPage;
