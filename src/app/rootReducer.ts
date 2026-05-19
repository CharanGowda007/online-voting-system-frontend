import { combineReducers, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import voterRegisterReducer from '../features/voter/redux/voter-register.reducer';
import masterCountryReducer from '../features/admin/redux/masterCountry.reducer';
import masterStateReducer from '../features/admin/redux/masterState.reducer';
import masterPCReducer from '../features/admin/redux/masterPC.reducer';
import masterACReducer from '../features/admin/redux/masterAC.reducer';
import dashboardReducer from '../features/dashboard/redux/dashboard.reducer';
import personalDetailsReducer from '../features/admin/redux/personalDetails.reducer';
import postDetailsReducer from '../features/admin/redux/postDetails.reducer';
import postPermissionReducer from '../features/admin/redux/postPermission.reducer';
import postPersonMappingReducer from '../features/admin/redux/postPersonMapping.reducer';
import documentUploaderReducer from '../shared/redux/document-uploader.reducer';
import publicReducer from '../features/admin/redux/public.reducer';
import roleReducer from '../features/admin/redux/role.reducer';
import userReducer from '../features/admin/redux/user.reducer';
import usersReducer from '../features/admin/redux/users.reducer';

interface AuthState {
    accessToken: string | null;
    user: any;
    loading: boolean;
    error: string | null;
}

// POST /auth/refresh — exchange refresh cookie for new tokens
export const refreshToken = createAsyncThunk(
    'auth/refresh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post('/auth/refresh', {}, { withCredentials: true });
            return response.data?.data ?? response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to refresh token');
        }
    }
);

// GET /auth/me — validate refresh cookie and return access token + user info
export const fetchAuthMe = createAsyncThunk(
    'auth/me',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/auth/me', { withCredentials: true });
            return response.data?.data ?? response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Session expired');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: null,
        user: null,
        loading: false,
        error: null,
    } as AuthState,
    reducers: {
        clearAuthError: (state) => { state.error = null; },
        clearAuth: (state) => {
            state.accessToken = null;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(refreshToken.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(refreshToken.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.accessToken = action.payload?.accessToken ?? null;
                state.user = action.payload?.user ?? action.payload;
            })
            .addCase(refreshToken.rejected, (state, action: PayloadAction<unknown>) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchAuthMe.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAuthMe.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.accessToken = action.payload?.accessToken ?? null;
                state.user = action.payload?.user ?? action.payload;
            })
            .addCase(fetchAuthMe.rejected, (state, action: PayloadAction<unknown>) => {
                state.loading = false;
                state.error = action.payload as string;
                state.accessToken = null;
                state.user = null;
            });
    },
});

export const { clearAuthError, clearAuth } = authSlice.actions;

export const rootReducer = combineReducers({
    auth: authSlice.reducer,
    voterRegistration: voterRegisterReducer,
    masterCountry: masterCountryReducer,
    masterState: masterStateReducer,
    masterPC: masterPCReducer,
    masterAC: masterACReducer,
    dashboard: dashboardReducer,
    personalDetails: personalDetailsReducer,
    postDetails: postDetailsReducer,
    postPermission: postPermissionReducer,
    postPersonMapping: postPersonMappingReducer,
    documentUploader: documentUploaderReducer,
    public: publicReducer,
    role: roleReducer,
    user: userReducer,
    users: usersReducer,
});