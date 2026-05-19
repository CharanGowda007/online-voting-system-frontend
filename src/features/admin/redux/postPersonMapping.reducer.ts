import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface PostPersonMapping {
    id: number;
    postId: string;
    personId: string;
    status: 'ACTIVE' | 'INACTIVE';
    [key: string]: any;
}

export interface MappingWithDetails extends PostPersonMapping {
    postName?: string;
    personName?: string;
}

export interface AllMappingsQuery {
    page?: number;
    limit?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    search?: string;
}

interface PostPersonMappingState {
    data: PostPersonMapping[];
    selectedMapping: PostPersonMapping | null;
    mappingWithDetails: MappingWithDetails[];
    unmappedPersons: any[];
    processHistory: any[];
    totalElements: number;
    loading: boolean;
    error: string | null;
}

const initialState: PostPersonMappingState = {
    data: [],
    selectedMapping: null,
    mappingWithDetails: [],
    unmappedPersons: [],
    processHistory: [],
    totalElements: 0,
    loading: false,
    error: null,
};

// GET /post-person-mapping  (all)
export const fetchPostPersonMappings = createAsyncThunk(
    'postPersonMapping/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/post-person-mapping');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch post person mappings');
        }
    }
);

// GET /post-person-mapping/all-with-details
export const fetchAllMappingsWithDetails = createAsyncThunk(
    'postPersonMapping/fetchAllWithDetails',
    async (query: AllMappingsQuery = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get('/post-person-mapping/all-with-details', { params: query });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch mappings with details');
        }
    }
);

// GET /post-person-mapping/person/:id/all-mappings  (paginated)
export const fetchAllMappingsByPersonId = createAsyncThunk(
    'postPersonMapping/fetchByPersonId',
    async (
        { id, page = 0, size = 10, sort = 'ASC' }: { id: string; page?: number; size?: number; sort?: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(`/post-person-mapping/person/${id}/all-mappings`, {
                params: { page, size, sort },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch mappings for person');
        }
    }
);

// GET /post-person-mapping/postId/:postId  (mapping + person details)
export const fetchMappingByPostId = createAsyncThunk(
    'postPersonMapping/fetchByPostId',
    async (postId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/post-person-mapping/postId/${postId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch mapping by postId');
        }
    }
);

// GET /post-person-mapping/post/:postId  (active mapping)
export const fetchActiveByPostId = createAsyncThunk(
    'postPersonMapping/fetchActiveByPostId',
    async (postId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/post-person-mapping/post/${postId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch active mapping');
        }
    }
);

// GET /post-person-mapping/postId/person/unmapped-persons
export const fetchUnmappedPersons = createAsyncThunk(
    'postPersonMapping/fetchUnmapped',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/post-person-mapping/postId/person/unmapped-persons');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch unmapped persons');
        }
    }
);

// GET /post-person-mapping/postName/:postName
export const fetchMappingByPostName = createAsyncThunk(
    'postPersonMapping/fetchByPostName',
    async (postName: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/post-person-mapping/postName/${postName}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch mapping by post name');
        }
    }
);

// GET /post-person-mapping/:id/history/process-history
export const fetchProcessHistory = createAsyncThunk(
    'postPersonMapping/fetchProcessHistory',
    async (
        { postId, page = 1, limit = 10, sort = 'ASC' }: { postId: string; page?: number; limit?: number; sort?: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(`/post-person-mapping/${postId}/history/process-history`, {
                params: { page, limit, sort },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch process history');
        }
    }
);

// GET /post-person-mapping/:id
export const fetchMappingById = createAsyncThunk(
    'postPersonMapping/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/post-person-mapping/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch mapping');
        }
    }
);

// POST /post-person-mapping  (create via body)
export const createPostPersonMapping = createAsyncThunk(
    'postPersonMapping/create',
    async (dto: { postId: string; personId: string; [key: string]: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/post-person-mapping', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create mapping');
        }
    }
);

// POST /post-person-mapping/postId/:postId/personId/:personId/mapping  (BDA-style path)
export const mapPersonToPost = createAsyncThunk(
    'postPersonMapping/mapPersonToPost',
    async (
        { postId, personId, dto }: { postId: string; personId: string; dto?: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `/post-person-mapping/postId/${postId}/personId/${personId}/mapping`,
                dto ?? {}
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to map person to post');
        }
    }
);

// PUT /post-person-mapping/:id
export const updatePostPersonMapping = createAsyncThunk(
    'postPersonMapping/update',
    async ({ id, dto }: { id: number; dto: any }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/post-person-mapping/${id}`, dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update mapping');
        }
    }
);

// PUT /post-person-mapping/:id/unmapped/update-status
export const updateMappingStatus = createAsyncThunk(
    'postPersonMapping/updateStatus',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/post-person-mapping/${id}/unmapped/update-status`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update mapping status');
        }
    }
);

// DELETE /post-person-mapping/:id/person/:postId/mapping  (soft delete)
export const deletePostPersonMapping = createAsyncThunk(
    'postPersonMapping/delete',
    async ({ id, postId }: { id: number; postId: string }, { rejectWithValue }) => {
        try {
            await axios.delete(`/post-person-mapping/${id}/person/${postId}/mapping`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete mapping');
        }
    }
);

const postPersonMappingSlice = createSlice({
    name: 'postPersonMapping',
    initialState,
    reducers: {
        clearSelectedMapping: (state) => {
            state.selectedMapping = null;
        },
        clearMappingError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        const setLoading = (state: PostPersonMappingState) => { state.loading = true; state.error = null; };
        const setRejected = (state: PostPersonMappingState, action: PayloadAction<unknown>) => {
            state.loading = false;
            state.error = action.payload as string;
        };

        builder
            .addCase(fetchPostPersonMappings.pending, setLoading)
            .addCase(fetchPostPersonMappings.fulfilled, (state, action) => { state.loading = false; state.data = action.payload?.data ?? action.payload; })
            .addCase(fetchPostPersonMappings.rejected, setRejected)

            .addCase(fetchAllMappingsWithDetails.pending, setLoading)
            .addCase(fetchAllMappingsWithDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.mappingWithDetails = action.payload?.data ?? action.payload;
                state.totalElements = action.payload?.total ?? 0;
            })
            .addCase(fetchAllMappingsWithDetails.rejected, setRejected)

            .addCase(fetchAllMappingsByPersonId.pending, setLoading)
            .addCase(fetchAllMappingsByPersonId.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data ?? action.payload;
                state.totalElements = action.payload?.totalElements ?? 0;
            })
            .addCase(fetchAllMappingsByPersonId.rejected, setRejected)

            .addCase(fetchMappingByPostId.pending, setLoading)
            .addCase(fetchMappingByPostId.fulfilled, (state, action) => { state.loading = false; state.selectedMapping = action.payload; })
            .addCase(fetchMappingByPostId.rejected, setRejected)

            .addCase(fetchActiveByPostId.pending, setLoading)
            .addCase(fetchActiveByPostId.fulfilled, (state, action) => { state.loading = false; state.selectedMapping = action.payload; })
            .addCase(fetchActiveByPostId.rejected, setRejected)

            .addCase(fetchUnmappedPersons.pending, setLoading)
            .addCase(fetchUnmappedPersons.fulfilled, (state, action) => { state.loading = false; state.unmappedPersons = action.payload; })
            .addCase(fetchUnmappedPersons.rejected, setRejected)

            .addCase(fetchMappingByPostName.pending, setLoading)
            .addCase(fetchMappingByPostName.fulfilled, (state, action) => { state.loading = false; state.selectedMapping = action.payload; })
            .addCase(fetchMappingByPostName.rejected, setRejected)

            .addCase(fetchProcessHistory.pending, setLoading)
            .addCase(fetchProcessHistory.fulfilled, (state, action) => { state.loading = false; state.processHistory = action.payload?.data ?? action.payload; })
            .addCase(fetchProcessHistory.rejected, setRejected)

            .addCase(fetchMappingById.pending, setLoading)
            .addCase(fetchMappingById.fulfilled, (state, action) => { state.loading = false; state.selectedMapping = action.payload; })
            .addCase(fetchMappingById.rejected, setRejected)

            .addCase(createPostPersonMapping.pending, setLoading)
            .addCase(createPostPersonMapping.fulfilled, (state, action) => { state.loading = false; state.data.push(action.payload); })
            .addCase(createPostPersonMapping.rejected, setRejected)

            .addCase(mapPersonToPost.pending, setLoading)
            .addCase(mapPersonToPost.fulfilled, (state, action) => { state.loading = false; state.data.push(action.payload); })
            .addCase(mapPersonToPost.rejected, setRejected)

            .addCase(updatePostPersonMapping.pending, setLoading)
            .addCase(updatePostPersonMapping.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.data.findIndex(m => m.id === (action.payload?.data?.id ?? action.payload?.id));
                if (idx !== -1) state.data[idx] = action.payload?.data ?? action.payload;
            })
            .addCase(updatePostPersonMapping.rejected, setRejected)

            .addCase(updateMappingStatus.pending, setLoading)
            .addCase(updateMappingStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const idx = state.data.findIndex(m => m.id === updated?.id);
                if (idx !== -1) state.data[idx] = updated;
            })
            .addCase(updateMappingStatus.rejected, setRejected)

            .addCase(deletePostPersonMapping.pending, setLoading)
            .addCase(deletePostPersonMapping.fulfilled, (state, action) => { state.loading = false; state.data = state.data.filter(m => m.id !== action.payload); })
            .addCase(deletePostPersonMapping.rejected, setRejected);
    },
});

export const { clearSelectedMapping, clearMappingError } = postPersonMappingSlice.actions;
export default postPersonMappingSlice.reducer;
