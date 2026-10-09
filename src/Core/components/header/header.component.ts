import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  private router = inject(Router);

  userName = 'Organizer';

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');

    this.router.navigate(['/login']);
  }
}