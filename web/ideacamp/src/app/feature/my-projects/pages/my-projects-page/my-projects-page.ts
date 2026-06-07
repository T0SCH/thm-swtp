import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MyProjectsService } from '../../services/my-projects.service';
import { ProjectResponse } from '../../../../models/project.model';
import { AuthService } from '../../../auth/auth.service';
import { FavoriteButton } from '../../../../shared/favorite-button/favorite-button';
import { SearchService } from '../../../search/services/search.service';
import { DestroyRef } from '@angular/core';
import { environment } from '../../../../enviroments/enviroment.dev';

@Component({
  selector: 'app-my-projects-page',
  standalone: true,
  imports: [RouterLink, FavoriteButton],
  templateUrl: './my-projects-page.html',
  styles: [`
    @keyframes fadeSlideIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .project-card-animate {
      animation: fadeSlideIn 0.3s ease-out both;
    }
  `],
})
export class MyProjectsPage implements OnInit {
  private readonly myProjectsService = inject(MyProjectsService);
  private readonly authService = inject(AuthService);
  private readonly searchService = inject(SearchService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);

  readonly projects = signal<ProjectResponse[]>([]);
  readonly isLoading = signal(true);
  readonly isFiltering = signal(false);
  readonly errorMessage = signal('');
  readonly projectTags = signal<Map<string, string[]>>(new Map());
  readonly invitationsExpanded = signal(false);
  readonly activeFilter = signal<'my' | 'all'>('my');

  async ngOnInit(): Promise<void> {
    await this.authService.waitUntilAuthReady();
    this.loadProjects();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() ?? '')
      .join('');
  }

  getAvatarColor(name: string): string {
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500',
      'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-teal-500',
    ];
    let hash = 0;
    for (const char of name) {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getTagsForProject(projectId: string): string[] {
    return this.projectTags().get(projectId) ?? [];
  }

  toggleInvitations(): void {
    this.invitationsExpanded.update(v => !v);
  }

  setFilter(filter: 'my' | 'all'): void {
    if (this.activeFilter() === filter) return;
    this.activeFilter.set(filter);
    this.projects.set([]);
    this.isFiltering.set(true);
    this.errorMessage.set('');
    setTimeout(() => this.loadProjects(true));
  }

  private loadProjects(isFilterSwitch = false): void {
    const username = this.authService.username();

    if (!username) {
      this.errorMessage.set('Dein Benutzername konnte nicht geladen werden.');
      this.isLoading.set(false);
      this.isFiltering.set(false);
      return;
    }

    if (!isFilterSwitch) {
      this.isLoading.set(true);
    }
    this.errorMessage.set('');

    const onNext = (projects: ProjectResponse[]) => {
      this.projects.set(projects);
      this.isLoading.set(false);
      this.isFiltering.set(false);
      this.loadAllTags(projects);
    };

    const onError = () => {
      this.errorMessage.set('Deine Projekte konnten nicht geladen werden.');
      this.isLoading.set(false);
      this.isFiltering.set(false);
    };

    if (this.activeFilter() === 'all') {
      this.http.get<ProjectResponse[]>(`${environment.apiUrl}/users/${encodeURIComponent(username)}/projects/all`).subscribe({ next: onNext, error: onError });
    } else {
      this.myProjectsService.getMyProjects(username).subscribe({ next: onNext, error: onError });
    }
  }

  private loadAllTags(projects: ProjectResponse[]): void {
    const current = this.projectTags();
    for (const project of projects) {
      if (current.has(project.id)) {
        continue;
      }
      const sub = this.searchService.getProjectTags(project.id).subscribe({
        next: tags => {
          this.projectTags.update(map => {
            const newMap = new Map(map);
            newMap.set(project.id, tags);
            return newMap;
          });
        },
      });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    }
  }
}



