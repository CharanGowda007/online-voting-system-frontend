import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface MasterState {
    id: number;
    stateCode: number;
    stateName: string;
    countryCode: number;
    active: boolean;
}

interface MasterStateSliceState {
    states: MasterState[];
    selectedState: MasterState | null;
    loading: boolean;
    error: string | null;
}

const initialState: MasterStateSliceState = {
    states: [],
    selectedState: null,
    loading: false,
    error: null,
};

// GET /master/state  (optional ?countryCode=)
export const fetchStates = createAsyncThunk(
    'masterState/fetchAll',
    async (countryCode: number | undefined, { rejectWithValue }) => {
        try {
            const url = countryCode
                ? `/master/state?countryCode=${countryCode}`
                : '/master/state';
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch states');
        }
    }
);

// GET /master/state/:id
export const fetchStateById = createAsyncThunk(
    'masterState/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/master/state/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch state');
        }
    }
);

// POST /master/state
export const createState = createAsyncThunk(
    'masterState/create',
    async (dto: Partial<MasterState>, { rejectWithValue }) => {
        try {
            const response = await axios.post('/master/state', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create state');
        }
    }
);

// PUT /master/state/:id
export const updateState = createAsyncThunk(
    'masterState/update',
    async ({ id, dto }: { id: number; dto: Partial<MasterState> }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/master/state/${id}`, dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update state');
        }
    }
);

// DELETE /master/state/:id
export const deleteState = createAsyncThunk(
    'masterState/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await axios.delete(`/master/state/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete state');
        }
    }
);

const masterStateSlice = createSlice({
    name: 'masterState',
    initialState,
    reducers: {
        clearSelectedState: (state) => {
            state.selectedState = null;
        },
        clearStateError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStates.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchStates.fulfilled, (state, action) => { state.loading = false; state.states = action.payload; })
            .addCase(fetchStates.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(fetchStateById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchStateById.fulfilled, (state, action) => { state.loading = false; state.selectedState = action.payload; })
            .addCase(fetchStateById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createState.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createState.fulfilled, (state, action) => { state.loading = false; state.states.push(action.payload); })
            .addCase(createState.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(updateState.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateState.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.states.findIndex(s => s.id === action.payload.id);
                if (idx !== -1) state.states[idx] = action.payload;
            })
            .addCase(updateState.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(deleteState.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteState.fulfilled, (state, action) => { state.loading = false; state.states = state.states.filter(s => s.id !== action.payload); })
            .addCase(deleteState.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearSelectedState, clearStateError } = masterStateSlice.actions;
export default masterStateSlice.reducer;
