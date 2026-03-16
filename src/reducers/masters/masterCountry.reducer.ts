import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface MasterCountry {
    id: number;
    countryCode: number;
    countryName: string;
    active: boolean;
}

interface MasterCountryState {
    countries: MasterCountry[];
    loading: boolean;
    error: string | null;
}

const initialState: MasterCountryState = {
    countries: [],
    loading: false,
    error: null,
};

export const fetchCountries = createAsyncThunk(
    'masterCountry/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/master/country');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch countries');
        }
    }
);

const masterCountrySlice = createSlice({
    name: 'masterCountry',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCountries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = action.payload;
            })
            .addCase(fetchCountries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default masterCountrySlice.reducer;
