import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent {
  name = '';
  email = '';
  temporaryPassword = '';
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(private memberService: MemberService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      name: this.name,
      email: this.email,
      temporaryPassword: this.temporaryPassword
    };

    this.memberService.addMember(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Member created successfully. The member can sign in with the provided email and temporary password and will be required to change the password on first login.';
        this.temporaryPassword = '';
        this.name = '';
        this.email = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to create member. Please try again.';
      }
    });
  }
}