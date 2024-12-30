// components/UserList.js

import React, { useState, useEffect } from 'react';
import { Search, Calendar, ThumbsUp } from 'lucide-react';
import { fetchUsers, updateUserStatus } from '../store/userStore'; // Import service
import { useAuthStore } from '../store/authStore';

const UserList = () => {

  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    exactMatch: false,
    likesMin: 0,
    questionsMin: 0,
    joinedAfter: ''
  });

  // Fetch users data on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers(); // Fetch users using the service
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    loadUsers();
  }, []);

  // Handle status change (suspend/activate)
  const handleSuspendUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    alert("status updated");
    try {
      const updatedUser = await updateUserStatus(userId, newStatus); // Update status using the service
      setUsers(users.map(user =>
        user.id === userId ? { ...user, status: updatedUser.status } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = filters.exactMatch
      ? user.name === filters.searchTerm
      : user.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesLikes = user.likes >= filters.likesMin;
    const matchesQuestions = user.debates >= filters.questionsMin;
    const matchesJoinDate = !filters.joinedAfter || new Date(user.joinedDate) >= new Date(filters.joinedAfter);

    return matchesSearch && matchesLikes && matchesQuestions && matchesJoinDate;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.exactMatch}
                onChange={(e) => setFilters({ ...filters, exactMatch: e.target.checked })}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Exact Match</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Likes greater than
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.likesMin}
                onChange={(e) => setFilters({ ...filters, likesMin: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0</span>
                <span>10k+</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Questions greater than
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.questionsMin}
                onChange={(e) => setFilters({ ...filters, questionsMin: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0</span>
                <span>200+</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar size={16} className="inline mr-1" />
                Joined After
              </label>
              <input
                type="date"
                value={filters.joinedAfter}
                onChange={(e) => setFilters({ ...filters, joinedAfter: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-4">
              {filteredUsers.map(user => (
                <div
                  key={user._id}
                  className={`bg-white p-4 rounded-lg border ${user.status === 'suspended' ? 'border-red-300' : 'border-gray-200'} shadow-sm`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600">{user.name}</h3>
                      <p className="text-sm text-gray-600">
                        {user.debates} debates, {formatNumber(user.votes)} votes, joined {new Date(user.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      
                      <button
                        onClick={() => handleSuspendUser(user._id, user.status)}
                        className={`p-2 rounded-lg ${user.status === 'suspended' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                      >
                        {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
