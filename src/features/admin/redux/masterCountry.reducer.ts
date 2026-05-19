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
    selectedCountry: MasterCountry | null;
    loading: boolean;
    error: string | null;
}

const initialState: MasterCountryState = {
    countries: [],
    selectedCountry: null,
    loading: false,
    error: null,
};

// GET /master/country
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

// GET /master/country/:id
export const fetchCountryById = createAsyncThunk(
    'masterCountry/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/master/country/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch country');
        }
    }
);

// POST /master/country
export const createCountry = createAsyncThunk(
    'masterCountry/create',
    async (dto: Partial<MasterCountry>, { rejectWithValue }) => {
        try {
            const response = await axios.post('/master/country', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create country');
        }
    }
);

// PUT /master/country/:id
export const updateCountry = createAsyncThunk(
    'masterCountry/update',
    async ({ id, dto }: { id: number; dto: Partial<MasterCountry> }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/master/country/${id}`, dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update country');
        }
    }
);

// DELETE /master/country/:id
export const deleteCountry = createAsyncThunk(
    'masterCountry/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await axios.delete(`/master/country/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete country');
        }
    }
);

const masterCountrySlice = createSlice({
    name: 'masterCountry',
    initialState,
    reducers: {
        clearSelectedCountry: (state) => {
            state.selectedCountry = null;
        },
        clearCountryError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchCountries
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
            })
            // fetchCountryById
            .addCase(fetchCountryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountryById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCountry = action.payload;
            })
            .addCase(fetchCountryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // createCountry
            .addCase(createCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCountry.fulfilled, (state, action) => {
                state.loading = false;
                state.countries.push(action.payload);
            })
            .addCase(createCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // updateCountry
            .addCase(updateCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCountry.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.countries.findIndex(c => c.id === action.payload.id);
                if (idx !== -1) state.countries[idx] = action.payload;
            })
            .addCase(updateCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // deleteCountry
            .addCase(deleteCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCountry.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = state.countries.filter(c => c.id !== action.payload);
            })
            .addCase(deleteCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedCountry, clearCountryError } = masterCountrySlice.actions;
export default masterCountrySlice.reducer;
