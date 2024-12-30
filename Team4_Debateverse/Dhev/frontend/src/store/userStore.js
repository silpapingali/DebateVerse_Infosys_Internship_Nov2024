import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// Fetch all users
export const fetchUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Toggle user status
export const updateUserStatus = async (userId, status) => {
    try {
      const response = await axios.put(`${API_URL}/${userId}`, { status });
      return response.data; // return the updated user data
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };
