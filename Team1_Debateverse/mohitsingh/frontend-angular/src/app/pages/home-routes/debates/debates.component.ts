import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service/auth-service.service';
import { DebateService } from '../../../services/debate-service/debate.service';

interface Post {
  content: string;
  author: string;
  date: string;
  likes: string;
  chart: number[];
}


@Component({
  selector: 'app-debates',
  templateUrl: './debates.component.html',
  styleUrl: './debates.component.css'
})
export class DebatesComponent implements OnInit {

  constructor(private _auth:AuthServiceService, private _router: Router, private _snack: MatSnackBar, private _debate: DebateService) {
    this._auth.isLoggedIn$.subscribe((res) => {
      if (!res) {
        this._router.navigate(['/login']);
        this._snack.open('Please login to continue', 'Close', {
          duration: 3000,
        });
      }
    });
   }

   allDebates: any[] = [];

   ngOnInit() {
    this._debate.getAllDebatesExceptUser().subscribe({
      next: (res: any) => {
        console.log(res);
        this.allDebates = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  searchTerm: string = 'eleme';

  posts: Post[] = [
    {
      content: "Mauris dignissim, sapien eget posuere venenatis, nisi urna facilisis neque, eget aliquam?",
      author: "Nolan_Bird",
      date: "12th February, 2022",
      likes: "2k",
      chart: [30, 45, 25, 60, 35]
    },
    {
      content: "Vestibulum ac gravida felis, non ullamcorper quam. Maecenas interdum consectetur diam vitae finibus?",
      author: "CooperMan",
      date: "25th December, 2023",
      likes: "132",
      chart: [20, 35, 45, 30, 25]
    },
    {
      content: "Nullam iaculis erat in odio tincidunt lacinia. Nulla eget aliquet mi, sit amet euismod mi?",
      author: "AmirGarg",
      date: "6th June, 2024",
      likes: "15M",
      chart: [40, 55, 75, 65, 70]
    },
    {
      content: "Phasellus pretium lacinia odio, eu porttitor metus aliquet sed?",
      author: "ChequeWindows",
      date: "11th January, 2024",
      likes: "1.9k",
      chart: [50, 30, 15, 80, 20]
    }
  ];



}
