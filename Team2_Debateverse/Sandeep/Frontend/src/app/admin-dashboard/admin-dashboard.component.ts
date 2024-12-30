import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  debates: any[] = []; // Holds debates data
  users: any[] = []; // Holds users data
  filteredUsers: any[] = []; // Holds filtered users data
  errorMessage: string = ''; // For displaying error messages
  viewMode: 'debates' | 'users' = 'debates'; // Tracks the current view mode
  searchQuery: string = ''; // Search input
  searchLikes: number = 0; // Likes filter
  searchQuestions: number = 0; // Questions filter
  joinedAfter: string = ''; // Filter for joined date
  exactMatch: boolean = false; // Exact Match checkbox

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchDebates(); // Load debates initially
    this.fetchUsers();
  }

  private sortUsers(): void {
    this.filteredUsers.sort((a, b) => {
      if (a.suspended && !b.suspended) {
        return 1; // `a` comes after `b`
      } else if (!a.suspended && b.suspended) {
        return -1; // `a` comes before `b`
      }
      return 0; // No change if both are suspended or both are not
    });
  }

  // Fetch all debates from the server
  fetchDebates(): void {
    this.http.get('http://localhost:3000/api/debates').subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.debates = response;
        } else if (response.debates && Array.isArray(response.debates)) {
          this.debates = response.debates;
        } else {
          this.errorMessage = 'Invalid data format from server.';
        }
      },
      (error) => {
        this.errorMessage = error.error.message || 'Failed to load debates.';
      }
    );
  }

  // Fetch all users from the server
  fetchUsers(): void {
    this.http.get('http://localhost:3000/api/users').subscribe(
      (response: any) => {
        this.users = response;
        this.filteredUsers = [...this.users]; // Initialize filtered users
        console.log(this.users);
        this.sortUsers();
      },
      (error) => {
        alert(error.error.message || 'Failed to load users.');
      }
    );
  }
// Delete a user by ID
deleteUser(userId: string): void {
  this.http.get(`http://localhost:3000/api/debates`).subscribe(
    (response: any) => {
      if (response.debates && response.debates.length > 0) {
        // Filter debates to find only those associated with the given user
        const userDebates = response.debates.filter((debate: any) => debate.userId === userId);

        if (userDebates.length > 0) {
          // Delete user debates one by one
          this.deleteDebatesOneByOne(userDebates, userId);
        } else {
          console.log('No debates found for this user.');
          // If no user-associated debates, proceed to delete the user
          this.deleteUserFromDatabase(userId);
        }
      } else {
        console.log('No debates found in the database.');
        // If no debates exist in the database, proceed to delete the user
        this.deleteUserFromDatabase(userId);
      }
    },
    (error) => {
      alert('Failed to fetch debates from the database.'+error.messasge);
    }
  );
}

// Delete debates one by one using the existing deleteDebate method
deleteDebatesOneByOne(debates: any[], userId: string): void {
  let index = 0;

  const deleteNext = () => {
    if (index < debates.length) {
      const debateId = debates[index]._id;
      this.deleteDebate(debateId, () => {
        index++;
        deleteNext(); // Proceed to delete the next debate
      });
    } else {
      console.log('All user-associated debates deleted successfully.');
      // Once all debates are deleted, delete the user
      this.deleteUserFromDatabase(userId);
    }
  };

  // Start deleting debates
  deleteNext();
}

// Modified deleteDebate method to include a callback
deleteDebate(debateId: string, callback: () => void): void {
  const token = localStorage.getItem('token');
  if (!token) {
    this.errorMessage = 'No authentication token found.';
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  this.http.delete(`http://localhost:3000/api/debates/${debateId}`, { headers }).subscribe(
    (response) => {
      console.log(`Debate ${debateId} deleted successfully`);
      // Trigger the callback after successful deletion
      callback();
    },
    (error) => {
      console.error('Error deleting debate:', error);
      this.errorMessage = error.error.message || 'Error deleting debate.';
    }
  );
}

// Delete a user from the database
// Delete a user from the database
deleteUserFromDatabase(userId: string): void {
  this.http.delete(`http://localhost:3000/api/users/${userId}`).subscribe(
    () => {
      console.log('User deleted successfully.');
      // Remove the user from the UI
      this.users = this.users.filter((user) => user._id !== userId);
      this.filteredUsers = this.filteredUsers.filter((user) => user._id !== userId);
    },
    (error) => {
      alert(error.error.message || 'Failed to delete user.');
    }
  );
}



  // Search functionality for users
  searchUsers(): void {
    // Reset filtered users to all users initially
    this.filteredUsers = [...this.users]; 
  
    // Apply exact match or partial match for search query
    if (this.searchQuery) {
      if (this.exactMatch) {
        this.filteredUsers = this.filteredUsers.filter(
          (user) => user.name.toLowerCase() === this.searchQuery.toLowerCase()
        );
      } else {
        this.filteredUsers = this.filteredUsers.filter(
          (user) => user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    }
  
    // Apply likes filter
    if (this.searchLikes > 0) {
      this.filteredUsers = this.filteredUsers.filter(
        (user) => user.likes > this.searchLikes
      );
    }
  
    // Apply questions filter
    if (this.searchQuestions > 0) {
      this.filteredUsers = this.filteredUsers.filter(
        (user) => user.questionsCount > this.searchQuestions
      );
    }
  
    // Apply joined after date filter
    if (this.joinedAfter) {
      const joinedAfterDate = new Date(this.joinedAfter);
      if (!isNaN(joinedAfterDate.getTime())) {
        this.filteredUsers = this.filteredUsers.filter(
          (user) => new Date(user.addedDate) > joinedAfterDate
        );
      } else {
        this.errorMessage = 'Invalid date format for "Joined After" filter';
      }
    }
    this.sortUsers();
  }
  SuspendUser(userId: string,issuspended: boolean): void {
    const apiUrl = `http://localhost:3000/api/users/${userId}/suspend`;
  
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'No authentication token found.';
      console.error(this.errorMessage);
      return;
    }
  
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    console.log('Sending PUT request to:', apiUrl);
    this.http.put(apiUrl, { suspended: !issuspended }, { headers }).subscribe(
      (response: any) => {
        console.log('Response received from API:', response);
        console.log(`User ${userId} suspended successfully.`);
        const user = this.users.find((user) => user._id === userId);
        if (user) {
          user.suspended = !user.suspended ;
        }
        this.filteredUsers = [...this.users];
        this.sortUsers();
      },
      (error) => {
        console.error('Error response received:', error);
        alert(error.error.message || 'Failed to suspend user.');
      }
    );
  }

  editingDebate: any = null; // Holds the debate being edited

// Open the edit modal
openEditModal(debate: any): void {
  this.editingDebate = { ...debate }; // Create a copy to edit
}
addOption() {
  if (this.editingDebate.options.length < 7) {
    this.editingDebate.options.push(''); // Add a new empty option
    this.editingDebate.voteCount.push(0); // Add a default vote count for the new option
    this.errorMessage = ''; // Clear error message if any
  } else {
    this.errorMessage = 'You can add up to 7 options only!';
  }
}
removeOption(index: number) {
  if (this.editingDebate.options.length > 2) {
    this.editingDebate.options.splice(index, 1); // Remove the selected option
    this.editingDebate.voteCount.splice(index, 1); // Remove the corresponding vote count
    this.errorMessage = ''; // Clear error message if any
  } else {
    this.errorMessage = 'At least 2 options are required!';
  }
}

// Close the edit modal
closeEditModal(): void {
  this.editingDebate = null;
}

// Save changes to the debate
saveDebateChanges(): void {
  if (!this.editingDebate) return;

  const token = localStorage.getItem('token');
  if (!token) {
    this.errorMessage = 'No authentication token found.';
    console.error(this.errorMessage);
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  this.http.put(`http://localhost:3000/api/debates/${this.editingDebate._id}`, this.editingDebate, { headers }).subscribe(
    (response: any) => {
      console.log(`Debate ${this.editingDebate._id} updated successfully.`);
      // Update the local debates list
      const index = this.debates.findIndex((d) => d._id === this.editingDebate._id);
      if (index !== -1) {
        this.debates[index] = { ...this.editingDebate };
      }
      this.closeEditModal(); // Close the modal
    },
    (error) => {
      console.error('Error updating debate:', error);
      alert(error.error.message || 'Failed to update debate.');
    }
  );
}

  
  

  // Reset search filters
  resetFilters(): void {
    this.searchQuery = '';
    this.searchLikes = 0;
    this.searchQuestions = 0;
    this.joinedAfter = '';
    this.exactMatch = false;
    this.filteredUsers = [...this.users]; // Reset filtered users to all users
    this.sortUsers();
  }

  // Logout functionality
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
