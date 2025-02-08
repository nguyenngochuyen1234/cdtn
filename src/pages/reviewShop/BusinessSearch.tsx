'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Paper,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Grid,
    useTheme,
    useMediaQuery,
    ListItemButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import BuildIcon from '@mui/icons-material/Build';
import MapComponent from '../createShop/MapComponent';

function BusinessSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('San Francisco, CA');
    const [hasResults] = useState(false);

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Find a business to review
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Review anything from your favorite patio spot to your local flower shop.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Main Content */}
                <Grid item xs={12} lg={6}>
                    {/* Search Bar */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Try lunch, yoga studio, plumber"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                        />
                        <TextField
                            fullWidth
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            size="small"
                        />
                        <IconButton
                            sx={{
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'error.dark',
                                },
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Box>

                    {/* No Results State */}
                    {!hasResults && (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    bgcolor: 'error.light',
                                    p: 2,
                                    borderRadius: '50%',
                                    mb: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: 'error.main',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transform: 'rotate(12deg)',
                                    }}
                                >
                                    <Typography variant="h5" sx={{ color: 'white' }}>
                                        ✊
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                No suggestions yet
                            </Typography>
                            <Typography color="text.secondary">
                                We&apos;re out of suggestions for you right now. Keep on using Yelp
                                and we&apos;ll have some more for you soon.
                            </Typography>
                        </Box>
                    )}
                </Grid>

                {/* Illustration */}
                {isDesktop && (
                    <Grid item lg={3}>
                        <MapComponent />
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}
export default BusinessSearch;
