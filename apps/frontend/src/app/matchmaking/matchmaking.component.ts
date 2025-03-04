import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../_shared/services/user-service.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatchMakingService } from '../_shared/services/matchmaking.service';
import { DurationPipe } from '../_shared/pipes/duration.pipe';
import { User } from '@repo/types/user';

@Component({
  selector: 'app-matchmaking',
  imports: [RouterModule, CommonModule, DurationPipe],
  templateUrl: './matchmaking.component.html',
})
export class MatchmakingComponent implements OnInit {
  userService = inject(UserService);
  matchMakingService = inject(MatchMakingService);
  router = inject(Router);

  user!: User;
  matchmakingIntervalId!: number;
  matchmakingTimer = 0;
  findingMatch = false;

  ngOnInit(): void {
    // if the user is not logged in, redirect to the join page
    this.userService.user$.subscribe((user) => {
      if (user !== null) {
        this.user = user;
        return;
      }
      this.router.navigate(['/join']);
    });

    // reset matchmaking if the user misses the match
    this.matchMakingService.matchFound$.subscribe((match) => {
      if (!match) {
        this.resetMatchmaking();
      }
    });
  }

  findMatch() {
    this.resetMatchmaking();
    this.matchMakingService.findMatch(this.user);
    this.findingMatch = true;
    this.matchmakingIntervalId = window.setInterval(() => {
      this.matchmakingTimer++;
    }, 1000);
  }

  cancelMatchmaking() {
    this.matchMakingService.cancelMatchmaking(this.user);
    this.resetMatchmaking();
  }

  acceptMatch(matchId: string) {
    this.matchMakingService.acceptMatch(matchId, this.user);
  }

  disconnect() {
    this.userService.leave();
  }

  private resetMatchmaking() {
    this.findingMatch = false;
    clearInterval(this.matchmakingIntervalId);
    this.matchmakingTimer = 0;
  }
}
