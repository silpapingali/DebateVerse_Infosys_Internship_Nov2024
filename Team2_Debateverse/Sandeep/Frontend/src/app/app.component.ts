import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userId: string | null = null;
  isLogged: boolean = false; // Flag to check if the user is logged in

  constructor(private router: Router) {}

  get isLoggedIn(){
    return !!localStorage.getItem('userId');;
  }

  ngOnInit(): void {
    // Retrieve the user ID and check login status from localStorage
    this.userId = localStorage.getItem('userId');
    //this.isLoggedIn = !!this.userId; // If userId exists, the user is logged in
    this.dashboard();
  }

  // Navigate to the dashboard with userId as a parameter
  dashboard(): void {
    if (this.userId) {
      console.log('User ID:', this.userId);
      this.router.navigate(['/dashboard']); // Pass userId as a parameter to the dashboard route
    } 
  }

  // Logout function to clear session data and navigate to login page
  logout(): void {
    localStorage.clear(); // Clear all session data
    //this.isLoggedIn = false; // Update the login status
    this.router.navigate(['/login']); // Redirect to login page
  }

  title = 'DebateHub';
}
