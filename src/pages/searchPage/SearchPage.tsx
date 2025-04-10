import { useEffect, useState } from 'react';
import {
    Box,
    Card,
    Divider,
    Grid,
    Stack,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import FilterPanel from '@/components/FilterPanel';
import SearchBarComponent from '@/components/search/SearchBarComponent';
import ShopSearch from '@/components/shop/ShopSearch';
import shopApi from '@/api/shopApi';
import { ParamFilterShop, Shop, ShopSearchResponse } from '@/models';
import { colors } from '@/themes/colors';
import CustomPagination from '@/components/shop/CustomPagination';
import { useLocation } from 'react-router-dom';
import ShopAds from '@/components/detailPost/ShopAds';

interface FilterParams {
    keyword: string;
    categoryId: string[];
    city: string;
    district: string;
    openTimeId: string;
    scoreReview: number;
    latitude?: number;
    longitude?: number;
}

export default function SearchPage() {
    const [shops, setShops] = useState<ShopSearchResponse[]>([]);
    const [totalShops, setTotalShops] = useState<number>(0);
    const [sortOption, setSortOption] = useState<string>('name_asc');
    const location = useLocation();
    const initialKeyword = location.state?.keyword || '';

    const [filterParams, setFilterParams] = useState<FilterParams>(() => {
        const storedLocation = localStorage.getItem('userLocation');
        let lat: number | undefined;
        let lng: number | undefined;
        if (storedLocation) {
            const parsedLocation = JSON.parse(storedLocation);
            lat = parsedLocation.lat;
            lng = parsedLocation.lng;
        }
        return {
            keyword: initialKeyword,
            categoryId: [],
            city: '',
            district: '',
            openTimeId: '',
            scoreReview: 0,
            latitude: lat,
            longitude: lng,
        };
    });
    const [page, setPage] = useState<number>(0);
    const pageSize = 6;

    const fetchDataShop = async () => {
        try {
            const apiParams: ParamFilterShop = {
                keyword: filterParams.keyword !== undefined ? filterParams.keyword : '',
                categoryId:
                    filterParams.categoryId.length > 0 ? filterParams.categoryId : undefined,
                city: filterParams.city || undefined,
                district: filterParams.district || undefined,
                openTimeId: filterParams.openTimeId || undefined,
                scoreReview: filterParams.scoreReview > 0 ? filterParams.scoreReview : undefined,
                page: page,
                size: pageSize,
                latitude: filterParams.latitude || undefined,
                longitude: filterParams.longitude || undefined,
            };
            const response = await shopApi.searchShop(apiParams);
            const shopData = response?.data.data || [];
            const sortedShops = sortShops(shopData, sortOption);
            setShops(sortedShops);
            setTotalShops(response?.data.total || shopData.length);
        } catch (error) {
            console.error('Error fetching shops:', error);
            setShops([]);
            setTotalShops(0);
        }
    };

    const sortShops = (shops: Shop[], sort: string) => {
        const sortedShops = [...shops];
        switch (sort) {
            case 'name_asc':
                return sortedShops.sort((a, b) => a.name.localeCompare(b.name));
            case 'name_desc':
                return sortedShops.sort((a, b) => b.name.localeCompare(a.name));
            case 'reviews_asc':
                return sortedShops.sort((a, b) => (a.countReview || 0) - (b.countReview || 0));
            case 'reviews_desc':
                return sortedShops.sort((a, b) => (b.countReview || 0) - (a.countReview || 0));
            default:
                return sortedShops;
        }
    };

    useEffect(() => {
        fetchDataShop();
    }, [filterParams, sortOption, page]);

    const handleFilterChange = (newFilters: Partial<FilterParams>) => {
        setFilterParams((prev) => ({
            ...prev,
            ...newFilters,
            keyword: prev.keyword !== undefined ? prev.keyword : '',
        }));
        setPage(0);
    };

    const handleSearch = (keyword: string) => {
        setFilterParams((prev) => ({
            ...prev,
            keyword: keyword.trim(),
        }));
        setPage(0);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            <div
                style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F4E0E0 100%)' }}
                className="h-[172px] w-[100%] flex justify-center items-center"
            >
                <SearchBarComponent
                    onSearch={handleSearch}
                    isSearchPage={true}
                    initialKeyword={initialKeyword}
                />
            </div>
            <Box p={1} sx={{ backgroundColor: colors.backgroundColor, minHeight: '100vh' }}>
                <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'stretch' }}>
                    <Grid item xs={12} md={3} lg={2}>
                        <Card
                            sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Bộ lọc tìm kiếm
                            </Typography>
                            <Box sx={{ flexGrow: 1 }}>
                                <FilterPanel onFilterChange={handleFilterChange} />
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={9} lg={7}>
                        <Card
                            sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={1}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Danh sách cửa hàng ({totalShops})
                                </Typography>
                                <FormControl sx={{ minWidth: 120, maxWidth: 150 }}>
                                    <InputLabel>Sắp xếp</InputLabel>
                                    <Select
                                        value={sortOption}
                                        label="Sắp xếp"
                                        onChange={(e) => setSortOption(e.target.value as string)}
                                        size="small"
                                    >
                                        <MenuItem value="name_asc">Tên (A-Z)</MenuItem>
                                        <MenuItem value="name_desc">Tên (Z-A)</MenuItem>
                                        <MenuItem value="reviews_asc">Số review (Tăng)</MenuItem>
                                        <MenuItem value="reviews_desc">Số review (Giảm)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                <ShopSearch shops={shops} />
                            </Box>
                            <Box mt={1} display="flex" justifyContent="center" alignItems="center">
                                <CustomPagination
                                    page={page + 1}
                                    totalPages={Math.ceil(totalShops / pageSize)}
                                    onPageChange={(newPage) => setPage(newPage - 1)}
                                />
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <Stack
                            direction="column"
                            spacing={3}
                            sx={{ width: '100%', height: '100%' }}
                        >
                            <Card
                                sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                            >
                                <ShopAds /> {/* Sử dụng component ShopAds */}
                            </Card>
                            <Divider orientation="horizontal" flexItem />
                            <Card
                                sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                            >
                                <ShopAds type="forme" /> {/* Sử dụng component Sponsored */}
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
