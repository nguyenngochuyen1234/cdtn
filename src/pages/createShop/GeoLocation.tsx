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
    Modal,
    Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
});

interface Location {
    name: string;
    lat: number;
    lng: number;
}

interface GoogleLocationProps {
    onLocationSelect?: (location: Location | null) => void;
}

const fetchLocationsFromNominatim = async (query: string) => {
    if (!query) return [];
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                query
            )}&format=json&addressdetails=1&limit=5`
        );
        const data = await response.json();
        return data.map((item: any) => ({
            name: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
        }));
    } catch (error) {
        console.error('Error fetching locations from Nominatim:', error);
        return [];
    }
};

const MapUpdater: React.FC<{ position: [number, number] }> = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, 13);
    }, [position, map]);
    return null;
};

const GoogleLocationCreate: React.FC<GoogleLocationProps> = ({ onLocationSelect }) => {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [locationAnchorEl, setLocationAnchorEl] = useState<null | HTMLElement>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mapModalOpen, setMapModalOpen] = useState(false);
    const [mapPosition, setMapPosition] = useState<[number, number]>([10.7769, 106.7009]);

    useEffect(() => {
        const storedLocation = localStorage.getItem('userLocation');
        if (storedLocation) {
            const location = JSON.parse(storedLocation);
            setSelectedLocation(location);
            setMapPosition([location.lat, location.lng]);
            onLocationSelect?.(location);
        }
    }, [onLocationSelect]);

    useEffect(() => {
        const loadLocations = async () => {
            setLoading(true);
            const fetchedLocations = await fetchLocationsFromNominatim(searchQuery);
            setLocations(fetchedLocations);
            setLoading(false);
        };
        if (searchQuery) {
            loadLocations();
        } else {
            setLocations([]);
        }
    }, [searchQuery]);

    const handleLocationClick = (event: React.MouseEvent<HTMLElement>) => {
        setLocationAnchorEl(event.currentTarget);
    };

    const handleLocationClose = () => {
        setLocationAnchorEl(null);
        setSearchQuery('');
    };

    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location);
        setMapPosition([location.lat, location.lng]);
        onLocationSelect?.(location);
        localStorage.setItem('userLocation', JSON.stringify(location));
        handleLocationClose();
    };

    const handleCurrentLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const data = await response.json();
                        const location: Location = {
                            name: data.display_name || 'Vị trí hiện tại',
                            lat: latitude,
                            lng: longitude,
                        };
                        setSelectedLocation(location);
                        setMapPosition([latitude, longitude]);
                        onLocationSelect?.(location);
                        localStorage.setItem('userLocation', JSON.stringify(location));
                    } catch (error) {
                        console.error('Error reverse geocoding:', error);
                        const location: Location = {
                            name: 'Vị trí hiện tại',
                            lat: latitude,
                            lng: longitude,
                        };
                        setSelectedLocation(location);
                        setMapPosition([latitude, longitude]);
                        onLocationSelect?.(location);
                        localStorage.setItem('userLocation', JSON.stringify(location));
                    }
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

    const handleMapModalOpen = () => {
        setMapModalOpen(true);
    };

    const handleMapModalClose = () => {
        setMapModalOpen(false);
    };

    const handleMapSelect = async (lat: number, lng: number) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await response.json();
            const location: Location = {
                name: data.display_name || 'Vị trí đã chọn',
                lat,
                lng,
            };
            setSelectedLocation(location);
            setMapPosition([lat, lng]);
            onLocationSelect?.(location);
            localStorage.setItem('userLocation', JSON.stringify(location));
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            const location: Location = {
                name: 'Vị trí đã chọn',
                lat,
                lng,
            };
            setSelectedLocation(location);
            setMapPosition([lat, lng]);
            onLocationSelect?.(location);
            localStorage.setItem('userLocation', JSON.stringify(location));
        }
        setLoading(false);
        handleMapModalClose();
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Button
                variant="outlined"
                startIcon={<LocationOnIcon />}
                onClick={handleLocationClick}
                sx={{
                    width: '100%',
                    borderColor: 'grey.300',
                    textTransform: 'none',
                    color: 'text.primary',
                    bgcolor: 'background.paper',
                    '&:hover': { borderColor: 'grey.500', bgcolor: 'grey.50' },
                    justifyContent: 'flex-start',
                    py: 1,
                    borderRadius: 1,
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        textAlign: 'left',
                    }}
                >
                    {selectedLocation ? selectedLocation.name : 'Chọn địa chỉ cửa hàng'}
                </Typography>
            </Button>
            <Menu
                anchorEl={locationAnchorEl}
                open={Boolean(locationAnchorEl)}
                onClose={handleLocationClose}
                PaperProps={{
                    sx: {
                        maxHeight: '400px',
                        width: '100%',
                        maxWidth: 400,
                        mt: 1,
                        boxShadow: 3,
                        borderRadius: 2,
                    },
                }}
            >
                <Box sx={{ p: 1 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Tìm kiếm địa chỉ..."
                        fullWidth
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                            },
                        }}
                    />
                </Box>
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
                <MenuItem onClick={handleMapModalOpen}>
                    <ListItemIcon>
                        <LocationOnIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Chọn trên bản đồ" />
                </MenuItem>
                <Divider />
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : locations.length > 0 ? (
                    locations.map((location, index) => (
                        <MenuItem key={index} onClick={() => handleLocationSelect(location)}>
                            <ListItemText primary={location.name} />
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>
                        <ListItemText primary="Không tìm thấy địa điểm" />
                    </MenuItem>
                )}
            </Menu>
            <Modal
                open={mapModalOpen}
                onClose={handleMapModalClose}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 2,
                        width: '90%',
                        maxWidth: 600,
                        height: '70vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Chọn vị trí trên bản đồ
                    </Typography>
                    <Box sx={{ flex: 1, position: 'relative' }}>
                        <MapContainer
                            center={mapPosition}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MapUpdater position={mapPosition} />
                            <Marker
                                position={mapPosition}
                                icon={markerIcon}
                                draggable
                                eventHandlers={{
                                    dragend: (event) => {
                                        const marker = event.target;
                                        const position = marker.getLatLng();
                                        handleMapSelect(position.lat, position.lng);
                                    },
                                }}
                            />
                        </MapContainer>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleMapModalClose}
                        sx={{ mt: 2 }}
                    >
                        Đóng
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default GoogleLocationCreate;