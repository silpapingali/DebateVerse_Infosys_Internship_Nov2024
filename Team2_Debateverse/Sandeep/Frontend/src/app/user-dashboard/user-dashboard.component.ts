import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  userId: string | null = null;
  userName: string = ''; // Store user name
  debates: any[] = []; // Store debates
  errorMessage: string = ''; // To store error message

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = localStorage.getItem('userId');

      console.log('User ID:', this.userId);

      if (this.userId) {
        this.fetchUserName();
        this.fetchDebates(); // Fetch debates only if the userId exists
      } else {
        this.errorMessage = 'User ID not found';
      }
    });
  }

  fetchUserName() {
    const url = `http://localhost:3000/api/users/${this.userId}`; // Replace with your API endpoint

    this.http.get<{ name: string }>(url).subscribe({
      next: (response) => {
        this.userName = response.name; // Assign the retrieved name
      },
      error: (error) => {
        console.error('Error fetching user name:', error);
        this.errorMessage = 'Failed to fetch user name';
      }
    });
  }

  // Fetch debates based on userId
  fetchDebates() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'No authentication token found.';
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Fetch debates for the specific userId
    this.http.get(`http://localhost:3000/api/debates/${this.userId}`, { headers }).subscribe(
      (response: any) => {
        this.debates = response.debates || [];  // Assuming backend sends 'debates' array
        console.log('Debates:', this.debates);
        this.errorMessage = '';  // Clear any previous error message
      },
      (error) => {
        console.error('Error fetching debates:', error);
        this.errorMessage = error.error.message || 'Error fetching debates.';
      }
    );
  }

  // Navigate to the create debate page
  createDebate(): void {
    this.router.navigate(['/create-debate'], { queryParams: { userId: this.userId } });
  }

  // Logout function
  logout(): void {
    // Clear user session data
    localStorage.clear();
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Delete Debate Function
  deleteDebate(debateId: string) {
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
        console.log('Debate deleted successfully');
        // Reload the debates after deletion
        this.fetchDebates();
      },
      (error) => {
        console.error('Error deleting debate:', error);
        this.errorMessage = error.error.message || 'Error deleting debate.';
      }
    );
  }

}
