import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface MasterPC {
    id: number;
    pcCode: number;
    parliamentName: string;
    stateCode: number;
    reservationCategory: string;
    active: boolean;
}

interface MasterPCState {
    pcs: MasterPC[];
    loading: boolean;
    error: string | null;
}

const initialState: MasterPCState = {
    pcs: [],
    loading: false,
    error: null,
};

// Fetch PCs, optionally filtered by stateCode
export const fetchPCs = createAsyncThunk(
    'masterPC/fetchAll',
    async (stateCode: number | undefined, { rejectWithValue }) => {
        try {
            const url = stateCode 
                ? `/master/pc?stateCode=${stateCode}` 
                : `/master/pc`;
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch PCs');
        }
    }
);

const masterPCSlice = createSlice({
    name: 'masterPC',
    initialState,
    reducers: {
        clearPCs: (state) => {
            state.pcs = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPCs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPCs.fulfilled, (state, action) => {
                state.loading = false;
                state.pcs = action.payload;
            })
            .addCase(fetchPCs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearPCs } = masterPCSlice.actions;
export default masterPCSlice.reducer;
