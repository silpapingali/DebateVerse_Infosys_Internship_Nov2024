import axios from 'axios'
const API_URL='http://localhost:5000/api/debates';
export const closeDebate=async(debateId,status)=> {
    try {
      const response = await axios.put(`${API_URL}/${debateId}`, { status });
      return response.data; // return the updated user data
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };