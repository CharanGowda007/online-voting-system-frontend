import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Role {
    id: number;
    code: string;
    name: string;
}

interface RoleState {
    data: Role[];
    selectedRole: Role | null;
    loading: boolean;
    error: string | null;
}

const initialState: RoleState = {
    data: [],
    selectedRole: null,
    loading: false,
    error: null,
};

// GET /roles
export const fetchRoles = createAsyncThunk(
    'role/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/roles');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
        }
    }
);

// GET /roles/:id
export const fetchRoleById = createAsyncThunk(
    'role/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/roles/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch role');
        }
    }
);

// POST /roles
export const createRole = createAsyncThunk(
    'role/create',
    async (dto: Partial<Role>, { rejectWithValue }) => {
        try {
            const response = await axios.post('/roles', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create role');
        }
    }
);

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        clearSelectedRole: (state) => { state.selectedRole = null; },
        clearRoleError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchRoles.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
            .addCase(fetchRoles.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(fetchRoleById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchRoleById.fulfilled, (state, action) => { state.loading = false; state.selectedRole = action.payload; })
            .addCase(fetchRoleById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createRole.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createRole.fulfilled, (state, action) => { state.loading = false; state.data.push(action.payload); })
            .addCase(createRole.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearSelectedRole, clearRoleError } = roleSlice.actions;
export default roleSlice.reducer;
