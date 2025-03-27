import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Chip,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    SelectChangeEvent,
} from '@mui/material';
import { Category } from '@/models';

interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (newCategory: Category, tags: string[]) => void;
    currentCategory: Category | null;
}

const validTypes = ['OTHER', 'BEAUTY_SPA', 'HOME_SERVICE', 'RESTAURANT', 'BEVERAGE', 'CUTTING'];

const CategoryModal: React.FC<CategoryModalProps> = ({
    open,
    onClose,
    onSubmit,
    currentCategory,
}) => {
    const [newCategory, setNewCategory] = useState<Category>({
        name: '',
        type: '',
        description: '',
        tags: [],
        id: '',
    });
    const [newTag, setNewTag] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    useEffect(() => {
        if (currentCategory) {
            setNewCategory({
                name: currentCategory.name,
                type: currentCategory.type,
                description: currentCategory.description,
                tags: currentCategory.tags,
                id: currentCategory.id,
            });
            setTags(currentCategory.tags || []);
        }
    }, [currentCategory]);
    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setNewCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value,
        }));
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags((prevTags) => [...prevTags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = () => {
        onSubmit(newCategory, tags);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogContent>
                <TextField
                    label="Category Name"
                    name="name"
                    value={newCategory.name}
                    onChange={handleTextFieldChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    name="description"
                    value={newCategory.description}
                    onChange={handleTextFieldChange}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Category Type</InputLabel>
                    <Select
                        label="Category Type"
                        name="type"
                        value={newCategory.type}
                        onChange={handleSelectChange}
                    >
                        {validTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="New Tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    style={{ marginTop: '10px' }}
                >
                    Add Tag
                </Button>
                <div style={{ marginTop: '10px' }}>
                    {/* Display added tags as chips */}
                    {tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            style={{ marginRight: 5, marginTop: '5px' }}
                            onDelete={() => handleRemoveTag(tag)}
                        />
                    ))}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryModal;
