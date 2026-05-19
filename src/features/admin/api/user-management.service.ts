import axios from 'axios';

export const UserManagementService = {
    getUsers: async () => {
        const response = await axios.get('/users');
        return response.data;
    },
    createUser: async (data: any) => {
        const response = await axios.post('/users', data);
        return response.data;
    },
    deleteUser: async (id: string) => {
        const response = await axios.delete(`/users/${id}`);
        return response.data;
    }
};
