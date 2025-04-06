// LocationPicker.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    Typography,
    Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';

interface Location {
    name: string;
    lat: number;
    lng: number;
}

// Danh sách địa điểm tĩnh (có thể thay bằng API khác nếu cần)
const staticLocations = [
    { id: '1', name: 'Hồ Chí Minh, Việt Nam', lat: 10.7769, lng: 106.7009 },
    { id: '2', name: 'Hà Nội, Việt Nam', lat: 21.0285, lng: 105.8542 },
    { id: '3', name: 'Đà Nẵng, Việt Nam', lat: 16.0544, lng: 108.2022 },
    { id: '4', name: 'Cần Thơ, Việt Nam', lat: 10.0452, lng: 105.7469 },
    { id: '5', name: 'Nha Trang, Việt Nam', lat: 12.2388, lng: 109.1967 },
];

const LocationPicker: React.FC = () => {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [locationAnchorEl, setLocationAnchorEl] = useState<null | HTMLElement>(null);
    const [locations, setLocations] = useState<Location[]>(staticLocations);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Lấy vị trí từ localStorage khi component mount
    useEffect(() => {
        const storedLocation = localStorage.getItem('userLocation');
        if (storedLocation) {
            setSelectedLocation(JSON.parse(storedLocation));
        }
    }, []);

    // Lọc địa điểm dựa trên query tìm kiếm
    useEffect(() => {
        if (searchQuery) {
            const filtered = staticLocations.filter((location) =>
                location.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setLocations(filtered);
        } else {
            setLocations(staticLocations);
        }
    }, [searchQuery]);

    // Xử lý mở/đóng dropdown
    const handleLocationClick = (event: React.MouseEvent<HTMLElement>) => {
        setLocationAnchorEl(event.currentTarget);
    };

    const handleLocationClose = () => {
        setLocationAnchorEl(null);
        setSearchQuery(''); // Reset query khi đóng
    };

    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location);
        handleLocationClose();
    };

    // Xử lý lấy vị trí hiện tại
    const handleCurrentLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const location: Location = {
                        name: 'Vị trí hiện tại',
                        lat: latitude,
                        lng: longitude,
                    };
                    setSelectedLocation(location);
                    localStorage.setItem('userLocation', JSON.stringify(location));
                    setLoading(false);
                    handleLocationClose();
                },
                (error) => {
                    setLoading(false);
                    console.error('Error getting location:', error);
                    alert('Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí.');
                }
            );
        } else {
            setLoading(false);
            alert('Trình duyệt của bạn không hỗ trợ Geolocation.');
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 300 }}>
            <Button
                variant="outlined"
                startIcon={<LocationOnIcon />}
                onClick={handleLocationClick}
                sx={{
                    width: '100%',
                    border: '1px solid',
                    borderColor: 'grey.300',
                    textTransform: 'none',
                    color: 'text.primary',
                    bgcolor: 'white',
                    '&:hover': { borderColor: 'grey.500', bgcolor: 'grey.50' },
                    justifyContent: 'flex-start',
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        textAlign: 'left',
                    }}
                >
                    {selectedLocation ? selectedLocation.name : 'Chọn địa điểm'}
                </Typography>
            </Button>

            {/* Dropdown địa điểm */}
            <Menu
                anchorEl={locationAnchorEl}
                open={Boolean(locationAnchorEl)}
                onClose={handleLocationClose}
                PaperProps={{
                    sx: {
                        maxHeight: '400px',
                        width: '300px',
                        mt: 1,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    },
                }}
            >
                {/* Ô tìm kiếm địa điểm */}
                <Box sx={{ p: 1 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Tìm kiếm địa điểm..."
                        fullWidth
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'grey.300',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'grey.500',
                                },
                            },
                        }}
                    />
                </Box>

                {/* Nút "Vị trí hiện tại" */}
                <MenuItem onClick={handleCurrentLocation} disabled={loading}>
                    <ListItemIcon>
                        {loading ? (
                            <CircularProgress size={20} />
                        ) : (
                            <MyLocationIcon fontSize="small" color="primary" />
                        )}
                    </ListItemIcon>
                    <ListItemText primary="Vị trí hiện tại" />
                </MenuItem>
                <Divider />

                {/* Danh sách địa điểm */}
                {locations.length > 0 ? (
                    locations.map((location) => (
                        <MenuItem key={location.id} onClick={() => handleLocationSelect(location)}>
                            <ListItemText primary={location.name} />
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>
                        <ListItemText primary="Không tìm thấy địa điểm" />
                    </MenuItem>
                )}
            </Menu>
        </Box>
    );
};

export default LocationPicker;
