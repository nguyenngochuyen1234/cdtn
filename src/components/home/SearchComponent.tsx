import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Stack } from '@mui/material';

const SearchComponent = () => {
    const [touristPlace, setTouristPlace] = useState('Phong nha kẻ bàng');
    const [cuisine, setCuisine] = useState('Bún chả');
    const [hairSalon, setHairSalon] = useState('Quán 30 shain');
    const [laundryShop, setLaundryShop] = useState('Giặt là có ngay');

    return (
        <Stack direction="row" spacing={2} marginY={3}>
            <FormControl fullWidth>
                <InputLabel>Địa điểm du lịch</InputLabel>
                <Select
                    value={touristPlace}
                    label="Địa điểm du lịch"
                    onChange={(e) => setTouristPlace(e.target.value)}
                >
                    <MenuItem value="Phong nha kẻ bàng">Phong nha kẻ bàng</MenuItem>
                    <MenuItem value="Vịnh Hạ Long">Vịnh Hạ Long</MenuItem>
                    <MenuItem value="Sapa">Sapa</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel>Ẩm thực</InputLabel>
                <Select
                    value={cuisine}
                    label="Ẩm thực"
                    onChange={(e) => setCuisine(e.target.value)}
                >
                    <MenuItem value="Bún chả">Bún chả</MenuItem>
                    <MenuItem value="Phở">Phở</MenuItem>
                    <MenuItem value="Bánh mì">Bánh mì</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel>Quán cắt tóc</InputLabel>
                <Select
                    value={hairSalon}
                    label="Quán cắt tóc"
                    onChange={(e) => setHairSalon(e.target.value)}
                >
                    <MenuItem value="Quán 30 shain">Quán 30 shain</MenuItem>
                    <MenuItem value="Barber House">Barber House</MenuItem>
                    <MenuItem value="Hair Station">Hair Station</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel>Tiệm giặt ủi</InputLabel>
                <Select
                    value={laundryShop}
                    label="Tiệm giặt ủi"
                    onChange={(e) => setLaundryShop(e.target.value)}
                >
                    <MenuItem value="Giặt là có ngay">Giặt là có ngay</MenuItem>
                    <MenuItem value="Laundry Pro">Laundry Pro</MenuItem>
                    <MenuItem value="Quick Wash">Quick Wash</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
};

export default SearchComponent;
