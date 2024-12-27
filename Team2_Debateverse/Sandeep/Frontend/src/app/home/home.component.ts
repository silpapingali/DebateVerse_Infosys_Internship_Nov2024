import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router) {}

  navigateTo(page: string): void {
    if (page === 'login') {
      this.router.navigate(['/login']);
    } else if (page === 'register') {
      this.router.navigate(['/register']);
    }
  }
}
