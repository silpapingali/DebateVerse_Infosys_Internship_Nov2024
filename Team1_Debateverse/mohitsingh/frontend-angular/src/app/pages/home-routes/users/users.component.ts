import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service/auth-service.service';
import { DebateService } from '../../../services/debate-service/debate.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  constructor(
    private _user: UserService,
    private _debate: DebateService,
    private _snack: MatSnackBar,
    private _auth: AuthServiceService,
    private _router:Router
  ) {
    this._auth.isLoggedIn$.subscribe((res) => {
      if (!res) {
        this._router.navigate(['/login']);
        this._snack.open('Please login to continue', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  users: any = [];

  filteredUsers: any = [];

  ngOnInit(): void {
    this._user.getAllUsers().subscribe((res: any) => {
      console.log(res);
      this.users = res;
      this.users.forEach((user: any) => {
        this._debate.getDebatesByUser(user.id).subscribe((debates: any) => {
          console.log(debates);
          user.debateCount = debates.length; // Map the number of debates

          // Calculate the total votes from all debates
          user.totalVotesCount = debates.reduce(
            (total: number, debate: any) => {
              return total + (debate.totalVotes || 0); // Add votes from each debate
            },
            0
          );

          // Calculate the total likes from all debates
          user.totalLikesCount = debates.reduce(
            (total: number, debate: any) => {
              return total + (debate.totalLikes || 0); // Add likes from each debate
            },
            0
          );
        });
      });
      this.filteredUsers = [...this.users];
    });
  }

  searchQuery: string = '';

  likes: number = 0;

  debates: number = 0;

  joinedAfter: any;

  onSearch() {
    const query = this.searchQuery?.toLowerCase().trim(); // Ensure query is lowercase and trimmed
    if (query) {
      this.filteredUsers = this.users.filter((user: any) =>
        user.name.toLowerCase().includes(query)
      );
    } else {
      this.filteredUsers = [...this.users]; // Reset to all debates if search query is empty
    }
  }

  onFilterChange() {
    const minLikes = this.likes || 0; // Default to 0 if no value is set
    const minVotes = this.debates || 0; // Default to 0 if no value is set
    const postedAfterDate = this.joinedAfter
      ? new Date(this.joinedAfter)
      : null;

    console.log(minLikes, minVotes, postedAfterDate);

    this.filteredUsers = this.users.filter((user: any) => {
      const matchesLikes = user.totalLikesCount >= minLikes;
      const matchesDebates = user.debateCount >= minVotes;
      const matchesPostedAfter = postedAfterDate
        ? new Date(user.joinDate) > postedAfterDate
        : true;

      return matchesLikes && matchesDebates && matchesPostedAfter;
    });
  }

  onUnblock(userId: any) {
    this._user.unblockUser(userId).subscribe(
      (res: any) => {
        console.log(res);
        // Update the specific user in the users array
        this.users = this.users.map((user: any) => {
          if (user.id === userId) {
            user.blocked = false;
          }
          return user;
        });
        this.filteredUsers = [...this.users]; // Update filtered users
        this._snack.open('User Unblocked', 'Close', {
          duration: 2000,
        });
      },
      (error: any) => {
        console.log(error);
        this._snack.open('Error Occurred', 'Close', {
          duration: 2000,
        });
      }
    );
  }

  onBlock(userId: any) {
    this._user.blockUser(userId).subscribe(
      (res: any) => {
        console.log(res);
        // Update the specific user in the users array
        this.users = this.users.map((user: any) => {
          if (user.id === userId) {
            user.blocked = true;
          }
          return user;
        });
        this.filteredUsers = [...this.users]; // Update filtered users
        this._snack.open('User Blocked', 'Close', {
          duration: 2000,
        });
      },
      (error: any) => {
        console.log(error);
        this._snack.open('Error Occurred', 'Close', {
          duration: 2000,
        });
      }
    );
  }
}
