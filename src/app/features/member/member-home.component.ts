import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-member-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './member-home.component.html',
  styleUrls: ['./member-home.component.scss']
})
export class MemberHomeComponent {
  // Explicitly declare memberName so the template compiler can find it
  memberName: string = 'Abebe Kebede';

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}