import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import createShopSlice from './createShop';

export const store = configureStore({
    reducer: {
        user: userSlice,
        newShop: createShopSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
