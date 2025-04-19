'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    Chip,
    Collapse,
    Container,
    Grid,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
    alpha,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Add,
    Category as CategoryIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    KeyboardArrowDown,
    Label as LabelIcon,
    Refresh,
} from '@mui/icons-material';
import cmsApi from '@/api/cmsApi';
import type { AxiosResponse } from 'axios';
import type { Category } from '@/models';
import CategoryModal from '@/components/modals/admin/CategoryModal';
import { toast } from 'react-toastify';

const CategoriesPage: React.FC = () => {
    const theme = useTheme();
    const [categories, setCategories] = useState<Category[]>([]);
    const [shopCategories, setShopCategories] = useState<Category[]>([]); // Danh mục cửa hàng
    const [openModal, setOpenModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'SYSTEM' | 'SHOP'>('SYSTEM'); // Tab hiện tại

    // Lấy danh mục hệ thống
    const fetchSystemCategories = async () => {
        setLoading(true);
        try {
            const dataCategories: AxiosResponse = await cmsApi.getAllCategories();
            if (dataCategories.data.data) {
                setCategories(dataCategories.data.data);
            }
        } catch (err) {
            console.error('Error fetching system categories', err);
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh mục cửa hàng
    const fetchShopCategories = async () => {
        setLoading(true);
        try {
            const body = {
                page: 0,
                limit: 12
            }; // Bạn có thể thêm các tham số nếu API yêu cầu
            const dataShopCategories: AxiosResponse = await cmsApi.getListCatShop(body);
            if (dataShopCategories.data.data) {
                setShopCategories(dataShopCategories.data.data);
            }
        } catch (err) {
            console.error('Error fetching shop categories', err);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API dựa trên tab được chọn
    useEffect(() => {
        if (selectedTab === 'SYSTEM') {
            fetchSystemCategories();
        } else {
            fetchShopCategories();
        }
    }, [selectedTab]);

    const handleModalOpen = (category: Category | null = null) => {
        setCurrentCategory(category);
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setCurrentCategory(null);
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await cmsApi.deleteCategory(id);
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== id)
            );
            toast.error('Xóa danh mục thành công');
        } catch (err) {
            console.error('Error deleting category', err);
        }
    };

    const handleToggleRow = (id: string) => {
        setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDeleteTag = async (categoryId: string, tag: string, tags: string[]) => {
        try {
            const updateTags = tags?.filter((t) => t !== tag);
            await cmsApi.deleteTag(categoryId, updateTags);

            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category.id === categoryId
                        ? {
                              ...category,
                              tags: updateTags,
                          }
                        : category
                )
            );
            toast.error('Xóa thẻ thành công');
        } catch (err) {
            console.error('Error deleting tag', err);
        }
    };

    const handleSubmit = async (newCategory: Category, tags: string[]) => {
        try {
            const newData = {
                name: newCategory.name,
                type: newCategory.type,
                description: newCategory.description,
                tags: tags,
            };
            if (!currentCategory) {
                const newCategoryData = await cmsApi.addCategories(newData);
                setCategories((prev) => [...prev, newCategoryData.data.data]);
                toast.info('Thêm danh mục thành công');
            } else {
                const responseUpdateCategory = await cmsApi.updateCategory({
                    ...newData,
                    parentId: currentCategory.id,
                });
                await cmsApi.updateTags(currentCategory.id || '', tags);
                const updateCategories = categories.map((item) =>
                    item.id === currentCategory.id ? responseUpdateCategory.data.data : item
                );
                setCategories(updateCategories);
                toast.info('Chỉnh sửa danh mục thành công');
            }
            handleModalClose();
        } catch (err) {
            console.error('Error saving category', err);
        }
    };

    const getCategoryTypeChip = (type: string) => {
        let color = 'default';
        switch (type?.toLowerCase()) {
            case 'food':
                color = 'success';
                break;
            case 'travel':
                color = 'primary';
                break;
            case 'shopping':
                color = 'secondary';
                break;
            case 'entertainment':
                color = 'warning';
                break;
            default:
                color = 'default';
        }

        return (
            <Chip
                label={type}
                color={color as any}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500, textTransform: 'capitalize' }}
            />
        );
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: 'SYSTEM' | 'SHOP') => {
        setSelectedTab(newValue);
        setOpenRows({}); // Reset trạng thái mở/đóng của các hàng khi chuyển tab
    };

    // Dữ liệu hiển thị dựa trên tab
    const displayedCategories = selectedTab === 'SYSTEM' ? categories : shopCategories;

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
                            Quản lý danh mục
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Quản lý các danh mục và thẻ trong hệ thống
                        </Typography>
                    </Box>
                    {selectedTab === 'SYSTEM' && (
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={fetchSystemCategories}
                                sx={{ height: 40 }}
                                disabled={loading}
                            >
                                Làm mới
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => handleModalOpen(null)}
                                sx={{ height: 40 }}
                                color="primary"
                            >
                                Thêm mới danh mục
                            </Button>
                        </Stack>
                    )}
                </Stack>

                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    sx={{ mb: 2 }}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="Danh mục hệ thống" value="SYSTEM" />
                    <Tab label="Danh mục cửa hàng" value="SHOP" />
                </Tabs>

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <TableContainer component={Box}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={50} />
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Tên danh mục
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Loại
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Mô tả
                                        </Typography>
                                    </TableCell>
                                    {selectedTab === 'SYSTEM' && (
                                        <TableCell align="right" width={150}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                Hành động
                                            </Typography>
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {displayedCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={selectedTab === 'SYSTEM' ? 5 : 4}
                                            align="center"
                                            sx={{ py: 4 }}
                                        >
                                            <Box sx={{ textAlign: 'center', p: 3 }}>
                                                <CategoryIcon
                                                    sx={{
                                                        fontSize: 48,
                                                        color: alpha(
                                                            theme.palette.text.secondary,
                                                            0.2
                                                        ),
                                                        mb: 1,
                                                    }}
                                                />
                                                <Typography variant="h6" gutterBottom>
                                                    Chưa có danh mục nào
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mb: 2 }}
                                                >
                                                    {selectedTab === 'SYSTEM'
                                                        ? 'Hãy thêm danh mục mới để bắt đầu'
                                                        : 'Không có danh mục cửa hàng nào'}
                                                </Typography>
                                                {selectedTab === 'SYSTEM' && (
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<Add />}
                                                        onClick={() => handleModalOpen(null)}
                                                        size="small"
                                                    >
                                                        Thêm danh mục
                                                    </Button>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    displayedCategories.map((category) => (
                                        <React.Fragment key={category.id}>
                                            <TableRow
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: alpha(
                                                            theme.palette.primary.main,
                                                            0.04
                                                        ),
                                                    },
                                                    ...(openRows[category.id || ''] && {
                                                        backgroundColor: alpha(
                                                            theme.palette.primary.main,
                                                            0.04
                                                        ),
                                                    }),
                                                }}
                                            >
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleToggleRow(category?.id || '')
                                                        }
                                                        sx={{
                                                            transition: 'transform 0.2s',
                                                            transform: openRows[category.id || '']
                                                                ? 'rotate(180deg)'
                                                                : 'rotate(0deg)',
                                                        }}
                                                    >
                                                        <KeyboardArrowDown />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {category.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {getCategoryTypeChip(category.type || '')}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                        }}
                                                    >
                                                        {category.description || 'Không có mô tả'}
                                                    </Typography>
                                                </TableCell>
                                                {selectedTab === 'SYSTEM' && (
                                                    <TableCell align="right">
                                                        <Tooltip title="Chỉnh sửa">
                                                            <IconButton
                                                                color="primary"
                                                                size="small"
                                                                onClick={() =>
                                                                    handleModalOpen(category)
                                                                }
                                                                sx={{ mr: 1 }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Xóa">
                                                            <IconButton
                                                                color="error"
                                                                size="small"
                                                                onClick={() =>
                                                                    handleDeleteCategory(
                                                                        category.id || ''
                                                                    )
                                                                }
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                            <TableRow>
                                                <TableCell
                                                    style={{ paddingBottom: 0, paddingTop: 0 }}
                                                    colSpan={selectedTab === 'SYSTEM' ? 5 : 4}
                                                >
                                                    <Collapse
                                                        in={openRows[category.id || '']}
                                                        timeout="auto"
                                                        unmountOnExit
                                                    >
                                                        <Box
                                                            sx={{
                                                                py: 2,
                                                                px: 3,
                                                                backgroundColor: alpha(
                                                                    theme.palette.background
                                                                        .default,
                                                                    0.5
                                                                ),
                                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    mb: 2,
                                                                }}
                                                            >
                                                                <LabelIcon
                                                                    sx={{
                                                                        mr: 1,
                                                                        color: theme.palette
                                                                            .secondary.main,
                                                                        fontSize: 20,
                                                                    }}
                                                                />
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    fontWeight="bold"
                                                                >
                                                                    Danh sách thẻ
                                                                </Typography>
                                                            </Box>

                                                            {category?.tags?.length === 0 ? (
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        py: 2,
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    Danh mục này chưa có thẻ nào
                                                                </Typography>
                                                            ) : (
                                                                <Grid
                                                                    container
                                                                    spacing={1}
                                                                    sx={{ mt: 1 }}
                                                                >
                                                                    {category?.tags?.map(
                                                                        (tag, index) => (
                                                                            <Grid item key={index}>
                                                                                <Chip
                                                                                    label={tag}
                                                                                    size="small"
                                                                                    onDelete={
                                                                                        selectedTab ===
                                                                                        'SYSTEM'
                                                                                            ? () =>
                                                                                                  handleDeleteTag(
                                                                                                      category.id ||
                                                                                                          '',
                                                                                                      tag,
                                                                                                      category?.tags ||
                                                                                                          []
                                                                                                  )
                                                                                            : undefined
                                                                                    }
                                                                                    sx={{
                                                                                        backgroundColor:
                                                                                            alpha(
                                                                                                theme
                                                                                                    .palette
                                                                                                    .secondary
                                                                                                    .main,
                                                                                                0.1
                                                                                            ),
                                                                                        borderColor:
                                                                                            alpha(
                                                                                                theme
                                                                                                    .palette
                                                                                                    .secondary
                                                                                                    .main,
                                                                                                0.2
                                                                                            ),
                                                                                        '& .MuiChip-deleteIcon':
                                                                                            {
                                                                                                color: theme
                                                                                                    .palette
                                                                                                    .error
                                                                                                    .main,
                                                                                                '&:hover':
                                                                                                    {
                                                                                                        color: theme
                                                                                                            .palette
                                                                                                            .error
                                                                                                            .dark,
                                                                                                    },
                                                                                            },
                                                                                    }}
                                                                                />
                                                                            </Grid>
                                                                        )
                                                                    )}
                                                                </Grid>
                                                            )}
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Box>

            {selectedTab === 'SYSTEM' && (
                <CategoryModal
                    open={openModal}
                    currentCategory={currentCategory}
                    onClose={handleModalClose}
                    onSubmit={handleSubmit}
                />
            )}
        </Container>
    );
};

export default CategoriesPage;
