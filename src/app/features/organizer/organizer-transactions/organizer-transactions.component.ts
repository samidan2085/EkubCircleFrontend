import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CircleService, MemberTransaction } from
  '../../../services/circle.service';

@Component({
  selector: 'app-organizer-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-transactions.component.html',
  styleUrl:'./organizer-transactions.component.scss'
})
export class OrganizerTransactionsComponent implements OnInit {
  private readonly circleService = inject(CircleService);

  readonly transactions = signal<MemberTransaction[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.circleService.getMyCircle().subscribe({
      next: (circle) => {
        const circleId = circle.circleId ?? circle.circleId;

        if (!circleId) {
          this.isLoading.set(false);
          this.errorMessage.set('Circle ID was not returned by the API.');
          return;
        }

        this.loadTransactions(circleId);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Could not load your circle.');
      }
    });
  }

  private loadTransactions(circleId: string): void {
    this.circleService.getTransactions(circleId).subscribe({
      next: (items) => {
        this.transactions.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load transactions.');
        this.isLoading.set(false);
      }
    });
  }
}