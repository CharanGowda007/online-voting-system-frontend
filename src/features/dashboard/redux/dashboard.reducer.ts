import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface GenderStat {
    gender: string;
    count: number;
}

interface DashboardState {
    total: number;
    byGender: GenderStat[];
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    total: 0,
    byGender: [],
    loading: false,
    error: null,
};

export const fetchVoterStats = createAsyncThunk(
    'dashboard/fetchVoterStats',
    async (filters: { stateCode?: number; pcCode?: number; acCode?: number } | undefined, { rejectWithValue }) => {
        try {
            const params: Record<string, string> = {};
            if (filters?.stateCode) params.stateCode = String(filters.stateCode);
            if (filters?.pcCode) params.pcCode = String(filters.pcCode);
            if (filters?.acCode) params.acCode = String(filters.acCode);
            const response = await axios.get('/voter-registration/stats', { params });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch voter stats');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVoterStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVoterStats.fulfilled, (state, action) => {
                state.loading = false;
                state.total = action.payload.total;
                state.byGender = action.payload.byGender;
            })
            .addCase(fetchVoterStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default dashboardSlice.reducer;
