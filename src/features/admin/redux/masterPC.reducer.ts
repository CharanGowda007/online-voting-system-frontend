import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface MasterPC {
    id: number;
    parliamentCode: number;
    parliamentName: string;
    stateCode: number;
    reservationCategory: string;
    active: boolean;
}

interface MasterPCState {
    pcs: MasterPC[];
    selectedPC: MasterPC | null;
    loading: boolean;
    error: string | null;
}

const initialState: MasterPCState = {
    pcs: [],
    selectedPC: null,
    loading: false,
    error: null,
};

// GET /master/pc  (optional ?stateCode=)
export const fetchPCs = createAsyncThunk(
    'masterPC/fetchAll',
    async (stateCode: number | undefined, { rejectWithValue }) => {
        try {
            const url = stateCode
                ? `/master/pc?stateCode=${stateCode}`
                : '/master/pc';
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch parliamentary constituencies');
        }
    }
);

// GET /master/pc/:id
export const fetchPCById = createAsyncThunk(
    'masterPC/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/master/pc/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch parliamentary constituency');
        }
    }
);

// POST /master/pc
export const createPC = createAsyncThunk(
    'masterPC/create',
    async (dto: Partial<MasterPC>, { rejectWithValue }) => {
        try {
            const response = await axios.post('/master/pc', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create parliamentary constituency');
        }
    }
);

// PUT /master/pc/:id
export const updatePC = createAsyncThunk(
    'masterPC/update',
    async ({ id, dto }: { id: number; dto: Partial<MasterPC> }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/master/pc/${id}`, dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update parliamentary constituency');
        }
    }
);

// DELETE /master/pc/:id
export const deletePC = createAsyncThunk(
    'masterPC/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await axios.delete(`/master/pc/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete parliamentary constituency');
        }
    }
);

const masterPCSlice = createSlice({
    name: 'masterPC',
    initialState,
    reducers: {
        clearSelectedPC: (state) => {
            state.selectedPC = null;
        },
        clearPCs: (state) => {
            state.pcs = [];
        },
        clearPCError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPCs.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPCs.fulfilled, (state, action) => { state.loading = false; state.pcs = action.payload; })
            .addCase(fetchPCs.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(fetchPCById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPCById.fulfilled, (state, action) => { state.loading = false; state.selectedPC = action.payload; })
            .addCase(fetchPCById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createPC.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createPC.fulfilled, (state, action) => { state.loading = false; state.pcs.push(action.payload); })
            .addCase(createPC.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(updatePC.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updatePC.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.pcs.findIndex(p => p.id === action.payload.id);
                if (idx !== -1) state.pcs[idx] = action.payload;
            })
            .addCase(updatePC.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(deletePC.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deletePC.fulfilled, (state, action) => { state.loading = false; state.pcs = state.pcs.filter(p => p.id !== action.payload); })
            .addCase(deletePC.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearSelectedPC, clearPCs, clearPCError } = masterPCSlice.actions;
export default masterPCSlice.reducer;
