import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface MasterAC {
    id: number;
    assemblyCode: number;
    assemblyName: string;
    parliamentCode: number;
    reservationCategory: string;
    active: boolean;
}

interface MasterACState {
    acs: MasterAC[];
    loading: boolean;
    error: string | null;
}

const initialState: MasterACState = {
    acs: [],
    loading: false,
    error: null,
};

// Fetch ACs, optionally filtered by parliamentCode
export const fetchACs = createAsyncThunk(
    'masterAC/fetchAll',
    async (parliamentCode: number | undefined, { rejectWithValue }) => {
        try {
            const url = parliamentCode 
                ? `/master/ac?parliamentCode=${parliamentCode}` 
                : `/master/ac`;
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch ACs');
        }
    }
);

const masterACSlice = createSlice({
    name: 'masterAC',
    initialState,
    reducers: {
        clearACs: (state) => {
            state.acs = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchACs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchACs.fulfilled, (state, action) => {
                state.loading = false;
                state.acs = action.payload;
            })
            .addCase(fetchACs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearACs } = masterACSlice.actions;
export default masterACSlice.reducer;
