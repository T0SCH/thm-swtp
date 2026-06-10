import { Injectable, signal } from '@angular/core';
import { ProjectResponse } from '../../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectSettingsStore {
  project = signal<ProjectResponse | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  setProject(data: ProjectResponse): void {
    this.project.set(data);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(error: string | null): void {
    this.errorMessage.set(error);
  }
}
