import { Routes } from '@angular/router';
import {UserProfile} from './pages/user-profile/user-profile';
import {Impressum} from '../pages/impressum/impressum';

export const routes: Routes = [
  {path: 'profile', component: UserProfile}
  {path: 'impressum',component: Impressum}
];
