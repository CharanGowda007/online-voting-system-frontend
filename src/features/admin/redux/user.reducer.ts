import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface UserProfile {
    id: string;
    loginId: string;
    email: string;
    roleCode: string;
    [key: string]: any;
}

interface UserState {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    passwordChanged: boolean;
}

const initialState: UserState = {
    profile: null,
    loading: false,
    error: null,
    passwordChanged: false,
};

// GET /user/auth/me  — fetch current user profile from refresh cookie
export const fetchCurrentUser = createAsyncThunk(
    'user/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/user/auth/me');
            return response.data?.data ?? response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
        }
    }
);

// POST /user/change-password
export const changePassword = createAsyncThunk(
    'user/changePassword',
    async (dto: { oldPassword: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/user/change-password', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to change password');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserProfile: (state) => { state.profile = null; },
        clearUserError: (state) => { state.error = null; },
        resetPasswordChanged: (state) => { state.passwordChanged = false; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
            .addCase(fetchCurrentUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(changePassword.pending, (state) => { state.loading = true; state.error = null; state.passwordChanged = false; })
            .addCase(changePassword.fulfilled, (state) => { state.loading = false; state.passwordChanged = true; })
            .addCase(changePassword.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearUserProfile, clearUserError, resetPasswordChanged } = userSlice.actions;
export default userSlice.reducer;
