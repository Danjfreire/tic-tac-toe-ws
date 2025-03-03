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
  intervalId!: number;
  matchmakingTimer = 0;
  findingMatch = false;
  onlineUsers = 0;

  ngOnInit(): void {
    // if the user is not logged in, redirect to the join page
    this.userService.user$.subscribe((user) => {
      if (user !== null) {
        this.user = user;
        return;
      }
      this.router.navigate(['/join']);
    });
  }

  findMatch() {
    this.matchMakingService.findMatch(this.user);
    this.findingMatch = true;
    this.intervalId = window.setInterval(() => {
      this.matchmakingTimer++;
    }, 1000);
  }

  cancelMatchmaking() {
    this.findingMatch = false;
    clearInterval(this.intervalId);
    this.matchmakingTimer = 0;
    this.matchMakingService.cancelMatchmaking(this.user);
  }

  disconnect() {
    this.userService.leave();
  }
}
