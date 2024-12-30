import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for two-way binding
import { RouterModule } from '@angular/router'; // Import RouterModule
import { HttpClient } from '@angular/common/http';  // To make HTTP requests
import { VoteChartComponent } from '../vote-chart/vote-chart.component';

@Component({
  selector: 'app-search-debates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Add RouterModule here
  templateUrl: './search-debates.component.html',
  styleUrls: ['./search-debates.component.css'],
})
export class SearchDebatesComponent {
  debates: any[] = [];  // Array to store the list of debates fetched from the backend
  likesThreshold: number = 0;
  votesThreshold: number = 0;
  joinedAfter: any;  // Assuming it's a date input
  exactMatch: boolean = false;
  searchKeyword: any;
  showModal: boolean = false;  // To control the visibility of the modal
  selectedDebate: any = null;  // To store the selected debate for voting
  selectedOptionIndex: number = -1;  // To track the selected option
  liked:any[]=[];

  constructor(private http: HttpClient) { }

  // Method to fetch debates from the backend
  fetchDebates() {
    this.http.get('http://localhost:3000/api/debates').subscribe(
      (response: any) => {
        this.debates = response.debates;  // Assuming the backend returns a list of debates in 'debates'
      },
      (error) => {
        console.error('Error fetching debates:', error);
        // You could display an error message to the user here
      }
    );
  }

  // Method to sum values of a list
  sumOfList(list: number[]): number {
    return list.reduce((total, currentValue) => total + currentValue, 0);
  }

  // Method to handle the voting functionality
  vote(debateId: string) {
    this.selectedDebate = this.debates.find(debate => debate._id === debateId);
    console.log(this.selectedDebate.question);
    if (this.selectedDebate) {
      console.log(this.selectedDebate.question);
      // Show the modal when a vote is clicked
      this.showModal = true;
    }
  }

  // Method to confirm the vote and update it in the backend
  submitVote(i: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No authentication token found.');
      return;
    }
  
    this.selectedOptionIndex = i;
    if (this.selectedDebate && this.selectedOptionIndex >= 0) {
      // Send vote without token verification (no Authorization header)
      this.http.post(`http://localhost:3000/api/vote`, {
        userId:   localStorage.getItem('userId'),// Assuming userId is part of the debate data
        debateId: this.selectedDebate._id,
        optionIndex: this.selectedOptionIndex
      }).subscribe(response => {
       alert('Vote registered successfully');
      }, error => {
        alert('Error voting on debate:'+ error);
      });
    }
    this.showModal = false;
  }
  
  

  // Method to close the modal without voting
  closeModal() {
    this.showModal = false;
  }

  // Method to filter debates based on the search query and other filters
  get filteredDebates() {
    let filtered = this.debates;

    // Apply search keyword filter
    if (this.searchKeyword) {
      filtered = filtered.filter(debate =>
        debate.question.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }

    // Apply likesThreshold filter
    if (this.likesThreshold > 0) {
      filtered = filtered.filter(debate =>
        debate.likes >= this.likesThreshold
      );
    }

    // Apply votesThreshold filter
    if (this.votesThreshold > 0) {
      filtered = filtered.filter(debate =>
        this.sumOfList(debate.voteCount) > this.votesThreshold
      );
    }

    // Apply joinedAfter filter (if a date is provided)
    if (this.joinedAfter) {
      filtered = filtered.filter(debate =>
        new Date(debate.createdAt) >= new Date(this.joinedAfter)
      );
    }

    // Apply exactMatch filter if required
    if (this.exactMatch) {
      return filtered.filter(debate =>
        debate.likes >= this.likesThreshold &&
        this.sumOfList(debate.voteCount) > this.votesThreshold
      );
    }

    return filtered;
  }

  searchQuery() {
    return this.filteredDebates;
  }

  resetFilters() {
    this.searchKeyword = "";
    this.likesThreshold = 0;
    this.votesThreshold = 0;
    this.joinedAfter = null;  // Reset the joinedAfter filter
  }

  // Call the fetchDebates method on component initialization to load debates
  ngOnInit() {
    this.fetchDebates();
  }

  likecount() {
    if (this.liked.includes(this.selectedDebate)){
      this.liked.splice(this.liked.indexOf(this.selectedDebate), 1);
      this.selectedDebate.likes=this.selectedDebate.likes-1;
    }
    else if (this.selectedDebate && !this.liked.includes(this.selectedDebate)){
      this.liked.push(this.selectedDebate);
      this.selectedDebate.likes=this.selectedDebate.likes+1;
    }
  }

  getVotePercentage(index: number): number {
    const totalVotes = this.selectedDebate.votes.reduce((acc: number, vote: number) => acc + vote, 0);
    return totalVotes > 0 ? (this.selectedDebate.votes[index] / totalVotes) * 100 : 0;
  }
}
