import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../../services/auth-service/auth-service.service';
import { DebateService } from '../../../../services/debate-service/debate.service';

@Component({
  selector: 'app-create-debate',
  templateUrl: './create-debate.component.html',
  styleUrl: './create-debate.component.css',
})
export class CreateDebateComponent {
  userId: any = null;

  constructor(
    private _debate: DebateService,
    private _snack: MatSnackBar,
    private _auth: AuthServiceService,
    private _router:Router
  ) {
    this.userId = this._auth.getUser().id;
    this._auth.isLoggedIn$.subscribe((res) => {
      if (!res) {
        this._router.navigate(['/login']);
        this._snack.open('Please login to continue', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  debateReq: any = {
    debate: {
      text: '',
    },
    options: [{ text: '' }, { text: '' }],
  };

  addOption() {
    if (this.debateReq.options.length <= 6) this.debateReq.options.push({ text: '' });
    else {
      this._snack.open('You can add a maximum of 7 options', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
    }
  }

  removeOption() {
    if (this.debateReq.options.length > 2) {
      this.debateReq.options.pop();
    } else {
      this._snack.open('You must have at least 2 options', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
    }
  }

  postDebate() {
    // Implement post logic here
    if(this.debateReq.debate.text.trim() === '') {
      this._snack.open('Debate text cannot be empty', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
      return;
    }
    let emptyOption = false;
    this.debateReq.options.forEach((option: any) => {
      if(option.text.trim() === '') {
        emptyOption = true;
      }
    });
    if(emptyOption) {
      this._snack.open('Option text cannot be empty', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
      return;
    }

    console.log('Posting debate:', this.debateReq);
    this._debate.createDebate(this.debateReq, this.userId).subscribe({
      next: (res: any) => {
        console.log(res);
        this._snack.open(
          res.message || 'Debate created successfully',
          'Close',
          {
            duration: 2000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          }
        );
        this.debateReq = {
          debate: {
            text: '',
          },
          options: [{ text: '' }, { text: '' }],
        };
      },
      error: (err) => {
        console.log(err);
        this._snack.open(
          err.error.message || 'Debate creation failed',
          'Close',
          {
            duration: 2000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          }
        );
      },
    });
  }
}
