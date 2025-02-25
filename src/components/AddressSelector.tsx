import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Grid } from '@mui/material';

interface AddressSelectorProps {
    provinces: any[];
    districts: any[];
    wards: any[];
    selectedProvince: string;
    selectedDistrict: string;
    selectedWard: string;
    onProvinceChange: (provinceCode: string) => void;
    onDistrictChange: (districtCode: string) => void;
    onWardChange: (wardCode: string) => void;
    disable: boolean;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
    disable,
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    onProvinceChange,
    onDistrictChange,
    onWardChange,
}) => {
    const handleProvinceChange = (event: SelectChangeEvent<string>) => {
        onProvinceChange(event.target.value);
    };

    const handleDistrictChange = (event: SelectChangeEvent<string>) => {
        onDistrictChange(event.target.value);
    };

    const handleWardChange = (event: SelectChangeEvent<string>) => {
        onWardChange(event.target.value);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <FormControl fullWidth>
                    <InputLabel>Tỉnh/Thành phố</InputLabel>
                    <Select
                        disabled={disable}
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                    >
                        {provinces.map((province) => (
                            <MenuItem key={province.code} value={province.code}>
                                {province.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={4}>
                <FormControl fullWidth disabled={!selectedProvince}>
                    <InputLabel>Quận/Huyện</InputLabel>
                    <Select
                        disabled={disable}
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                    >
                        {districts.map((district) => (
                            <MenuItem key={district.code} value={district.code}>
                                {district.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={4}>
                <FormControl fullWidth disabled={!selectedDistrict}>
                    <InputLabel>Xã/Phường</InputLabel>
                    <Select disabled={disable} value={selectedWard} onChange={handleWardChange}>
                        {wards.map((ward) => (
                            <MenuItem key={ward.code} value={ward.code}>
                                {ward.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default AddressSelector;
