import { Routes } from '@angular/router';
import { SearchPage } from './feature/search/pages/search-page/search-page';
import {UserProfile} from './feature/user-profile/pages/user-profile/user-profile';
import {Impressum} from './feature/legal-notice/pages/impressum';
import {ContactRequests} from './feature/contact-request/pages/contact-requests/contact-requests';
import { ProjectSite } from './feature/project-site/project-site';
import { SuccessComponent } from './feature/auth/success/success.component';
import { authGuard } from './feature/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'impressum', pathMatch: 'full' },
  { path: 'success', component: SuccessComponent },
  {path: 'profile', component: UserProfile},
  {path: 'impressum',component: Impressum},
  {path:'contact-requests', component: ContactRequests},
  {path: 'search', component: SearchPage, canActivate: [authGuard]},
  {path: 'project',component: ProjectSite}
];
