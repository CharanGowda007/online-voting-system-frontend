import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface PersonalDetails {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    address: string;
    [key: string]: any;
}

export interface PersonalDetailsQuery {
    page?: number;
    size?: number;
    search?: string;
    [key: string]: any;
}

interface PersonalDetailsState {
    data: PersonalDetails[];
    selectedPerson: PersonalDetails | null;
    totalElements: number;
    loading: boolean;
    error: string | null;
}

const initialState: PersonalDetailsState = {
    data: [],
    selectedPerson: null,
    totalElements: 0,
    loading: false,
    error: null,
};

// GET /persons  (paginated, searchable)
export const fetchPersonalDetails = createAsyncThunk(
    'personalDetails/fetchAll',
    async (query: PersonalDetailsQuery = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get('/persons', { params: query });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch personal details');
        }
    }
);

// GET /persons/:id
export const fetchPersonById = createAsyncThunk(
    'personalDetails/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/persons/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch person');
        }
    }
);

// POST /persons
export const createPersonalDetails = createAsyncThunk(
    'personalDetails/create',
    async (dto: Partial<PersonalDetails>, { rejectWithValue }) => {
        try {
            const response = await axios.post('/persons', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create person');
        }
    }
);

// POST /persons/seed?count=N
export const seedPersonalDetails = createAsyncThunk(
    'personalDetails/seed',
    async (count: number = 50, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/persons/seed?count=${count}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to seed persons');
        }
    }
);

const personalDetailsSlice = createSlice({
    name: 'personalDetails',
    initialState,
    reducers: {
        clearSelectedPerson: (state) => {
            state.selectedPerson = null;
        },
        clearPersonError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPersonalDetails.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPersonalDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.content ?? action.payload;
                state.totalElements = action.payload?.totalElements ?? 0;
            })
            .addCase(fetchPersonalDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(fetchPersonById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPersonById.fulfilled, (state, action) => { state.loading = false; state.selectedPerson = action.payload; })
            .addCase(fetchPersonById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createPersonalDetails.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createPersonalDetails.fulfilled, (state, action) => { state.loading = false; state.data.push(action.payload); })
            .addCase(createPersonalDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(seedPersonalDetails.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(seedPersonalDetails.fulfilled, (state) => { state.loading = false; })
            .addCase(seedPersonalDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearSelectedPerson, clearPersonError } = personalDetailsSlice.actions;
export default personalDetailsSlice.reducer;
