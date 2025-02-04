import { StoreCreation } from '@/models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreateShopState {
    newShop: StoreCreation | null;
}

const initialState: CreateShopState = {
    newShop: null,
};

const createShopSlice = createSlice({
    name: 'newShop',
    initialState,
    reducers: {
        setNewShop: (state, action: PayloadAction<StoreCreation>) => {
            state.newShop = action.payload;
        },
        clearNewShop: (state) => {
            state.newShop = null;
        },
        updateNewShop: (state, action: PayloadAction<Partial<StoreCreation>>) => {
            if (state.newShop) {
                state.newShop = { ...state.newShop, ...action.payload };
            }
        },
    },
});

export const { setNewShop, clearNewShop, updateNewShop } = createShopSlice.actions;
export default createShopSlice.reducer;
