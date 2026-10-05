import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  newPassword = '';

  constructor(private router: Router) {}

  onSubmit() {
    localStorage.setItem('mustChangePassword', 'false');
    this.router.navigate(['/member/home']);
  }
}