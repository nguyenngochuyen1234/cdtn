import { useEffect, useState, useMemo } from 'react';
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
import { toast } from 'react-toastify';

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
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sortOption, setSortOption] = useState<string>('name_asc');
    const [isLoading, setIsLoading] = useState(false);
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

    // Memoize filterParamsString to prevent unnecessary recalculations
    const filterParamsString = useMemo(() => JSON.stringify(filterParams), [filterParams]);

    const fetchDataShop = async () => {
        setIsLoading(true);
        try {
            const apiParams: ParamFilterShop = {
                keyword: filterParams.keyword || '',
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
            console.log('Fetching shops with params:', apiParams);
            const response = await shopApi.searchShop(apiParams);
            console.log('API Response:', response?.data);
            const shopData = response?.data.data || [];
            const sortedShops = sortShops(shopData, sortOption);
            const newTotalShops = response?.data.meta.total || shopData.length;

            setShops(sortedShops);
            // Only update totalShops and totalPages when filters change, not on page change
            setTotalShops(newTotalShops);
            setTotalPages(response.data.meta.totalPage);
        } catch (error: any) {
            console.error(
                'Error fetching shops:',
                error.message,
                error.response?.data,
                error.config
            );
            toast.error('Không thể tải danh sách cửa hàng. Vui lòng thử lại.');
            setShops([]);
            setTotalShops(0);
            setTotalPages(1);
            setPage(0);
        } finally {
            setIsLoading(false);
        }
    };

    const sortShops = (shops: Shop[], sort: string) => {
        const sortedShops = [...shops];
        switch (sort) {
            case 'name_asc':
                return sortedShops.sort((a, b) => a.name.localeCompare(b.name));
            case 'name_desc':
                return sortedShops.sort((a, b) => b.name.localeCompare(b.name));
            case 'reviews_asc':
                return sortedShops.sort((a, b) => (a.countReview || 0) - (b.countReview || 0));
            case 'reviews_desc':
                return sortedShops.sort((a, b) => (b.countReview || 0) - (a.countReview || 0));
            default:
                return sortedShops;
        }
    };

    useEffect(() => {
        // Reset page to 0 and fetch data when filters or sort option change
        setPage(0); // Reset to page 1 when filters/sort change
        fetchDataShop();
    }, [filterParamsString, sortOption]);

    useEffect(() => {
        // Fetch data when page changes, but don't reset page
        fetchDataShop();
    }, [page]);

    const handleFilterChange = (newFilters: Partial<FilterParams>) => {
        setFilterParams((prev) => ({
            ...prev,
            ...newFilters,
            keyword: prev.keyword || '',
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
        // Đảm bảo không có logic nào từ nơi khác đang reset page về 0
        const newPageIndex = newPage - 1; // Chuyển từ 1-based sang 0-based
        console.log(
            'Changing to page:',
            newPage,
            'index:',
            newPageIndex,
            'totalPages:',
            totalPages
        );

        if (newPageIndex >= 0 && newPageIndex < totalPages) {
            setPage(newPageIndex);
        } else if (newPageIndex >= totalPages && totalPages > 0) {
            setPage(totalPages - 1);
        }
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
                                {isLoading ? (
                                    <Typography>Đang tải...</Typography>
                                ) : shops.length === 0 ? (
                                    <Typography>Không tìm thấy cửa hàng nào.</Typography>
                                ) : (
                                    <ShopSearch shops={shops} />
                                )}
                            </Box>
                            <Box mt={1} display="flex" justifyContent="center" alignItems="center">
                                <CustomPagination
                                    page={page + 1}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
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
                                <ShopAds />
                            </Card>
                            <Divider orientation="horizontal" flexItem />
                            <Card
                                sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                            >
                                <ShopAds type="forme" />
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
