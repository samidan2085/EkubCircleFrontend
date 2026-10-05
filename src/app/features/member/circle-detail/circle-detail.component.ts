import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-circle-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './circle-detail.component.html',
  styleUrls: ['./circle-detail.component.scss']
})
export class CircleDetailComponent implements OnInit {
  circleId: string | null = null;

  // Mock data matching Item 35 blueprint specs
  circleData = {
    name: 'Addis Community Circle',
    contribution: 5000,
    currentRound: 3,
    totalMembers: 10,
    myPaymentStatus: 'Paid', // or 'Not Paid'
    myPotStatus: 'Not Received Yet', // or 'Already Received'
    currentRoundDetails: {
      roundNumber: 3,
      receiver: 'Alemayehu Tadesse',
      currentPot: 50000
    },
    members: [
      { name: 'Dawit Bekele', receivedStatus: 'Received (Round 1)' },
      { name: 'Sara Ahmed', receivedStatus: 'Received (Round 2)' },
      { name: 'Alemayehu Tadesse', receivedStatus: 'Scheduled (Current)' },
      { name: 'Tigest Mulugeta', receivedStatus: 'Pending' }
    ],
    pastRounds: [
      { roundNumber: 1, receiver: 'Dawit Bekele', status: 'Completed' },
      { roundNumber: 2, receiver: 'Sara Ahmed', status: 'Completed' }
    ]
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.circleId = this.route.snapshot.paramMap.get('id');
  }
}