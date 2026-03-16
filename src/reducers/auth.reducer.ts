import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // defined basic auth reducer placeholders to fulfill index.ts 
    },
});

export default authSlice.reducer;
