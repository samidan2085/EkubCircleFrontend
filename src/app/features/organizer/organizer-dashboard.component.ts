
import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.services';
import { finalize } from 'rxjs/operators';

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

export interface MemberTransaction {
  memberId: string;
  memberName: string;
  roundNumber: number;
  amount: number;
  paidAt: string;
}

export interface RoundFundPerformance {
  roundNumber: number;
  collectedAmount: number;
  expectedAmount: number;
  paidMembers: number;
  totalMembers: number;
  status: string;
}

export interface DashboardResponse {
  circleId: string;
  circleName: string;
  contributionAmount: number;
  meetingLabel: string;
  circleStatus: string;
  currentRoundNumber: number;
  currentRoundFund: number;
  totalFundValue: number;
  activeMembers: number;
  totalMembers: number;
  currentRoundPaidMembers: number;
  currentRoundTotalMembers: number;
  fundPerformance: RoundFundPerformance[];
  transactions: MemberTransaction[];
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
  imports: [CommonModule, RouterLink],
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.scss']
})
export class OrganizerDashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = 'http://localhost:5034/api/circles';
   private readonly fb = inject(FormBuilder);

  readonly circle = signal<CircleDetail | null>(null);
  readonly dashboard = signal<DashboardResponse | null>(null);

  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly isStarting = signal(false);
  readonly isRecordingPayment = signal(false);
  readonly isRecordingPayout = signal(false);

  readonly transactions = computed(
    () => this.dashboard()?.transactions ?? []
  );

  readonly fundPerformance = computed(
    () => this.dashboard()?.fundPerformance ?? []
  );

  readonly paidCount = computed(
    () => this.dashboard()?.currentRoundPaidMembers
      ?? this.circle()?.members.filter(member => member.hasPaid).length
      ?? 0
  );

  readonly receivedCount = computed(
    () => this.circle()?.members.filter(member => member.hasReceived).length ?? 0
  );

  readonly totalPot = computed(
    () => this.dashboard()?.currentRoundFund
      ?? this.paidCount() * (this.circle()?.contributionAmount ?? 0)
  );

  readonly totalFundValue = computed(
    () => this.dashboard()?.totalFundValue ?? 0
  );

  readonly activeMembers = computed(
    () => this.dashboard()?.activeMembers ?? this.circle()?.members.length ?? 0
  );

  readonly paymentProgress = computed(() => {
    const total = this.dashboard()?.currentRoundTotalMembers
      ?? this.circle()?.members.length
      ?? 0;

    return total === 0 ? 0 : (this.paidCount() / total) * 100;
  });

  readonly allPaid = computed(() => {
    const total = this.dashboard()?.currentRoundTotalMembers
      ?? this.circle()?.members.length
      ?? 0;

    return total > 0 && this.paidCount() === total;
  });

  readonly currentRound = computed(() => {
    const circle = this.circle();

    return circle?.rounds.find(
      round => round.roundNumber === circle.currentRoundNumber
    ) ?? null;
  });
 

readonly isAddingMember = signal(false);
readonly memberError = signal('');
readonly memberSuccess = signal('');

readonly memberForm = this.fb.nonNullable.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  temporaryPassword: ['', Validators.required]
});

addMember(): void {
  const currentCircle = this.circle();

  if (!currentCircle || this.memberForm.invalid) {
    this.memberForm.markAllAsTouched();
    return;
  }

  if (currentCircle.status.toLowerCase() !== 'forming') {
    this.memberError.set(
      'You can only add members while the circle is forming.'
    );
    return;
  }

  this.isAddingMember.set(true);
  this.memberError.set('');
  this.memberSuccess.set('');

  const formValue = this.memberForm.getRawValue();

  this.http.post(
    `${this.apiUrl}/${currentCircle.circleId}/members`,
    {
      name: formValue.name.trim(),
      email: formValue.email.trim(),
      temporaryPassword: formValue.temporaryPassword
    }
  ).subscribe({
    next: () => {
      this.isAddingMember.set(false);
      this.memberSuccess.set('Member added successfully.');
      this.memberForm.reset();

      // Refresh the circle and dashboard data.
      this.loadDashboard();
    },
    error: (error) => {
      this.isAddingMember.set(false);

      this.memberError.set(
        error.error?.message ??
        error.error?.title ??
        'Failed to add member. Please check the information and try again.'
      );
    }
  });
}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<DashboardResponse>(
      `${this.apiUrl}/my/dashboard`
    ).subscribe({
      next: (data) => {
        this.dashboard.set(data);

        // Keep a compatible circle model for the existing HTML.
        this.circle.set({
          circleId: data.circleId,
          name: data.circleName,
          contributionAmount: data.contributionAmount,
          meetingLabel: data.meetingLabel,
          status: data.circleStatus,
          currentRoundNumber: data.currentRoundNumber,
          members: [],
          rounds: []
        });

        // Load existing member and round details.
        this.loadCircleDetails();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.handleApiError(error);
      }
    });
  }

  loadCircleDetails(): void {
    this.http.get<{
      name: string;
      contributionAmount: number;
      meetingLabel: string;
      members?: MemberPayment[];
      rounds?: RoundInfo[];
      status?: string;
      circleId?: string;
      currentRoundNumber?: number;
    }>(`${this.apiUrl}/my`).subscribe({
      next: (data) => {
        const dashboard = this.dashboard();

        this.circle.set({
          circleId: data.circleId ?? dashboard?.circleId ?? '',
          name: data.name ?? dashboard?.circleName ?? '',
          contributionAmount: data.contributionAmount ?? 0,
          meetingLabel: data.meetingLabel ?? '',
          status: data.status ?? dashboard?.circleStatus ?? '',
          currentRoundNumber:
            data.currentRoundNumber ?? dashboard?.currentRoundNumber ?? 1,
          members: data.members ?? [],
          rounds: data.rounds ?? []
        });

        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.handleApiError(error);
      }
    });
  }

  startCircle(): void {
    const circle = this.circle();

    if (!circle || this.isStarting()) {
      return;
    }

    if (circle.members.length < 2) {
      this.errorMessage.set(
        'Add at least two members before starting the circle.'
      );
      return;
    }

    this.isStarting.set(true);
    this.clearMessages();

    this.http.post(
      `${this.apiUrl}/${circle.circleId}/start`,
      {}
    ).subscribe({
      next: () => {
        this.successMessage.set('Circle started successfully.');
        this.isStarting.set(false);
        this.loadDashboard();
      },
      error: (error: HttpErrorResponse) => {
        this.isStarting.set(false);
        this.handleApiError(error);
      }
    });
  }

  togglePayment(memberId: string): void {
    const circle = this.circle();

    if (!circle || this.isRecordingPayment()) {
      return;
    }

    if (circle.status.toLowerCase() !== 'active') {
      this.errorMessage.set(
        'Payments can only be recorded for an active circle.'
      );
      return;
    }

    const member = circle.members.find(
      item => item.memberId === memberId
    );

    if (!member) {
      this.errorMessage.set('Member not found.');
      return;
    }

    if (member.hasPaid) {
      this.errorMessage.set(
        'This member has already paid for the current round.'
      );
      return;
    }

    this.isRecordingPayment.set(true);
    this.clearMessages();

    this.http.post(
      `${this.apiUrl}/rounds/toggle-payment`,
      {
        circleId: circle.circleId,
        roundNumber: circle.currentRoundNumber,
        memberId
      }
    ).subscribe({
      next: () => {
        this.successMessage.set('Payment recorded successfully.');
        this.isRecordingPayment.set(false);
        this.loadDashboard();
      },
      error: (error: HttpErrorResponse) => {
        this.isRecordingPayment.set(false);
        this.handleApiError(error);
      }
    });
  }

  payoutCurrentRound(): void {
    this.errorMessage.set(
      'Payout is not connected yet. We need to add and verify the payout endpoint in the backend first.'
    );
  }

  logout(): void {
    this.authService.logout();
    window.location.assign('/login');
  }

  clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private handleApiError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      this.errorMessage.set(
        'Your session has expired. Please log in again.'
      );
    } else if (error.status === 403) {
      this.errorMessage.set(
        'You do not have permission to access this dashboard.'
      );
    } else if (error.status === 404) {
      this.errorMessage.set(
        error.error?.message ?? 'No circle or dashboard data was found.'
      );
    } else if (error.status === 0) {
      this.errorMessage.set(
        'Cannot connect to the API. Make sure your backend is running on port 5034.'
      );
    } else {
      this.errorMessage.set(
        error.error?.message ??
        error.error?.title ??
        'Something went wrong while loading the dashboard.'
      );
    }
  }
}