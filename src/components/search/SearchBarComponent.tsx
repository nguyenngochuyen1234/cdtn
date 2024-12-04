import React from 'react';
import { Box, TextField, Button, IconButton, Divider, Select, MenuItem, Stack, makeStyles } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { colors } from '@/themes/colors';


const SearchBarComponent: React.FC = () => {
    return (
        <Stack flexDirection="row" height={50} gap={2} alignItems="center" >
            <Box display="flex" alignItems="center" gap={1} sx={{ backgroundColor: "#fff", paddingRight: "14px" }} borderRadius={2}>
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm   ..."
                    sx={{
                        flex: 1, "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                border: "none",
                            },
                        },
                        width: 500
                    }}
                />
                <Button
                    variant="outlined"
                    startIcon={<LocationOnIcon />}
                    sx={{ minWidth: '120px', border: "none", textTransform: 'none', color: colors.textColor }}
                >
                    Chọn địa điểm
                </Button>

                <Divider orientation="vertical" flexItem />

                <Select
                    defaultValue=""
                    displayEmpty
                    variant="outlined"
                    sx={{
                        minWidth: '150px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        }
                    }}
                    renderValue={(selected) => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FormatListBulletedIcon style={{ marginRight: 8 }} />
                            {selected || "Lựa chọn danh mục"}
                        </div>
                    )}
                >
                    <MenuItem value="">
                        <p>Lựa chọn danh mục</p>
                    </MenuItem>
                    <MenuItem value="category1">Danh mục 1</MenuItem>
                    <MenuItem value="category2">Danh mục 2</MenuItem>
                </Select>

                <Button color="primary" variant="contained">
                    <SearchIcon sx={{ color: "#fff" }} />
                </Button>

            </Box>
            <Button
                sx={{ height: "36px" }}
                variant="contained"
                startIcon={<FilterListIcon sx={{ color: "#fff" }} />}
                color="primary"
            >
                Lọc nâng cao
            </Button>

        </Stack>
    );
}

export default SearchBarComponent;
