import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-ekub',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './create-ekub.component.html',
  styleUrls: ['./create-ekub.component.scss']
})
export class CreateEkubComponent {
  ekubName = '';
  amount: number | null = null;
  frequency = 'Monthly';
  maxMembers: number | null = null;

  constructor(private router: Router) {}

  onSubmit() {
    alert(`Ekub "${this.ekubName}" created successfully!`);
    this.router.navigate(['/organizer/dashboard']);
  }
}