import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface MasterState {
    id: number;
    stateCode: number;
    countryCode: number;
    stateName: string;
    active: boolean;
}

interface MasterStateState {
    states: MasterState[];
    loading: boolean;
    error: string | null;
}

const initialState: MasterStateState = {
    states: [],
    loading: false,
    error: null,
};

// Fetch states, optionally filtering by countryCode
export const fetchStates = createAsyncThunk(
    'masterState/fetchAll',
    async (countryCode: number | undefined, { rejectWithValue }) => {
        try {
            const url = countryCode 
                ? `/master/state?countryCode=${countryCode}` 
                : `/master/state`;
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch states');
        }
    }
);

const masterStateSlice = createSlice({
    name: 'masterState',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStates.fulfilled, (state, action) => {
                state.loading = false;
                state.states = action.payload;
            })
            .addCase(fetchStates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default masterStateSlice.reducer;
