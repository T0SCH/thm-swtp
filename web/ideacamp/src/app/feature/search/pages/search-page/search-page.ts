import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { z } from 'zod';
import { SearchService } from '../../services/search.service';
import { ProjectSearchResult } from '../../models/project-search-result.model';
import { UserSearchResult } from '../../models/user-search-result.model';
import { ProjectResultCard } from '../../components/project-result-card/project-result-card';
import { UserResultCard } from '../../components/user-result-card/user-result-card';

type Tab = 'projects' | 'users';

const SearchInputSchema = z
  .string()
  .regex(/^[a-zA-ZäöüÄÖÜß0-9 ]*$/, { message: 'Only letters and numbers allowed!' })
  .refine(value => value.length === 0 || !value.startsWith(' '), {
    message: 'Search cannot start with a space.',
  });

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [FormsModule, ProjectResultCard, UserResultCard],
  templateUrl: './search-page.html',
})
export class SearchPage implements OnDestroy {
  private readonly searchService = inject(SearchService);
  private readonly destroy$ = new Subject<void>();

  searchTerm = '';
  activeTab: Tab = 'projects';
  errorMessage = '';

  projects: ProjectSearchResult[] = [];
  users: UserSearchResult[] = [];
  isLoading = false;

  setTab(tab: Tab): void {
    this.activeTab = tab;
  }

  onSearchChange(): void {
    const result = SearchInputSchema.safeParse(this.searchTerm);

    if (!result.success) {
      this.errorMessage = result.error.issues[0]?.message ?? 'Invalid input.';
      this.projects = [];
      this.users = [];
      return;
    }

    this.errorMessage = '';
    const query = result.data.trim();

    if (query === '') {
      this.projects = [];
      this.users = [];
      return;
    }

    this.isLoading = true;

    forkJoin({
      projects: this.searchService.searchProjects(query),
      users: this.searchService.searchUsers(query),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ projects, users }) => {
          this.projects = projects;
          this.users = users;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Search failed. Please try again.';
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
