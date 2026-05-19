import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface PostDetails {
    id: string;
    postName: string;
    postCode: string;
    description?: string;
    active: boolean;
    [key: string]: any;
}

export interface PostDetailsQuery {
    page?: number;
    size?: number;
    search?: string;
    [key: string]: any;
}

interface PostDetailsState {
    data: PostDetails[];
    selectedPost: PostDetails | null;
    totalElements: number;
    loading: boolean;
    error: string | null;
}

const initialState: PostDetailsState = {
    data: [],
    selectedPost: null,
    totalElements: 0,
    loading: false,
    error: null,
};

// GET /post-details  (paginated, searchable)
export const fetchPostDetails = createAsyncThunk(
    'postDetails/fetchAll',
    async (query: PostDetailsQuery = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get('/post-details', { params: query });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch post details');
        }
    }
);

// GET /post-details/:id
export const fetchPostById = createAsyncThunk(
    'postDetails/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/post-details/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch post');
        }
    }
);

// POST /post-details
export const createPostDetails = createAsyncThunk(
    'postDetails/create',
    async (dto: Partial<PostDetails>, { rejectWithValue }) => {
        try {
            const response = await axios.post('/post-details', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create post');
        }
    }
);

// PUT /post-details/:id
export const updatePostDetails = createAsyncThunk(
    'postDetails/update',
    async ({ id, dto }: { id: string; dto: Partial<PostDetails> }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/post-details/${id}`, dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update post');
        }
    }
);

const postDetailsSlice = createSlice({
    name: 'postDetails',
    initialState,
    reducers: {
        clearSelectedPost: (state) => {
            state.selectedPost = null;
        },
        clearPostError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostDetails.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPostDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.content ?? action.payload;
                state.totalElements = action.payload?.totalElements ?? 0;
            })
            .addCase(fetchPostDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(fetchPostById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPostById.fulfilled, (state, action) => { state.loading = false; state.selectedPost = action.payload; })
            .addCase(fetchPostById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createPostDetails.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createPostDetails.fulfilled, (state, action) => { state.loading = false; state.data.push(action.payload); })
            .addCase(createPostDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(updatePostDetails.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updatePostDetails.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.data.findIndex(p => p.id === action.payload.id);
                if (idx !== -1) state.data[idx] = action.payload;
            })
            .addCase(updatePostDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearSelectedPost, clearPostError } = postDetailsSlice.actions;
export default postDetailsSlice.reducer;
