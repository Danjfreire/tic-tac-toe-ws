import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../_shared/user-service.service';
import { WebsocketService } from '../_shared/websocket.service';

@Component({
  selector: 'app-join',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './join.component.html',
})
export class JoinComponent implements OnInit {
  userService = inject(UserService);
  wsService = inject(WebsocketService);
  router = inject(Router);

  name = '';

  ngOnInit(): void {
    // Wait for the user to join before navigating to the matchmaking page
    this.userService.user$.subscribe((user) => {
      if (user != null) {
        this.router.navigate(['/matchmaking']);
      }
    });
  }

  public join() {
    if (this.name.length === 0) return;
    this.userService.join(this.name);
  }
}
