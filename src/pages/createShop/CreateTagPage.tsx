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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Category } from '@/models';
import usersCategory from '@/api/usersCategory';
import { AppDispatch, RootState } from '@/redux/stores';
import { useDispatch, useSelector } from 'react-redux';
import { setNewShop } from '@/redux/createShop';

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
            }
        };

        const debounceFetch = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceFetch);
    }, [childCategory, selectedParent]);

    const handleNext = async () => {
        if (!selectedParent) {
            setError('Bạn cần chọn category cha.');
            return;
        }
        const check = await usersCategory.validateTag({
            idParent: selectedParent,
            tags: selectedChildCategories,
        });
        try {
            if (check.data.success) {
                const result = await usersCategory.createCategory({
                    idParent: selectedParent,
                    tags: selectedChildCategories,
                });
                if (result.data.success) {
                    const idCategory = result.data.data.id;
                    dispatch(setNewShop({ idCategory: idCategory, ...store }));
                    navigate('/biz/upload-image');
                }
            }
        } catch (error) {
            console.error('Error validating category:', error);
            setError('Đã xảy ra lỗi khi xác thực category con.');
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
        <Box sx={{ width: '100%', mx: 'auto', mt: 4, p: 2, boxShadow: 2, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Chọn và nhập Category
            </Typography>

            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                Chọn category cha:
            </Typography>
            <Select
                value={selectedParent}
                onChange={(e) => setSelectedParent(e.target.value)}
                fullWidth
                displayEmpty
            >
                <MenuItem value="" disabled>
                    -- Chọn category cha --
                </MenuItem>
                {parentCategories?.map((category: Category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                ))}
            </Select>

            <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>
                Nhập category con:
            </Typography>
            <TextField
                value={childCategory}
                onChange={(e) => setChildCategory(e.target.value)}
                placeholder="Nhập category con"
                fullWidth
            />
            {suggestions.length > 0 && (
                <List sx={{ mt: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                    {suggestions.map((suggestion, index) => (
                        <ListItemButton
                            key={index}
                            onClick={() => {
                                handleSuggestionClick(suggestion);
                            }}
                        >
                            <ListItemText primary={suggestion} />
                        </ListItemButton>
                    ))}
                </List>
            )}

            <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>
                Các category con đã chọn:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {selectedChildCategories.map((category, index) => (
                    <Chip
                        key={index}
                        label={category}
                        onDelete={() => handleRemoveChildCategory(category)}
                    />
                ))}
            </Stack>

            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
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
