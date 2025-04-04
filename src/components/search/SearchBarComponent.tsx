import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    IconButton,
    Divider,
    Select,
    MenuItem,
    Stack,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { colors } from '@/themes/colors';
import LocationPicker from '../location/LocationPicker';
import GoogleLocation from '../location/GoogleLocation';
import { Link, useNavigate } from 'react-router-dom';
interface SearchBarProps {
    onSearch: (keyword: string) => void;
    isSearchPage?: boolean; // New prop to distinguish usage context
    initialKeyword?: string;
}
const SearchBarComponent: React.FC<SearchBarProps> = ({ onSearch, isSearchPage, initialKeyword = ''}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [keyword, setKeyword] = useState<string>(initialKeyword);
    const navigate = useNavigate();
        // Cập nhật keyword khi initialKeyword thay đổi (dành cho SearchPage)
    useEffect(() => {
        setKeyword(initialKeyword);
    }, [initialKeyword]);
    const handleSearch = () => {
        if (keyword.trim()) {
            if (!isSearchPage) {
                // Từ trang chủ: chuyển hướng đến search page và truyền state
                navigate('/search', { state: { keyword: keyword.trim() } });
                setKeyword('');
            } else {
                // Trong search page: gọi onSearch để tìm kiếm
                onSearch(keyword.trim());
            }
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
                {!isMobile && <GoogleLocation />}
                <Divider orientation="vertical" flexItem />
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSearch}
                >
                    <SearchIcon sx={{ color: '#fff' }} />
                </Button>
            </Box>
        </Box>
    );
};

export default SearchBarComponent;
