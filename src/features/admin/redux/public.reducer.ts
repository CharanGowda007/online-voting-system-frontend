import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface PublicState {
    captchaId: string | null;
    captchaSvg: string | null;
    captchaValid: boolean | null;
    loading: boolean;
    error: string | null;
}

const initialState: PublicState = {
    captchaId: null,
    captchaSvg: null,
    captchaValid: null,
    loading: false,
    error: null,
};

// POST /public/login
export const loginUser = createAsyncThunk(
    'public/login',
    async (credentials: { loginId: string; password: string; captchaId?: string; captchaText?: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/public/login', credentials, { withCredentials: true });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// GET /public/generate-captcha
export const generateCaptcha = createAsyncThunk(
    'public/generateCaptcha',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/public/generate-captcha');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to generate captcha');
        }
    }
);

// POST /public/validate-captcha
export const validateCaptcha = createAsyncThunk(
    'public/validateCaptcha',
    async (dto: { captchaId: string; captchaText: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/public/validate-captcha', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to validate captcha');
        }
    }
);

// GET /public/logout?loginId=&hId=
export const logoutUser = createAsyncThunk(
    'public/logout',
    async ({ loginId, hId }: { loginId: string; hId?: number }, { rejectWithValue }) => {
        try {
            const params: any = { loginId };
            if (hId !== undefined) params.hId = hId;
            const response = await axios.get('/public/logout', { params, withCredentials: true });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

// POST /public/roles/seed
export const seedRoles = createAsyncThunk(
    'public/seedRoles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post('/public/roles/seed');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to seed roles');
        }
    }
);

const publicSlice = createSlice({
    name: 'public',
    initialState,
    reducers: {
        clearCaptcha: (state) => {
            state.captchaId = null;
            state.captchaSvg = null;
            state.captchaValid = null;
        },
        clearPublicError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateCaptcha.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(generateCaptcha.fulfilled, (state, action) => {
                state.loading = false;
                state.captchaId = action.payload.captchaId;
                state.captchaSvg = action.payload.svg;
            })
            .addCase(generateCaptcha.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(validateCaptcha.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(validateCaptcha.fulfilled, (state, action) => {
                state.loading = false;
                state.captchaValid = action.payload.isValid;
            })
            .addCase(validateCaptcha.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state) => { state.loading = false; })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(logoutUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(logoutUser.fulfilled, (state) => { state.loading = false; })
            .addCase(logoutUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(seedRoles.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(seedRoles.fulfilled, (state) => { state.loading = false; })
            .addCase(seedRoles.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearCaptcha, clearPublicError } = publicSlice.actions;
export default publicSlice.reducer;
