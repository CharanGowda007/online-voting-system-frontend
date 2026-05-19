import axios from 'axios';

export const AdminService = {
    // Roles
    getRoles: async () => {
        const response = await axios.get('/roles');
        return response.data;
    },
    createRole: async (data: any) => {
        const response = await axios.post('/roles', data);
        return response.data;
    },

    // Post Details
    getPosts: async (query?: any) => {
        const response = await axios.get('/post-details', { params: query });
        return response.data;
    },
    createPost: async (data: any) => {
        const response = await axios.post('/post-details', data);
        return response.data;
    },
    updatePost: async (id: string, data: any) => {
        const response = await axios.put(`/post-details/${id}`, data);
        return response.data;
    },
    deletePost: async (id: string) => {
        const response = await axios.delete(`/post-details/${id}`);
        return response.data;
    },

    // Post Person Mapping
    getMappings: async () => {
        const response = await axios.get('/post-person-mapping');
        return response.data;
    },
    createMapping: async (data: any) => {
        // The backend has multiple endpoints, using the generic POST one
        const response = await axios.post('/post-person-mapping', data);
        return response.data;
    },
    
    // Additional helpers for dropdowns
    getUnmappedPersons: async () => {
        const response = await axios.get('/post-person-mapping/postId/person/unmapped-persons');
        return response.data;
    }
};
