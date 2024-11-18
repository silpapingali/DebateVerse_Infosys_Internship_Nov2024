import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {

  constructor(private _route:ActivatedRoute) {}

  message: string = '';

  ngOnInit() {
    this.message = this._route.snapshot.queryParamMap.get('message') || 'An error occurred';
  }

}
