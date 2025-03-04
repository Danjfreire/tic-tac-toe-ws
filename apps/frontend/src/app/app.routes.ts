import { Routes } from '@angular/router';
import { JoinComponent } from './join/join.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { MatchComponent } from './match/match.component';

export const routes: Routes = [
  {
    path: 'join',
    component: JoinComponent,
  },
  {
    path: 'matchmaking',
    component: MatchmakingComponent,
  },
  {
    path: 'match',
    component: MatchComponent,
  },
  {
    path: '',
    redirectTo: 'join',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'join',
    pathMatch: 'full',
  },
];
