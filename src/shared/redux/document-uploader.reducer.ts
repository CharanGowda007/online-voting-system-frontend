import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface DocumentMeta {
  key: string;
  filename: string;
  mimetype: string;
  entityType: string;
  entityId: number;
  refType: string;
  refId: number;
  [key: string]: any;
}

export interface GetAllFilesQuery {
  entityType?: string;
  entityId?: number;
  refType?: string;
  refId?: number;
}

interface DocumentUploaderState {
  documents: DocumentMeta[];
  downloadUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: DocumentUploaderState = {
  documents: [],
  downloadUrl: null,
  loading: false,
  error: null,
};

// POST /document-uploader  (multipart file upload)
export const uploadDocument = createAsyncThunk(
  'documentUploader/upload',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/document-uploader', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload document');
    }
  }
);

// GET /document-uploader/get-all-files?entityType=&entityId=&refType=&refId=
export const fetchDocuments = createAsyncThunk(
  'documentUploader/fetchAll',
  async (query: GetAllFilesQuery = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/document-uploader/get-all-files', { params: query });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents');
    }
  }
);

// GET /document-uploader/download?key=
export const getDownloadUrl = createAsyncThunk(
  'documentUploader/getDownloadUrl',
  async (key: string, { rejectWithValue }) => {
    try {
      // Returns a blob — return the object URL for display
      const response = await axios.get('/document-uploader/download', {
        params: { key },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      return url;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download document');
    }
  }
);

// GET /document-uploader/:id  (delete by image key)
export const deleteDocument = createAsyncThunk(
  'documentUploader/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/document-uploader/${id}`);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete document');
    }
  }
);

const documentUploaderSlice = createSlice({
  name: 'documentUploader',
  initialState,
  reducers: {
    clearDownloadUrl: (state) => { state.downloadUrl = null; },
    clearDocumentError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocument.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadDocument.fulfilled, (state) => { state.loading = false; })
      .addCase(uploadDocument.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(fetchDocuments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDocuments.fulfilled, (state, action) => { state.loading = false; state.documents = action.payload; })
      .addCase(fetchDocuments.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(getDownloadUrl.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getDownloadUrl.fulfilled, (state, action) => { state.loading = false; state.downloadUrl = action.payload; })
      .addCase(getDownloadUrl.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(deleteDocument.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = state.documents.filter(d => d.key !== action.payload.id);
      })
      .addCase(deleteDocument.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { clearDownloadUrl, clearDocumentError } = documentUploaderSlice.actions;
export default documentUploaderSlice.reducer;
