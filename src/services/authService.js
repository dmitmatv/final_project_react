import axios from 'axios';

const API_URL = 'http://localhost:4000';

const authService = {

    loginUser: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, userData);
            const { userId } = response.data;

            // Store the token in local storage or cookies for future requests
            localStorage.setItem('userId', userId);

            return true;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    },

    registerUser: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, userData);
            const { token } = response.data;

            // Store the token in local storage or cookies for future requests
            localStorage.setItem('token', token);

            return true;
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    },

    isAuthenticated: () => {
        // Check if the user is authenticated based on your logic
        const token = localStorage.getItem('token');
        return !!token; // Returns true if the token exists, indicating the user is authenticated
    },

    getCurrentUser: async () => {
        try {
            const userId = localStorage.getItem('userId');
            // Make a request to backend API to get the current user
            const response = await axios.get(`${API_URL}/auth/currentUser/${userId}`);

            const user = response.data.user;

            return user || null; // Return the user object or null if not found
        } catch (error) {
            console.error('Error fetching current user from the backend', error);
            return null;
        }
    },

    getUserRole: () => {
        const user = authService.getCurrentUser();
        return user ? user.role : null;
    },
};

export default authService;