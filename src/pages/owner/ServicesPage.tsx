'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Pagination,
    Select,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useMediaQuery,
    Alert,
    Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ownerApi from '@/api/ownApi';
import axios from 'axios';
import shopApi from '@/api/shopApi';
import userApi from '@/api/userApi';
import { getLastNameByToken } from '@/utils/JwtService';

interface Service {
    id: string;
    idShop: string;
    name: string;
    type: string;
    thumbnail: string;
    mediaUrl: string[];
    categoryId: string;
    description: string;
    stateService: 'CLOSE' | 'OPEN';
    hasAnOwner: boolean;
    longitude: string;
    latitude: string;
    countReview: number;
    point: number;
    price: number;
    isDelete: boolean;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ImagePreview = styled('img')(({ theme }) => ({
    width: '100%',
    height: 150,
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
}));

const ServiceManagement: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [services, setServices] = useState<Service[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // Form state
    const [formData, setFormData] = useState<Partial<Service>>({
        name: '',
        description: '',
        thumbnail: '',
        mediaUrl: [],
        categoryId: '',
        type: '',
        price: 0,
        stateService: 'OPEN',
        longitude: '',
        latitude: '',
        countReview: 0,
        point: 0,
        hasAnOwner: true,
        isDelete: false,
    });

    // Preview state
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [mediaPreview, setMediaPreview] = useState<string[]>([]);

    const fetchData = async (currentPage: number = 1) => {
        setLoading(true);
        try {
            const res = await ownerApi.getAllService({
                limit,
                page: currentPage - 1,
            });
            if (res.data.success) {
                setServices(res.data.data || []);
                setTotalPages(res.data.data.totalPages || 1);
            }
        } catch (err) {
            console.error('Error fetching services:', err);
            showSnackbar('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            thumbnail: '',
            mediaUrl: [],
            categoryId: '',
            type: '',
            price: 0,
            stateService: 'OPEN',
            longitude: '',
            latitude: '',
            countReview: 0,
            point: 0,
            hasAnOwner: true,
            isDelete: false,
        });
        setThumbnailPreview('');
        setMediaPreview([]);
    };

    const handleAdd = () => {
        setEditingService(null);
        resetForm();
        setIsFormOpen(true);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData({ ...service });
        setThumbnailPreview(service.thumbnail);
        setMediaPreview(service.mediaUrl || []);
        setIsFormOpen(true);
    };

    const handleViewDetails = (service: Service) => {
        setSelectedService(service);
        setIsDetailDialogOpen(true);
    };

    const handleDeleteConfirm = (service: Service) => {
        setSelectedService(service);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedService?.id) return;

        try {
            await ownerApi.deleteService(selectedService.id);
            setServices(services.filter((service) => service.id !== selectedService.id));
            showSnackbar('Xóa dịch vụ thành công', 'success');
            if (services.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchData(page);
            }
        } catch (err) {
            console.error('Error deleting service:', err);
            showSnackbar('Không thể xóa dịch vụ. Vui lòng thử lại sau.', 'error');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' ? Number.parseFloat(value) || 0 : value,
        });
    };

    const handleStatusChange = (e: any) => {
        setFormData({
            ...formData,
            stateService: e.target.value as 'OPEN' | 'CLOSE',
        });
    };

    const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSaving(true);
            try {
                const file = e.target.files[0];
                const url = await userApi.uploadImage(file);
                setFormData({
                    ...formData,
                    thumbnail: url.data.data,
                });
                setThumbnailPreview(url.data.data);
                showSnackbar('Tải ảnh đại diện thành công', 'success');
            } catch (err) {
                console.error('Error uploading thumbnail:', err);
                showSnackbar('Không thể tải ảnh đại diện. Vui lòng thử lại.', 'error');
            } finally {
                setSaving(false);
            }
        }
    };

    const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSaving(true);
            try {
                const files = Array.from(e.target.files);
                let email = localStorage.getItem('EMAIL_BIZ');
                if (!email) {
                    email = getLastNameByToken();
                }
                const urls = await shopApi.uploadMultipleImage(files, email);
                setFormData({
                    ...formData,
                    mediaUrl: [...(formData.mediaUrl || []), ...urls.data.data],
                });
                setMediaPreview([...mediaPreview, ...urls.data.data]);
                showSnackbar('Tải ảnh dịch vụ thành công', 'success');
            } catch (err) {
                console.error('Error uploading media:', err);
                showSnackbar('Không thể tải ảnh dịch vụ. Vui lòng thử lại.', 'error');
            } finally {
                setSaving(false);
            }
        }
    };

    const handleRemoveMedia = (index: number) => {
        const newMediaUrls = [...(formData.mediaUrl || [])];
        newMediaUrls.splice(index, 1);
        setFormData({
            ...formData,
            mediaUrl: newMediaUrls,
        });

        const newMediaPreview = [...mediaPreview];
        newMediaPreview.splice(index, 1);
        setMediaPreview(newMediaPreview);
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false,
        });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.price) {
            showSnackbar('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }

        if (!editingService && !formData.thumbnail) {
            showSnackbar('Vui lòng chọn ảnh đại diện', 'error');
            return;
        }

        setSaving(true);
        try {
            const serviceData = {
                name: formData.name || '',
                description: formData.description || '',
                thumbnail: formData.thumbnail || '',
                mediaUrl: formData.mediaUrl || [],
                stateService: formData.stateService || 'OPEN',
                price: formData.price || 0,
            };

            if (editingService?.id) {
                await ownerApi.updateService(editingService.id, serviceData);
                showSnackbar('Cập nhật dịch vụ thành công', 'success');
            } else {
                const res = await ownerApi.createService(serviceData);
                if (res.data.success) {
                    showSnackbar('Thêm dịch vụ thành công', 'success');
                }
            }

            setIsFormOpen(false);
            resetForm();
            fetchData(page);
        } catch (err) {
            console.error('Error saving service:', err);
            showSnackbar('Không thể lưu dịch vụ. Vui lòng thử lại sau.', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                    }}
                >
                    <Typography variant="h5" component="h1">
                        Quản lý dịch vụ
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                        sx={{ borderRadius: 2 }}
                    >
                        Thêm dịch vụ
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên dịch vụ</TableCell>
                                        <TableCell>Mô tả</TableCell>
                                        <TableCell align="right">Giá (VND)</TableCell>
                                        <TableCell align="center">Trạng thái</TableCell>
                                        <TableCell align="center">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {services.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography variant="body1" sx={{ py: 3 }}>
                                                    Chưa có dịch vụ nào. Hãy thêm dịch vụ mới.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        services.map((service) => (
                                            <TableRow key={service.id} hover>
                                                <TableCell>{service.name}</TableCell>
                                                <TableCell>
                                                    {service.description.length > 100
                                                        ? `${service.description.substring(
                                                              0,
                                                              100
                                                          )}...`
                                                        : service.description}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {service.price.toLocaleString()}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={
                                                            service.stateService === 'OPEN'
                                                                ? 'Hoạt động'
                                                                : 'Không hoạt động'
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                            backgroundColor:
                                                                service.stateService === 'OPEN'
                                                                    ? 'success.light'
                                                                    : 'error.light',
                                                            color:
                                                                service.stateService === 'OPEN'
                                                                    ? 'success.dark'
                                                                    : 'error.dark',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        justifyContent="center"
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() =>
                                                                handleViewDetails(service)
                                                            }
                                                            title="Xem chi tiết"
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="secondary"
                                                            onClick={() => handleEdit(service)}
                                                            title="Chỉnh sửa"
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() =>
                                                                handleDeleteConfirm(service)
                                                            }
                                                            title="Xóa"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            {/* Add/Edit Service Dialog */}
            <Dialog
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
            >
                <DialogTitle>
                    {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                    <IconButton
                        aria-label="close"
                        onClick={() => setIsFormOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="name"
                                label="Tên dịch vụ"
                                value={formData.name}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                margin="normal"
                            />
                            <TextField
                                name="description"
                                label="Mô tả"
                                value={formData.description}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                multiline
                                rows={4}
                                margin="normal"
                            />
                            <TextField
                                name="price"
                                label="Giá"
                                type="number"
                                value={formData.price}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                margin="normal"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">VND</InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Ảnh đại diện
                            </Typography>
                            <Box
                                sx={{
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    p: 1,
                                    mb: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                {thumbnailPreview ? (
                                    <Box sx={{ width: '100%', mb: 2 }}>
                                        <ImagePreview
                                            src={thumbnailPreview || '/placeholder.svg'}
                                            alt="Thumbnail preview"
                                        />
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'action.hover',
                                            borderRadius: 1,
                                            mb: 2,
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            Không có ảnh đại diện
                                        </Typography>
                                    </Box>
                                )}
                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    sx={{ mb: 1 }}
                                    disabled={saving}
                                >
                                    Chọn ảnh đại diện
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                    />
                                </Button>
                            </Box>

                            <Typography variant="subtitle1" gutterBottom>
                                Hình ảnh dịch vụ
                            </Typography>
                            <Box
                                sx={{
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    p: 1,
                                    mb: 2,
                                }}
                            >
                                <Grid container spacing={1}>
                                    {mediaPreview.map((url, index) => (
                                        <Grid item xs={6} sm={4} key={index}>
                                            <Box sx={{ position: 'relative' }}>
                                                <ImagePreview
                                                    src={url || '/placeholder.svg'}
                                                    alt={`Media preview ${index}`}
                                                />
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        backgroundColor: 'error.main',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: 'error.dark',
                                                        },
                                                    }}
                                                    onClick={() => handleRemoveMedia(index)}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    ))}
                                    <Grid item xs={6} sm={4}>
                                        <Box
                                            sx={{
                                                height: 150,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'action.hover',
                                                borderRadius: 1,
                                                cursor: 'pointer',
                                            }}
                                            component="label"
                                        >
                                            <AddIcon
                                                sx={{ fontSize: 40, color: 'text.secondary' }}
                                            />
                                            <VisuallyHiddenInput
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleMediaChange}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsFormOpen(false)} color="inherit">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        disabled={saving}
                        startIcon={saving && <CircularProgress size={20} color="inherit" />}
                    >
                        {saving ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa dịch vụ "{selectedService?.name}"? Hành động này
                        không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)} color="inherit">
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Detail Service Dialog */}
            <Dialog
                open={isDetailDialogOpen}
                onClose={() => setIsDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
            >
                {selectedService && (
                    <>
                        <DialogTitle>
                            Chi tiết dịch vụ
                            <IconButton
                                aria-label="close"
                                onClick={() => setIsDetailDialogOpen(false)}
                                sx={{ position: 'absolute', right: 8, top: 8 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedService.name}
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Typography variant="subtitle2" color="text.secondary">
                                        Mô tả
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {selectedService.description}
                                    </Typography>

                                    <Typography variant="subtitle2" color="text.secondary">
                                        Giá
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {selectedService.price.toLocaleString()} VND
                                    </Typography>

                                    <Typography variant="subtitle2" color="text.secondary">
                                        Trạng thái
                                    </Typography>
                                    <Chip
                                        label={
                                            selectedService.stateService === 'OPEN'
                                                ? 'Hoạt động'
                                                : 'Không hoạt động'
                                        }
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            backgroundColor:
                                                selectedService.stateService === 'OPEN'
                                                    ? 'success.light'
                                                    : 'error.light',
                                            color:
                                                selectedService.stateService === 'OPEN'
                                                    ? 'success.dark'
                                                    : 'error.dark',
                                        }}
                                    />

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Đánh giá
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                mt: 1,
                                            }}
                                        >
                                            <Typography variant="body2" color="text.secondary">
                                                ({selectedService.countReview} lượt đánh giá)
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Ảnh đại diện
                                    </Typography>
                                    <Box sx={{ mb: 3 }}>
                                        {selectedService.thumbnail ? (
                                            <img
                                                src={
                                                    selectedService.thumbnail || '/placeholder.svg'
                                                }
                                                alt={selectedService.name}
                                                style={{
                                                    width: '100%',
                                                    height: 200,
                                                    objectFit: 'cover',
                                                    borderRadius: 8,
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: 200,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'action.hover',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography variant="body2" color="text.secondary">
                                                    Không có ảnh đại diện
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    <Typography variant="subtitle1" gutterBottom>
                                        Hình ảnh dịch vụ
                                    </Typography>
                                    {selectedService.mediaUrl &&
                                    selectedService.mediaUrl.length > 0 ? (
                                        <Grid container spacing={1}>
                                            {selectedService.mediaUrl.map((url, index) => (
                                                <Grid item xs={6} sm={4} key={index}>
                                                    <img
                                                        src={url || '/placeholder.svg'}
                                                        alt={`${selectedService.name} - ${index}`}
                                                        style={{
                                                            width: '100%',
                                                            height: 120,
                                                            objectFit: 'cover',
                                                            borderRadius: 8,
                                                        }}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Box
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                backgroundColor: 'action.hover',
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="body2" color="text.secondary">
                                                Không có hình ảnh dịch vụ
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => handleEdit(selectedService)}
                                color="secondary"
                                startIcon={<EditIcon />}
                            >
                                Chỉnh sửa
                            </Button>
                            <Button
                                onClick={() => setIsDetailDialogOpen(false)}
                                color="primary"
                                variant="contained"
                            >
                                Đóng
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ServiceManagement;
