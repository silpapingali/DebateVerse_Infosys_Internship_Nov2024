import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Use `useParams` for route parameters and `useNavigate` for navigation

const UserDetail = () => {
  const { userId } = useParams(); // Extract userId from the route
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    // Fetch user details from the backend
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8081/UserDetail?userId=${userId}`);
        const userData = await response.json();
        if (userData.user) {
          setUser(userData.user);
        } else {
          alert('User not found.');
          navigate('/'); // Redirect if user not found
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const suspendUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/suspendUser?userId=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
      alert(result.message || 'User suspended successfully.');
      
      // Optionally update the user's status on the frontend
      setUser((prev) => ({ ...prev, status: 'Suspended' }));
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Failed to suspend user.');
    }
  };
  
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/deleteUser?userId=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
      alert(result.message || 'User deleted successfully.');
      navigate('/'); 
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };
  
  if (loading) return <p>Loading user details...</p>;

  if (!user) return <p>User details not available.</p>;

  return (
    <div className="container mt-5" style={{ backgroundColor: '#1e1e1e', color: 'white', minHeight: '100vh' }}> 
      <div className="card shadow" style={{ backgroundColor: 'white', color: 'black' }}> 
        <div className="card-header bg-primary text-white">
          <h4>User Details</h4>
        </div>
        <div className="card-body">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`}
            >
              {user.status}
            </span>
          </p>
          <p>
            <strong>Total Debates:</strong> {user.total_debates}
          </p>
          <p>
            <strong>Total Votes:</strong> {user.total_votes}
          </p>
          <p>
            <strong>Total Likes:</strong> {user.total_likes}
          </p>
          <p>
            <strong>Joined on:</strong>{' '}
            {new Date(user.created_at).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-warning"
              onClick={() => suspendUser(user.id)}
            >
              Suspend
            </button>
            <button
              className="btn btn-danger"
              onClick={() => deleteUser(user.id)}
            >
              Delete
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(-1)} 
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
