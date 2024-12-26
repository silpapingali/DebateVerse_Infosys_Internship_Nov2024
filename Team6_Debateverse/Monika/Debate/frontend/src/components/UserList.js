import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaEdit } from 'react-icons/fa'; 

const UserList = () => {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  
  const searchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8081/searchUser?query=${query}`);
      const data = await response.json();

      if (data.user) {
        setUser(data.user);
        setMessage('');
      } else {
        setUser(null);
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error occurred while searching.');
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#1e1e1e', color: 'white' }}> 
      <div className="container mt-5">
        <h1 className="mb-4">Search User</h1>

        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Name or ID"
          />
          <button className="btn btn-primary" onClick={searchUser}>Search</button>
        </div>

        {message && <div className="alert alert-danger">{message}</div>}

        {user && (
          <div className="card mb-4 shadow-sm" style={{ backgroundColor: '#2c2c2c' }}>
            <div className="card-body text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title">
                  {user.username} (ID: {user.id})
                  <span
                    className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'} ms-2`}
                  >
                    {user.status}
                  </span>
                </h5>
                <button
                  className="btn btn-info"
                  onClick={() => navigate(`/userdetail/${user.id}`)} 
                >
                  <FaEdit />
                </button>
              </div>
              <p className="card-text">
                <strong>Total Debates:</strong> {user.total_debates} <br />
                <strong>Total Votes:</strong> {user.total_votes} <br />
                <strong>Total Likes:</strong> <FaHeart className="text-danger ms-1" /> {user.total_likes} <br />
                <strong>Joined:</strong>{' '}
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
