import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface MemberPayment {
  memberId: string;
  fullName: string;
  hasPaid: boolean;
  hasReceived: boolean;
}

export interface RoundInfo {
  roundNumber: number;
  status: string;
  designatedReceiver: string;
}

export interface CircleDetail {
  circleId: string;
  name: string;
  contributionAmount: number;
  meetingLabel: string;
  status: string;
  currentRoundNumber: number;
  members: MemberPayment[];
  rounds: RoundInfo[];
}

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.scss']
})
export class OrganizerDashboardComponent implements OnInit {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:5034/api/circles';

  circle = signal<CircleDetail | null>(null);

  isLoading = signal<boolean>(true);

  errorMessage = signal<string>('');

  successMessage = signal<string>('');

  totalPot = computed(() => {
    const c = this.circle();

    if (!c) {
      return 0;
    }

    const paidCount = c.members.filter(
      member => member.hasPaid
    ).length;

    return paidCount * c.contributionAmount;
  });

  allPaid = computed(() => {
    const c = this.circle();

    if (!c || c.members.length === 0) {
      return false;
    }

    return c.members.every(
      member => member.hasPaid
    );
  });

  currentRound = computed(() => {
    const c = this.circle();

    if (!c) {
      return null;
    }

    return c.rounds.find(
      round =>
        round.roundNumber === c.currentRoundNumber
    ) ?? null;
  });

  ngOnInit(): void {
    this.loadCircleDetails();
  }

  loadCircleDetails(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http
      .get<CircleDetail>(
        `${this.apiUrl}/my`
      )
      .subscribe({

        next: data => {

          this.circle.set(data);

          this.isLoading.set(false);
        },

        error: err => {

          if (err.status === 404) {

            this.errorMessage.set(
              err.error?.message ||
              'You do not have a circle yet.'
            );

          } else if (err.status === 401) {

            this.errorMessage.set(
              'Your session has expired. Please login again.'
            );

          } else if (err.status === 403) {

            this.errorMessage.set(
              'Only an Organizer can access this dashboard.'
            );

          } else {

            this.errorMessage.set(
              err.error?.message ||
              'Failed to load circle details.'
            );
          }

          this.isLoading.set(false);
        }
      });
  }

  startCircle(): void {

    const c = this.circle();

    if (!c) {
      return;
    }

    if (c.members.length < 2) {

      this.errorMessage.set(
        'At least 2 members are required to start the circle.'
      );

      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.http
      .post(
        `${this.apiUrl}/${c.circleId}/start`,
        {}
      )
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Circle started successfully. Member list is now locked.'
          );

          this.loadCircleDetails();
        },

        error: err => {

          this.errorMessage.set(
            err.error?.message ||
            'Could not start the circle.'
          );
        }
      });
  }

  togglePayment(memberId: string): void {

    const c = this.circle();

    if (!c) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.http
      .post(
        `${this.apiUrl}/rounds/toggle-payment`,
        {
          circleId: c.circleId,
          roundNumber: c.currentRoundNumber,
          memberId: memberId
        }
      )
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Payment recorded successfully.'
          );

          this.loadCircleDetails();
        },

        error: err => {

          this.errorMessage.set(
            err.error?.message ||
            'Failed to record payment.'
          );
        }
      });
  }

  payoutCurrentRound(): void {

    const c = this.circle();

    if (!c) {
      return;
    }

    if (!this.allPaid()) {

      this.errorMessage.set(
        'All members must be marked as paid before payout.'
      );

      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.http
      .post(
        `${this.apiUrl}/${c.circleId}/payout`,
        {}
      )
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Current round paid out successfully.'
          );

          this.loadCircleDetails();
        },

        error: err => {

          this.errorMessage.set(
            err.error?.message ||
            'Payout could not be completed.'
          );
        }
      });
  }
}