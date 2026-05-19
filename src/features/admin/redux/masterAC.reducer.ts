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
    selectedAC: MasterAC | null;
    loading: boolean;
    error: string | null;
}

const initialState: MasterACState = {
    acs: [],
    selectedAC: null,
    loading: false,
    error: null,
};

// GET /master/ac  (optional ?parliamentCode=)
export const fetchACs = createAsyncThunk(
    'masterAC/fetchAll',
    async (parliamentCode: number | undefined, { rejectWithValue }) => {
        try {
            const url = parliamentCode
                ? `/master/ac?parliamentCode=${parliamentCode}`
                : '/master/ac';
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch assembly constituencies');
        }
    }
);

// GET /master/ac/:id
export const fetchACById = createAsyncThunk(
    'masterAC/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/master/ac/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch assembly constituency');
        }
    }
);

// POST /master/ac
export const createAC = createAsyncThunk(
    'masterAC/create',
    async (dto: Partial<MasterAC>, { rejectWithValue }) => {
        try {
            const response = await axios.post('/master/ac', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create assembly constituency');
        }
    }
);

// PUT /master/ac/:id
export const updateAC = createAsyncThunk(
    'masterAC/update',
    async ({ id, dto }: { id: number; dto: Partial<MasterAC> }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/master/ac/${id}`, dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update assembly constituency');
        }
    }
);

// DELETE /master/ac/:id
export const deleteAC = createAsyncThunk(
    'masterAC/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await axios.delete(`/master/ac/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete assembly constituency');
        }
    }
);

const masterACSlice = createSlice({
    name: 'masterAC',
    initialState,
    reducers: {
        clearSelectedAC: (state) => {
            state.selectedAC = null;
        },
        clearACs: (state) => {
            state.acs = [];
        },
        clearACError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchACs.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchACs.fulfilled, (state, action) => { state.loading = false; state.acs = action.payload; })
            .addCase(fetchACs.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(fetchACById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchACById.fulfilled, (state, action) => { state.loading = false; state.selectedAC = action.payload; })
            .addCase(fetchACById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createAC.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createAC.fulfilled, (state, action) => { state.loading = false; state.acs.push(action.payload); })
            .addCase(createAC.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(updateAC.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateAC.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.acs.findIndex(a => a.id === action.payload.id);
                if (idx !== -1) state.acs[idx] = action.payload;
            })
            .addCase(updateAC.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(deleteAC.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteAC.fulfilled, (state, action) => { state.loading = false; state.acs = state.acs.filter(a => a.id !== action.payload); })
            .addCase(deleteAC.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearSelectedAC, clearACs, clearACError } = masterACSlice.actions;
export default masterACSlice.reducer;
