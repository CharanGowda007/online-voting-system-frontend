import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
    id: string;
    loginId: string;
    email: string;
    roleCode: string;
    active: boolean;
    [key: string]: any;
}

interface UsersState {
    data: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    data: [],
    loading: false,
    error: null,
};

// GET /users
export const fetchAllUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/users');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

// POST /users
export const createUser = createAsyncThunk(
    'users/create',
    async (dto: Partial<User>, { rejectWithValue }) => {
        try {
            const response = await axios.post('/users', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create user');
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUsersError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllUsers.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
            .addCase(fetchAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createUser.fulfilled, (state, action) => { state.loading = false; state.data.push(action.payload); })
            .addCase(createUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
