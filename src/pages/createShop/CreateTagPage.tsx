import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    MenuItem,
    Select,
    TextField,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Chip,
    Stack,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Category } from '@/models';
import usersCategory from '@/api/usersCategory';
import { AppDispatch, RootState } from '@/redux/stores';
import { useDispatch, useSelector } from 'react-redux';
import { setNewShop } from '@/redux/createShop';
import CreationStepper from './StepperComponent';

function CreateTagPage() {
    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const dispatch: AppDispatch = useDispatch();
    const store = useSelector((state: RootState) => state.newShop.newShop);
    const [selectedParent, setSelectedParent] = useState('');
    const [childCategory, setChildCategory] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [selectedChildCategories, setSelectedChildCategories] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                const response = await usersCategory.getAllCategories();
                if (response.data) {
                    setParentCategories(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching parent categories:', error);
            }
        };
        fetchParentCategories();
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (childCategory.trim() === '') {
                setSuggestions([]);
                return;
            }
            try {
                const response = await usersCategory.getAllSuggestTag({
                    idCategory: selectedParent,
                    keyword: childCategory,
                });
                setSuggestions(response.data.data.tags);
                setError('');
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setError('Không thể tải gợi ý.');
            }
        };
        const debounceFetch = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceFetch);
    }, [childCategory, selectedParent]);

    const handleNext = async () => {
        if (!selectedParent) {
            setError('Bạn cần chọn danh mục cha.');
            return;
        }
        try {
            const check = await usersCategory.validateTag({
                idParent: selectedParent,
                tags: selectedChildCategories,
            });
            if (check.data.success) {
                const result = await usersCategory.createCategory({
                    idParent: selectedParent,
                    tags: selectedChildCategories,
                });
                if (result.data.success) {
                    const idCategory = result.data.data.id;
                    dispatch(setNewShop({ idCategory, ...store }));
                    localStorage.setItem('IDCATEGORY_BIZ', idCategory);
                    navigate('/biz/upload-image');
                } else {
                    setError('Tạo danh mục thất bại.');
                }
            } else {
                setError('Xác thực danh mục con không thành công.');
            }
        } catch (error) {
            console.error('Error validating category:', error);
            setError('Đã xảy ra lỗi khi xác thực danh mục.');
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (!selectedChildCategories.includes(suggestion)) {
            setSelectedChildCategories([...selectedChildCategories, suggestion]);
        }
        setSuggestions([]);
        setChildCategory('');
    };

    const handleRemoveChildCategory = (category: string) => {
        setSelectedChildCategories(selectedChildCategories.filter((item) => item !== category));
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: 'auto',
                my: 4,
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <CreationStepper     />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Chọn Danh Mục
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Chọn danh mục cha và thêm các danh mục con để mô tả cửa hàng của bạn.
            </Typography>
            <Box sx={{ spaceY: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                    Danh mục cha <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Select
                    value={selectedParent}
                    onChange={(e) => setSelectedParent(e.target.value)}
                    fullWidth
                    displayEmpty
                    variant="outlined"
                >
                    <MenuItem value="" disabled>
                        -- Chọn danh mục cha --
                    </MenuItem>
                    {parentCategories.map((category: Category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            <Box sx={{ mt: 3, spaceY: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                    Danh mục con
                </Typography>
                <TextField
                    value={childCategory}
                    onChange={(e) => setChildCategory(e.target.value)}
                    placeholder="Nhập danh mục con"
                    fullWidth
                    variant="outlined"
                />
                {suggestions.length > 0 && (
                    <List sx={{ mt: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        {suggestions.map((suggestion, index) => (
                            <ListItemButton
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                <ListItemText primary={suggestion} />
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                    Danh mục con đã chọn
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {selectedChildCategories.map((category, index) => (
                        <Chip
                            key={index}
                            label={category}
                            onDelete={() => handleRemoveChildCategory(category)}
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                </Stack>
            </Box>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ mt: 3, width: '100%' }}
            >
                Tiếp theo
            </Button>
        </Box>
    );
}

export default CreateTagPage;
