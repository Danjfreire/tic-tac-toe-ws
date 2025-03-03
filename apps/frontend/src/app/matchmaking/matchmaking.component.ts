import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../_shared/user-service.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matchmaking',
  imports: [RouterModule, CommonModule],
  templateUrl: './matchmaking.component.html',
})
export class MatchmakingComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router);

  onlineUsers = 0;

  ngOnInit(): void {
    // if the user is not logged in, redirect to the join page
    this.userService.user$.subscribe((user) => {
      if (user === null) {
        this.router.navigate(['/join']);
      }
    });
  }
}
