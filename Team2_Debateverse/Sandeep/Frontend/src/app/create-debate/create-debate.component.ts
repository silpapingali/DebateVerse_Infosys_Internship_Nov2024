import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Required for two-way binding
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-debate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-debate.component.html',
  styleUrls: ['./create-debate.component.css'],
})
export class CreateDebateComponent {
  debate = { 
    question: '', 
    options: ['', ''], // Initial with 2 options
    likes: 0, // Default likes to 0
    voteCount: [] as number[], // Initialize as empty array
  };
  errorMessage: string = '';
  successMessage: string = ''; // Success message for creating debate

  constructor(private http: HttpClient,private router:Router) {}

  addOption() {
    if (this.debate.options.length < 7) {
      this.debate.options.push(''); // Add a new empty option
      this.debate.voteCount.push(0); // Add a default vote count for the new option
      this.errorMessage = ''; // Clear error message if any
    } else {
      this.errorMessage = 'You can add up to 7 options only!';
    }
  }

  removeOption(index: number) {
    if (this.debate.options.length > 2) {
      this.debate.options.splice(index, 1); // Remove the selected option
      this.debate.voteCount.splice(index, 1); // Remove the corresponding vote count
      this.errorMessage = ''; // Clear error message if any
    } else {
      this.errorMessage = 'At least 2 options are required!';
    }
  }

  createDebate() {
    // Validate the question and options
    if (!this.debate.question.trim() || this.debate.options.some(opt => !opt.trim())) {
      this.errorMessage = 'Please fill out all fields!';
      this.successMessage = ''; // Clear success message
      return;
    }

    // Get token from localStorage for authorization
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'You need to be logged in to create a debate.';
      return;
    }

    // Set authorization header
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Ensure voteCount array aligns with options array length
    this.debate.voteCount = this.debate.options.map(() => 0);

    // Make the HTTP request to create the debate
    this.http.post('http://localhost:3000/api/debates', this.debate, { headers }).subscribe(
      (response) => {
        console.log('Debate created successfully:', response);
        this.successMessage = 'Debate created successfully!';
        alert(this.successMessage);
        this.router.navigate(['/dashboard']);
        this.errorMessage = ''; // Clear any error messages
        this.debate = { question: '', options: ['', ''], likes: 0, voteCount: [] }; // Reset form
      },
      (error) => {
        console.error('Error creating debate:', error);
        this.errorMessage = 'Failed to create debate. Please try again.';
        this.successMessage = ''; // Clear success message
      }
    );
  }
}
