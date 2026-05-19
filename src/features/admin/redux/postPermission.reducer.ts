import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface PostPermission {
    id: number;
    postId: string;
    permission: string;
    [key: string]: any;
}

interface PostPermissionState {
    data: PostPermission[];
    selectedPermission: PostPermission | null;
    postPermissions: PostPermission[];
    loading: boolean;
    error: string | null;
}

const initialState: PostPermissionState = {
    data: [],
    selectedPermission: null,
    postPermissions: [],
    loading: false,
    error: null,
};

// GET /post-permissions
export const fetchPostPermissions = createAsyncThunk(
    'postPermission/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/post-permissions');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch post permissions');
        }
    }
);

// GET /post-permissions/post/:postId
export const fetchPermissionsByPostId = createAsyncThunk(
    'postPermission/fetchByPostId',
    async (postId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/post-permissions/post/${postId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch permissions for post');
        }
    }
);

// GET /post-permissions/:id
export const fetchPostPermissionById = createAsyncThunk(
    'postPermission/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/post-permissions/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch post permission');
        }
    }
);

// POST /post-permissions
export const createPostPermission = createAsyncThunk(
    'postPermission/create',
    async (dto: Partial<PostPermission>, { rejectWithValue }) => {
        try {
            const response = await axios.post('/post-permissions', dto);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create post permission');
        }
    }
);

const postPermissionSlice = createSlice({
    name: 'postPermission',
    initialState,
    reducers: {
        clearSelectedPermission: (state) => {
            state.selectedPermission = null;
        },
        clearPostPermissions: (state) => {
            state.postPermissions = [];
        },
        clearPermissionError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostPermissions.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPostPermissions.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
            .addCase(fetchPostPermissions.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(fetchPermissionsByPostId.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPermissionsByPostId.fulfilled, (state, action) => { state.loading = false; state.postPermissions = action.payload; })
            .addCase(fetchPermissionsByPostId.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(fetchPostPermissionById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPostPermissionById.fulfilled, (state, action) => { state.loading = false; state.selectedPermission = action.payload; })
            .addCase(fetchPostPermissionById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createPostPermission.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createPostPermission.fulfilled, (state, action) => { state.loading = false; state.data.push(action.payload); })
            .addCase(createPostPermission.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearSelectedPermission, clearPostPermissions, clearPermissionError } = postPermissionSlice.actions;
export default postPermissionSlice.reducer;
