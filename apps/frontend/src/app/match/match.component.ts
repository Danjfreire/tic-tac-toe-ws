import { Component, inject, OnInit } from '@angular/core';
import { MatchService } from '../_shared/services/match.service';
import { MatchState } from '@repo/types/match';
import { DurationPipe } from '../_shared/pipes/duration.pipe';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-match',
  imports: [DurationPipe, RouterModule],
  templateUrl: './match.component.html',
})
export class MatchComponent implements OnInit {
  private matchService = inject(MatchService);
  private router = inject(Router);

  match!: MatchState;
  timer = 60 * 5; // 5 minutes
  timerInterval!: number;

  ngOnInit(): void {
    const activeMatch = this.matchService.getMatch();

    if (!activeMatch) {
      this.router.navigate(['/matchmaking']);
      return;
    }

    this.match = activeMatch;
    this.timerInterval = window.setInterval(() => {
      if (this.timer <= 0) {
        // end match
      }

      this.timer -= 1;
    }, 1000);
  }
}
