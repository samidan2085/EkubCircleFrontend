import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { finalize } from 'rxjs/operators';

import {
  CircleMember,
  CircleService
} from '../../../services/circle.service';

@Component({
  selector: 'app-organizer-members',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl:'./add-member.component.html',
  styleUrl: './add-member.component.scss'
})
export class  AddMemberComponent implements OnInit {
  private readonly circleService = inject(CircleService);
  private readonly fb = inject(FormBuilder);

  readonly circleId = signal('');
  readonly circleStatus = signal('');
  readonly members = signal<CircleMember[]>([]);
  readonly isLoading = signal(true);
  readonly isAdding = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly memberForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    temporaryPassword: ['', [
      Validators.required,
      Validators.minLength(8)
    ]]
  });

  ngOnInit(): void {
    this.loadCircle();
  }

  loadCircle(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.circleService.getMyCircle()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (circle) => {
          const id = circle.circleId ?? circle.circleId;

          if (!id) {
            this.errorMessage.set(
              'The API did not return a circle ID.'
            );
            return;
          }

          this.circleId.set(id);
          this.circleStatus.set(circle.status ?? '');

          this.loadMembers();
        },
        error: () => {
          this.errorMessage.set(
            'Could not load your circle. Please sign in as an Organizer.'
          );
        }
      });
  }

  loadMembers(): void {
    const id = this.circleId();

    if (!id) return;

    this.circleService.getMembers(id).subscribe({
      next: (members) => this.members.set(members),
      error: () => {
        this.errorMessage.set('Could not load circle members.');
      }
    });
  }

  addMember(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }

    if (this.circleStatus().toLowerCase() !== 'forming') {
      this.errorMessage.set(
        'You can only add members while the circle is forming.'
      );
      return;
    }

    const id = this.circleId();

    if (!id) {
      this.errorMessage.set('Circle ID is missing.');
      return;
    }

    this.isAdding.set(true);

    this.circleService.addMember(id, {
      name: this.memberForm.controls.name.value.trim(),
      email: this.memberForm.controls.email.value.trim(),
      temporaryPassword:
        this.memberForm.controls.temporaryPassword.value
    })
    .pipe(finalize(() => this.isAdding.set(false)))
    .subscribe({
      next: () => {
        this.successMessage.set('Member added successfully.');
        this.memberForm.reset();
        this.loadMembers();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ??
          error.error?.title ??
          'Failed to add member. Check the details and try again.'
        );
      }
    });
  }
}