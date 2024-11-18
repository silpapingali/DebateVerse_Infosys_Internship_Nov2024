import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  dummyData = [
    { id: 1, title: 'Debate 1', description: 'Description for Debate 1' },
    { id: 2, title: 'Debate 2', description: 'Description for Debate 2' },
    { id: 3, title: 'Debate 3', description: 'Description for Debate 3' }
  ];
}
