'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Modal,
    List,
    ListItem,
    FormControlLabel,
    Radio,
    Checkbox,
    Divider,
    Rating,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import provincesApi from '@/api/provincesApi';
import usersCategory from '@/api/usersCategory';

interface Category {
    id: string;
    name: string;
    checked: boolean; // Multi-select with checkboxes
}

interface ClosingHour {
    id: string;
    time: string; // Display time (e.g., "12 PM")
    localTime: string; // ISO time (e.g., "12:00:00")
}

interface StarRating {
    id: number;
    value: number;
}

interface Province {
    code: string;
    name: string;
}

interface District {
    code: string;
    name: string;
}

interface FilterPanelProps {
    onFilterChange: (filters: {
        keyword: string;
        categoryId: string[]; // Multi-select
        city: string; // Single-select
        district: string; // Single-select
        openTimeId: string; // Single-select
        scoreReview: number; // Single-select
        latitude?: number;
        longitude?: number;
    }) => void;
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [closingHours, setClosingHours] = useState<ClosingHour[]>([
        { id: '1', time: '4:00 PM', localTime: '16:00:00' },
        { id: '2', time: '5:00 PM', localTime: '17:00:00' },
        { id: '3', time: '6:00 PM', localTime: '18:00:00' },
        { id: '4', time: '7:00 PM', localTime: '19:00:00' },
        { id: '5', time: '8:00 PM', localTime: '20:00:00' },
        { id: '6', time: '9:00 PM', localTime: '21:00:00' },
        { id: '7', time: '10:00 PM', localTime: '22:00:00' },
        { id: '8', time: '11:00 PM', localTime: '23:00:00' },
        { id: '9', time: '12:00 PM', localTime: '00:00:00' }, // midnight
    ]);
    const [ratings, setRatings] = useState<StarRating[]>([
        { id: 5, value: 5 },
        { id: 4, value: 4 },
        { id: 3, value: 3 },
        { id: 2, value: 2 },
        { id: 1, value: 1 },
    ]);

    // Single-selection states
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedClosingHour, setSelectedClosingHour] = useState<string>('');
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [location, setLocation] = useState<{ latitude?: number; longitude?: number }>({});

    // Modal and collapse states
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<
        'categories' | 'provinces' | 'districts' | 'closingHours' | null
    >(null);
    const [openCategories, setOpenCategories] = useState(true);
    const [openClosingHours, setOpenClosingHours] = useState(true);
    const [openRatings, setOpenRatings] = useState(true);
    const [openProvinces, setOpenProvinces] = useState(true);
    const [openDistricts, setOpenDistricts] = useState(true);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await usersCategory.getAllCategories();
                const categoryData = response.data.data.map((cat: any) => ({
                    id: cat.id,
                    name: cat.name,
                    checked: false,
                }));
                setCategories(categoryData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await provincesApi.getProvince();
                const provinceData = response.data.map((province: any) => ({
                    code: province.code,
                    name: province.name,
                }));
                setProvinces(provinceData);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch districts when a province is selected
    const fetchDistricts = async (provinceCode: string) => {
        try {
            const response = await provincesApi.getDistrict(provinceCode);
            const districtData = response.data.districts.map((district: any) => ({
                code: district.code,
                name: district.name,
            }));
            setDistricts(districtData);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    // Get user's location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    // Trigger filter change
    useEffect(() => {
        const newFilters = {
            keyword: '',
            categoryId: categories.filter((c) => c.checked).map((c) => c.id),
            city: selectedCity,
            district: selectedDistrict,
            openTimeId: selectedClosingHour,
            scoreReview: selectedRating !== null ? selectedRating : 0, // Default to 0 if not selected
            latitude: location.latitude,
            longitude: location.longitude,
        };
        onFilterChange(newFilters);
    }, [
        categories,
        selectedCity,
        selectedDistrict,
        selectedClosingHour,
        selectedRating,
        location,
        onFilterChange,
    ]);

    // Handlers for single-selection
    const handleCityChange = (code: string) => {
        if (selectedCity === code) {
            setSelectedCity(''); // Deselect if already selected
            setDistricts([]); // Clear districts if city is deselected
            setSelectedDistrict('');
        } else {
            setSelectedCity(code);
            fetchDistricts(code); // Fetch districts for the new city
        }
    };

    const handleDistrictChange = (code: string) => {
        setSelectedDistrict(selectedDistrict === code ? '' : code); // Toggle selection
    };

    const handleClosingHourChange = (localTime: string) => {
        setSelectedClosingHour(selectedClosingHour === localTime ? '' : localTime); // Toggle selection
    };

    const handleRatingChange = (value: number) => {
        setSelectedRating(selectedRating === value ? null : value); // Toggle selection
    };

    // Multi-select handler for categories
    const handleCategoryChange = (id: string) => {
        setCategories((prev) =>
            prev.map((category) =>
                category.id === id ? { ...category, checked: !category.checked } : category
            )
        );
    };

    // Modal handlers
    const handleOpenModal = (type: 'categories' | 'provinces' | 'districts' | 'closingHours') => {
        setModalType(type);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalType(null);
    };

    // Reset filters
    const handleReset = () => {
        setCategories((prev) => prev.map((category) => ({ ...category, checked: false })));
        setSelectedCity('');
        setSelectedDistrict('');
        setSelectedClosingHour('');
        setSelectedRating(null);
        setDistricts([]);
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 300 }}>
            {/* Categories (Multi-select) */}
            <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, mb: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        cursor: 'pointer',
                    }}
                    onClick={() => setOpenCategories(!openCategories)}
                >
                    <Typography variant="subtitle1" fontWeight="medium">
                        Danh mục
                    </Typography>
                    {openCategories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
                {openCategories && (
                    <Box sx={{ p: 2, pt: 0 }}>
                        {categories.slice(0, 4).map((category) => (
                            <FormControlLabel
                                key={category.id}
                                control={
                                    <Checkbox
                                        checked={category.checked}
                                        onChange={() => handleCategoryChange(category.id)}
                                    />
                                }
                                label={category.name}
                                sx={{ display: 'block' }}
                            />
                        ))}
                        {categories.length > 4 && (
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => handleOpenModal('categories')}
                                sx={{ p: 0, mt: 1 }}
                            >
                                Xem thêm
                            </Button>
                        )}
                    </Box>
                )}
            </Box>

            {/* Closing Hours (Single-select) */}
            <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, mb: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        cursor: 'pointer',
                    }}
                    onClick={() => setOpenClosingHours(!openClosingHours)}
                >
                    <Typography variant="subtitle1" fontWeight="medium">
                        Thời gian đóng cửa
                    </Typography>
                    {openClosingHours ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
                {openClosingHours && (
                    <Box sx={{ p: 2, pt: 0 }}>
                        {closingHours.slice(0, 4).map((hour) => (
                            <FormControlLabel
                                key={hour.id}
                                control={
                                    <Radio
                                        checked={selectedClosingHour === hour.localTime}
                                        onChange={() => handleClosingHourChange(hour.localTime)}
                                    />
                                }
                                label={hour.time}
                                sx={{ display: 'block' }}
                            />
                        ))}
                        {closingHours.length > 4 && (
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => handleOpenModal('closingHours')}
                                sx={{ p: 0, mt: 1 }}
                            >
                                Xem thêm
                            </Button>
                        )}
                    </Box>
                )}
            </Box>

            {/* Ratings (Single-select) */}
            <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, mb: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        cursor: 'pointer',
                    }}
                    onClick={() => setOpenRatings(!openRatings)}
                >
                    <Typography variant="subtitle1" fontWeight="medium">
                        Điểm số đánh giá
                    </Typography>
                    {openRatings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
                {openRatings && (
                    <Box sx={{ p: 2, pt: 0 }}>
                        {ratings.map((rating) => (
                            <Box
                                key={rating.id}
                                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                            >
                                <Radio
                                    checked={selectedRating === rating.value}
                                    onChange={() => handleRatingChange(rating.value)}
                                />
                                <Rating value={rating.value} readOnly />
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Provinces (Single-select) */}
            <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, mb: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        cursor: 'pointer',
                    }}
                    onClick={() => setOpenProvinces(!openProvinces)}
                >
                    <Typography variant="subtitle1" fontWeight="medium">
                        Tỉnh
                    </Typography>
                    {openProvinces ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
                {openProvinces && (
                    <Box sx={{ p: 2, pt: 0 }}>
                        {provinces.slice(0, 4).map((province) => (
                            <FormControlLabel
                                key={province.code}
                                control={
                                    <Radio
                                        checked={selectedCity === province.code}
                                        onChange={() => handleCityChange(province.code)}
                                    />
                                }
                                label={province.name}
                                sx={{ display: 'block' }}
                            />
                        ))}
                        {provinces.length > 4 && (
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => handleOpenModal('provinces')}
                                sx={{ p: 0, mt: 1 }}
                            >
                                Xem thêm
                            </Button>
                        )}
                    </Box>
                )}
            </Box>

            {/* Districts (Single-select) */}
            <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, mb: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        cursor: 'pointer',
                    }}
                    onClick={() => setOpenDistricts(!openDistricts)}
                >
                    <Typography variant="subtitle1" fontWeight="medium">
                        Huyện
                    </Typography>
                    {openDistricts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
                {openDistricts && (
                    <Box sx={{ p: 2, pt: 0 }}>
                        {districts.length > 0 ? (
                            districts
                                .slice(0, 4)
                                .map((district) => (
                                    <FormControlLabel
                                        key={district.code}
                                        control={
                                            <Radio
                                                checked={selectedDistrict === district.code}
                                                onChange={() => handleDistrictChange(district.code)}
                                            />
                                        }
                                        label={district.name}
                                        sx={{ display: 'block' }}
                                    />
                                ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Vui lòng chọn tỉnh để hiển thị huyện
                            </Typography>
                        )}
                        {districts.length > 4 && (
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => handleOpenModal('districts')}
                                sx={{ p: 0, mt: 1 }}
                            >
                                Xem thêm
                            </Button>
                        )}
                    </Box>
                )}
            </Box>

            {/* Reset Button */}
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                sx={{ width: '100%', mt: 2 }}
            >
                Reset bộ lọc
            </Button>

            {/* Modal */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box
                    sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 3,
                        width: '90%',
                        maxWidth: 400,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        {modalType === 'categories' && 'Tất cả danh mục'}
                        {modalType === 'provinces' && 'Tất cả tỉnh'}
                        {modalType === 'districts' && 'Tất cả huyện'}
                        {modalType === 'closingHours' && 'Tất cả thời gian đóng cửa'}
                    </Typography>
                    <List>
                        {modalType === 'categories' &&
                            categories.map((category) => (
                                <ListItem
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                >
                                    <FormControlLabel
                                        control={<Checkbox checked={category.checked} />}
                                        label={category.name}
                                    />
                                </ListItem>
                            ))}
                        {modalType === 'provinces' &&
                            provinces.map((province) => (
                                <ListItem
                                    key={province.code}
                                    onClick={() => handleCityChange(province.code)}
                                >
                                    <FormControlLabel
                                        control={<Radio checked={selectedCity === province.code} />}
                                        label={province.name}
                                    />
                                </ListItem>
                            ))}
                        {modalType === 'districts' &&
                            districts.map((district) => (
                                <ListItem
                                    key={district.code}
                                    onClick={() => handleDistrictChange(district.code)}
                                >
                                    <FormControlLabel
                                        control={
                                            <Radio checked={selectedDistrict === district.code} />
                                        }
                                        label={district.name}
                                    />
                                </ListItem>
                            ))}
                        {modalType === 'closingHours' &&
                            closingHours.map((hour) => (
                                <ListItem
                                    key={hour.id}
                                    onClick={() => handleClosingHourChange(hour.localTime)}
                                >
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                checked={selectedClosingHour === hour.localTime}
                                            />
                                        }
                                        label={hour.time}
                                    />
                                </ListItem>
                            ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCloseModal}
                        sx={{ width: '100%' }}
                    >
                        Đóng
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
