import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./AdminNavbar"; 
import './AdminUser.css'; 

function AdminUser () {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8081/admin/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(response.data);
            setFilteredUsers(response.data); 
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDeleteUser  = (email) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

       
        if (window.confirm(`Are you sure you want to suspend the user with email: ${email}?`)) {
            axios
                .delete(`http://localhost:8081/admin/users/${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    
                    setUsers((prevUsers) => prevUsers.map(user => 
                        user.email === email ? { ...user, is_deleted: 'yes' } : user
                    ));
                    setFilteredUsers((prevUsers) => prevUsers.map(user => 
                        user.email === email ? { ...user, is_deleted: 'yes' } : user
                    ));
                })
                .catch((error) => console.error('Error deleting user:', error));
        }
    };

    const handleRetrieveUser  = (email) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        if (window.confirm(`Are you sure you want to retrieve the user with email: ${email}?`)){
        axios
            .post(`http://localhost:8081/admin/users/${email}/retrieve`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
               
                setUsers((prevUsers) => prevUsers.map(user => 
                    user.email === email ? { ...user, is_deleted: 'no' } : user
                ));
                setFilteredUsers((prevUsers) => prevUsers.map(user => 
                    user.email === email ? { ...user, is_deleted: 'no' } : user
                ));
            })
            .catch((error) => console.error('Error retrieving user:', error));
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredUsers(users.filter(user => user.email.toLowerCase().includes(value)));
    };

    return (
        <div>
            <Navbar />
            <div className="admin-user-container">
                <h2>Users</h2>
                <input
                    type="text"
                    placeholder="Search by email"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                < div className="user-list">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.email} className="user-card" style={{ opacity: user.is_deleted === 'yes' ? 0.5 : 1 }}>
                                <span className="user-email">{user.email}</span>
                                <div className="user-actions">
                                    {user.is_deleted === 'no' ? (
                                        <>
                                            <button onClick={() => handleDeleteUser (user.email)} className="btn-delete">
                                                🗑️ Suspend
                                            </button>
                                            <button onClick={() => handleRetrieveUser (user.email)} className="btn-retrieve" style={{ display: 'none' }}>
                                                🔄 Retrieve
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleRetrieveUser (user.email)} className="btn-retrieve">
                                            🔄 Retrieve
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No users found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminUser ;