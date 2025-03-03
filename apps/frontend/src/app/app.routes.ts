import { Routes } from '@angular/router';
import { JoinComponent } from './join/join.component';

export const routes: Routes = [
  {
    path: 'join',
    component: JoinComponent,
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
