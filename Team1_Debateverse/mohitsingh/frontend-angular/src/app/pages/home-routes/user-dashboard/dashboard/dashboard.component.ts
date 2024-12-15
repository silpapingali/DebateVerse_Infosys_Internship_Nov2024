import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {

  constructor(private _auth:AuthServiceService) {}

  user: any = {};

  ngOnInit(): void {
    this.user = this._auth.getUser();
  }

}
