import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '../services/auth.service';

// Form 6 Submission Thunk
export const submitVoterRegistration = createAsyncThunk(
    'voterRegistration/submit',
    async (formData: any, { rejectWithValue }) => {
        try {
            const response = await AuthService.registerVoter(formData);
            return response;
        } catch (error: any) {
            let errorMsg = error.response?.data?.message || 'An unknown server error occurred';
            if (Array.isArray(errorMsg)) errorMsg = errorMsg[0];
            return rejectWithValue(errorMsg);
        }
    }
);

interface VoterRegistrationState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: VoterRegistrationState = {
    loading: false,
    success: false,
    error: null,
};

const voterRegisterSlice = createSlice({
    name: 'voterRegistration',
    initialState,
    reducers: {
        resetVoterRegistrationState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitVoterRegistration.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(submitVoterRegistration.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(submitVoterRegistration.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetVoterRegistrationState } = voterRegisterSlice.actions;
export default voterRegisterSlice.reducer;
