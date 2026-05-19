import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface VoterRegistrationStats {
    total: number;
    male: number;
    female: number;
    other: number;
    stateCode?: number;
    pcCode?: number;
    acCode?: number;
}

export interface VoterRegistrationStatsQuery {
    stateCode?: number;
    pcCode?: number;
    acCode?: number;
}

interface VoterRegistrationState {
    loading: boolean;
    success: boolean;
    error: string | null;
    stats: VoterRegistrationStats | null;
}

const initialState: VoterRegistrationState = {
    loading: false,
    success: false,
    error: null,
    stats: null,
};

// POST /voter-registration
export const submitVoterRegistration = createAsyncThunk(
    'voterRegistration/submit',
    async (formData: any, { rejectWithValue }) => {
        try {
            const response = await axios.post('/voter-registration', formData);
            return response.data;
        } catch (error: any) {
            let errorMsg = error.response?.data?.message || 'An unknown server error occurred';
            if (Array.isArray(errorMsg)) errorMsg = errorMsg[0];
            return rejectWithValue(errorMsg);
        }
    }
);

// GET /voter-registration/stats  (optional ?stateCode=&pcCode=&acCode=)
export const fetchVoterStats = createAsyncThunk(
    'voterRegistration/fetchStats',
    async (query: VoterRegistrationStatsQuery = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get('/voter-registration/stats', { params: query });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch voter stats');
        }
    }
);

const voterRegisterSlice = createSlice({
    name: 'voterRegistration',
    initialState,
    reducers: {
        resetVoterRegistrationState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
        clearVoterError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitVoterRegistration.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(submitVoterRegistration.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(submitVoterRegistration.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            })

            .addCase(fetchVoterStats.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchVoterStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
            .addCase(fetchVoterStats.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { resetVoterRegistrationState, clearVoterError } = voterRegisterSlice.actions;
export default voterRegisterSlice.reducer;
