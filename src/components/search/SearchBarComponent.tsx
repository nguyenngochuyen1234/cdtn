import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Divider,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import GoogleLocation from '../location/GoogleLocation';

interface SearchBarProps {
    onSearch: (keyword: string, location?: { latitude: number; longitude: number }) => void;
    isSearchPage?: boolean;
    initialKeyword?: string;
    initialLocation?: { latitude: number; longitude: number };
}

const SearchBarComponent: React.FC<SearchBarProps> = ({
    onSearch,
    isSearchPage,
    initialKeyword = '',
    initialLocation,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [keyword, setKeyword] = useState<string>(initialKeyword);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | undefined>(
        initialLocation
    );
    const navigate = useNavigate();

    // Update keyword when initialKeyword changes
    useEffect(() => {
        setKeyword(initialKeyword);
    }, [initialKeyword]);

    // Update location when initialLocation changes
    useEffect(() => {
        setLocation(initialLocation);
    }, [initialLocation]);

    const handleLocationChange = (newLocation: { lat: number; lng: number }) => {
        setLocation({
            latitude: newLocation.lat,
            longitude: newLocation.lng,
        });
    };

    const handleSearch = () => {
        const trimmedKeyword = keyword.trim();
        if (!isSearchPage) {
            // From HomePage: navigate to SearchPage and pass keyword and location
            navigate('/search', { state: { keyword: trimmedKeyword, location } });
        } else {
            // In SearchPage: call onSearch with keyword and location
            onSearch(trimmedKeyword, location);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1} width="100%">
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 700 }}>
                Bạn đang tìm kiếm gì?
            </Typography>
            <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                    backgroundColor: '#fff',
                    padding: '0 14px',
                    borderRadius: 2,
                    border: '1px solid #ccc',
                    width: '100%',
                    maxWidth: '800px',
                }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm cửa hàng..."
                    fullWidth
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { border: 'none' },
                            '&:hover fieldset': { border: 'none' },
                            '&.Mui-focused fieldset': { border: 'none' },
                        },
                    }}
                />
                {!isMobile && (
                    <GoogleLocation
                        onLocationChange={handleLocationChange}
                        selectedLocation={location}
                    />
                )}
                <Divider orientation="vertical" flexItem />
                <Button color="primary" variant="contained" onClick={handleSearch}>
                    <SearchIcon sx={{ color: '#fff' }} />
                </Button>
            </Box>
        </Box>
    );
};

export default SearchBarComponent;