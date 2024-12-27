import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthServiceService } from '../../../services/auth-service/auth-service.service';
import { DebateService } from '../../../services/debate-service/debate.service';
import { VoteService } from '../../../services/vote.service';

@Component({
  selector: 'app-debate-poll',
  templateUrl: './debate-poll.component.html',
  styleUrl: './debate-poll.component.css',
})
export class DebatePollComponent implements OnInit {
  constructor(
    private _debate: DebateService,
    private _route: ActivatedRoute,
    private _auth: AuthServiceService,
    private _snack: MatSnackBar,
    private _vote: VoteService
  ) {}

  private likeSubject = new BehaviorSubject<number>(0);

  likes$ = this.likeSubject.asObservable();

  debateId: any;

  userId: any;

  debate: any = {};

  ngOnInit(): void {
    this.debateId = this._route.snapshot.params['id'];
    this.userId = this._auth.getUser().id;
    this._debate.getDebate(this.debateId).subscribe((res: any) => {
      console.log(res);
      this.debate = res;
      this.likeSubject.next(res.totalLikes);
    });
    this.likes$.subscribe((like) => {
      console.log('Likes: ', like);
    });
  }

  handleLikeDislike(like: boolean): void {
    like
      ? this._debate.likeDebate(this.debateId, this.userId).subscribe(
          (res: any) => {
            this.debate.totalLikes = this.debate.totalLikes + 1;
            this.likeSubject.next(this.debate.totalLikes);
            console.log(res);
            this._snack.open('Debate liked!', 'Close', {
              duration: 2000,
            });
          },
          (err) => {
            console.log(err);
            this._snack.open('Debate already liked!', 'Close', {
              duration: 2000,
            });
          }
        )
      : this._debate.dislikeDebate(this.debateId, this.userId).subscribe(
          (res: any) => {
            console.log(res);
            this.debate.totalLikes = this.debate.totalLikes - 1;
            this.likeSubject.next(this.debate.totalLikes);
            this._snack.open('Debate disliked!', 'Close', {
              duration: 2000,
            });
          },
          (err) => {
            console.log(err);
            this._snack.open('Debate already disliked!', 'Close', {
              duration: 2000,
            });
          }
        );
  }

  handleVote(id: number, increment: boolean): void {
    const currentTotalVotes = this.debate.options.reduce(
      (sum: number, option: any) => sum + option.totalVotes,
      0
    );

    const selectedOption = this.debate.options.find(
      (option: any) => option.id === id
    );

    if (increment && currentTotalVotes >= 10) {
      alert('Total votes cannot exceed 10.');
      return;
    }

    if (selectedOption) {
      const newTotalVotes = increment
        ? currentTotalVotes + 1
        : currentTotalVotes - 1;

      if (newTotalVotes <= 10) {
        this.debate.options = this.debate.options.map((option: any) =>
          option.id === id
            ? {
                ...option,
                totalVotes: increment
                  ? option.totalVotes + 1
                  : Math.max(0, option.totalVotes - 1),
              }
            : option
        );
      } else {
        alert('Cannot exceed a total of 10 votes.');
      }
    }
  }

  submitVotes(): void {
    const voteData = this.debate.options.map((option: any) => ({
      optionId: option.id,
      debateId: this.debateId,
      userId: this.userId,
      totalVotes: option.totalVotes,
    }));
    console.log(voteData);
    this._vote.vote(voteData).subscribe(
      (res: any) => {
        console.log(res);
        this._snack.open('Votes submitted!', 'Close', {
          duration: 2000,
        });
      },
      (err) => {
        console.log(err);
        this._snack.open('Error submitting votes!', 'Close', {
          duration: 2000,
        });
      }
    );
  }
}
