import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service/auth-service.service';
import { DebateService } from '../../../services/debate-service/debate.service';
import { OptionService } from '../../../services/option-service/option.service';

@Component({
  selector: 'app-debate-update',
  templateUrl: './debate-update.component.html',
  styleUrls: ['./debate-update.component.css'], // Fixed typo: `styleUrl` -> `styleUrls`
})
export class DebateUpdateComponent implements OnInit {
  debate: any = {};
  debateId: any;

  constructor(
    private _debate: DebateService,
    private _route: ActivatedRoute,
    private _options: OptionService,
    private _snack: MatSnackBar,
    private _auth:AuthServiceService,
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

  ngOnInit(): void {
    this.debateId = this._route.snapshot.params['id'];
    this.loadDebate();
  }

  // Load debate data
  loadDebate(): void {
    this._debate.getDebate(this.debateId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.debate = res;
      },
      error: (err) => {
        console.error('Error fetching debate:', err);
      },
    });
  }

  // Block a debate
  blockDebate(): void {
    this._debate.blockDebate(this.debateId).subscribe({
      next: () => {
        this.debate.blocked = true; // Update UI state
        this._snack.open('Debate blocked', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error blocking debate:', err);
      },
    });
  }

  // Unblock a debate
  unblockDebate(): void {
    this._debate.unblockDebate(this.debateId).subscribe({
      next: () => {
        this.debate.blocked = false; // Update UI state
        this._snack.open('Debate unblocked', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error unblocking debate:', err);
      },
    });
  }

  // Block an option
  blockOption(optionId: any): void {
    this._options.blockOption(optionId, this.debateId).subscribe({
      next: () => {
        const option = this.debate.options.find((opt: any) => opt.id === optionId);
        if (option) {
          option.blocked = true; // Update UI state
        }
        this._snack.open('Option blocked', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error blocking option:', err);
      },
    });
  }

  // Unblock an option
  unblockOption(optionId: any): void {
    this._options.unblockOption(optionId, this.debateId).subscribe({
      next: () => {
        const option = this.debate.options.find((opt: any) => opt.id === optionId);
        if (option) {
          option.blocked = false; // Update UI state
        }
        this._snack.open('Option unblocked', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error unblocking option:', err);
      },
    });
  }
}
