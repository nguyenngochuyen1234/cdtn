import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    IconButton,
    Collapse,
    Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import cmsApi from '@/api/cmsApi';
import { AxiosResponse } from 'axios';
import { Category, Tag } from '@/models';
import CategoryModal from '@/components/modals/admin/CategoryModal';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontWeight: 'bold',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});

    const fetchCategory = async () => {
        try {
            const dataCategories: AxiosResponse = await cmsApi.getAllCategories();
            if (dataCategories.data.data) {
                setCategories(dataCategories.data.data);
            }
        } catch (err) {
            console.error('Error fetching categories', err);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

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
            const responseUpdateTags = await cmsApi.deleteTag(categoryId, updateTags);

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
            } else {
                const responseUpdateCategory = await cmsApi.updateCategory({
                    ...newData,
                    parentId: currentCategory.id,
                });
                const responseUpdateTags = await cmsApi.updateTags(currentCategory.id || '', tags);
                const updateCategories = categories.map((item) =>
                    item.id === currentCategory.id ? responseUpdateCategory.data.data : item
                );
                setCategories(updateCategories);
            }
            handleModalClose();
        } catch (err) {
            console.error('Error saving category', err);
        }
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-bold text-center mb-5">Danh sách danh mục</h1>
            <Button variant="contained" color="primary" onClick={() => handleModalOpen(null)}>
                Thêm mới danh mục
            </Button>
            <TableContainer component={Paper} className="mt-5">
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell />
                            <StyledTableCell>Tên danh mục</StyledTableCell>
                            <StyledTableCell>Loại</StyledTableCell>
                            <StyledTableCell sx={{ width: 150 }}>Hành động</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {categories?.map((category) => (
                            <React.Fragment key={category.id}>
                                <StyledTableRow>
                                    <StyledTableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleToggleRow(category?.id || '')}
                                        >
                                            {openRows[category.id || ''] ? (
                                                <KeyboardArrowUpIcon />
                                            ) : (
                                                <KeyboardArrowDownIcon />
                                            )}
                                        </IconButton>
                                    </StyledTableCell>
                                    <StyledTableCell>{category.name}</StyledTableCell>
                                    <StyledTableCell>{category.type}</StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleModalOpen(category)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleDeleteCategory(category.id || '')}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell
                                        style={{ paddingBottom: 0, paddingTop: 0 }}
                                        colSpan={5}
                                    >
                                        <Collapse
                                            in={openRows[category.id || '']}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Box margin={2}>
                                                <h4 className="font-bold mb-3">Tags</h4>
                                                <Table size="small">
                                                    <TableBody>
                                                        {category?.tags?.map((tag, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{tag}</TableCell>
                                                                <TableCell sx={{ width: 50 }}>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="secondary"
                                                                        onClick={() =>
                                                                            handleDeleteTag(
                                                                                category.id || '',
                                                                                tag,
                                                                                category?.tags || []
                                                                            )
                                                                        }
                                                                    >
                                                                        <span>Xóa</span>
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </StyledTableCell>
                                </StyledTableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CategoryModal
                open={openModal}
                currentCategory={currentCategory}
                onClose={handleModalClose}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default CategoriesPage;
