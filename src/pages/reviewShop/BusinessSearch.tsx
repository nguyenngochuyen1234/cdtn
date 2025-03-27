'use client';

import shopApi from '@/api/shopApi';
import usersCategory from '@/api/usersCategory';
import { Badge } from '@/components/ui/badge';
import { Shop } from '@/models';
import SearchIcon from '@mui/icons-material/Search';
import {
    Autocomplete,
    Box,
    Card,
    Container,
    Grid,
    IconButton,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Image } from 'antd';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../createShop/MapComponent';
function BusinessSearch() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [filteredTags, setFilteredTags] = useState<string[]>([]);
    const [suggestedLocations, setSuggestedLocations] = useState<string[]>([]);
    const [shops, setShops] = useState<Shop[] | null>(null);
    const theme = useTheme();

    const fetchCategory = async () => {
        try {
            const response = await usersCategory.getAllCategories();
            if (response.data.data) {
                const allTags = response.data.data.flatMap((category: any) => category.tags);
                setTags(allTags);
            }
        } catch (err) {
            console.error('Error fetching categories', err);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const fetchDataShop = async (keyword: string) => {
        try {
            const response = await shopApi.searchShop({ keyword: keyword, page: 0, size: 12 });
            setShops(response?.data.data);
            console.log(response?.data);
        } catch {}
    };
    useEffect(() => {
        if (searchTerm) {
            const results = tags.filter((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTags(results);
        } else {
            setFilteredTags([]);
        }
    }, [searchTerm, tags]);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`h-4 w-4 ${i <= rating ? 'fill-primary text-primary' : 'fill-muted text-muted'}`}
                />
            );
        }
        return stars;
    };
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
                <Grid item xs={12} lg={6}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'center' }}>
                        <Autocomplete
                            freeSolo
                            options={filteredTags}
                            onChange={(event, newValue) => {
                                console.log(event);
                                setSearchTerm(newValue || '');
                                if (newValue) {
                                    fetchDataShop(newValue);
                                }
                            }}
                            sx={{ flex: 2 }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    placeholder="Try lunch, yoga studio, plumber"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    size="medium"
                                />
                            )}
                        />

                        <Autocomplete
                            freeSolo
                            options={suggestedLocations}
                            sx={{ flex: 2 }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    placeholder="Enter location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    size="medium"
                                />
                            )}
                        />
                        <IconButton
                            sx={{
                                bgcolor: 'error.main',
                                color: '#fff',
                                '&:hover': {
                                    bgcolor: 'error.dark',
                                },
                                height: 40,
                                width: 40,
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Box>
                    {(shops || [])?.map((shop, index) => (
                        <Card
                            key={shop.id}
                            className="p-4"
                            onClick={() => navigate(`biz/${shop.id}`)}
                        >
                            <div className="flex gap-4 overflow-hidden">
                                <div className="relative w-48 h-48 flex-shrink-0">
                                    <Image src={shop.avatar as string} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl mb-0 font-semibold">
                                        {index + 1}. {shop.name}
                                    </h2>
                                    <div className="flex items-center gap-1 my-2">
                                        {renderStars(shop.point || 0)}
                                    </div>
                                    <div className="flex flex-wrap gap-2 my-3">
                                        {shop.categoryResponse.tags.map((tag) => (
                                            <Badge variant="secondary" key={tag}>
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </Grid>

                <Grid item xs={12} lg={6} height={'100vh'}>
                    <MapComponent />
                </Grid>
            </Grid>
        </Container>
    );
}

export default BusinessSearch;
