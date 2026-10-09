import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import {
  CircleService,
  MemberDashboard
} from '../../services/circle.service';

@Component({
  selector: 'app-member-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './member-home.component.html',
  styleUrl: './member-home.component.scss'
})
export class MemberHomeComponent implements OnInit {
  private readonly circleService = inject(CircleService);
  private readonly router = inject(Router);

  readonly dashboard = signal<MemberDashboard | null>(null);
  readonly isLoading = signal(false);
  readonly isPaying = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.circleService
      .getMyMemberDashboard()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.dashboard.set(data);
        },
        error: (error) => {
          this.dashboard.set(null);

          if (error.status === 401) {
            this.errorMessage.set(
              'Your session has expired. Please sign in again.'
            );
          } else if (error.status === 403) {
            this.errorMessage.set(
              'You do not have permission to access the Member Dashboard.'
            );
          } else if (error.status === 404) {
            this.errorMessage.set(
              'No circle is assigned to your account yet. Please contact your Organizer.'
            );
          } else {
            this.errorMessage.set(
              error.error?.message ??
              'Unable to load your dashboard. Please try again.'
            );
          }
        }
      });
  }

  payContribution(): void {
    const data = this.dashboard();

    if (!data || this.isPaying()) {
      return;
    }

    if (data.hasPaid) {
      this.errorMessage.set('You have already paid for this round.');
      return;
    }

    if (data.circleStatus !== 'Active' || data.roundStatus !== 'Open') {
      this.errorMessage.set(
        'Payments are available only when the circle is active and the round is open.'
      );
      return;
    }

    const confirmed = window.confirm(
      `Pay ${data.contributionAmount.toLocaleString()} ETB for round ${data.currentRoundNumber}?`
    );

    if (!confirmed) {
      return;
    }

    this.isPaying.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.circleService
      .makeMemberPayment(data.circleId)
      .pipe(finalize(() => this.isPaying.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set(
            'Your payment was submitted successfully.'
          );
          this.loadDashboard();
        },
        error: (error) => {
          this.errorMessage.set(
            error.error?.message ??
            'Payment failed. Please check your payment status and try again.'
          );
        }
      });
  }

  refresh(): void {
    this.successMessage.set('');
    this.loadDashboard();
  }

  logout(): void {
    // Replace this with your AuthService logout method if available.
    this.router.navigate(['/login']);
  }
}