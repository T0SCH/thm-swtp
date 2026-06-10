import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectSettingsService } from '../../services/project-settings.service';
import { ProjectSettingsStore } from '../../project-settings.store';

@Component({
  selector: 'app-danger-zone-tab',
  standalone: true,
  imports: [],
  templateUrl: './danger-zone-tab.html',
})
export class DangerZoneTab {
  private readonly store = inject(ProjectSettingsStore);
  private readonly settingsService = inject(ProjectSettingsService);
  private readonly router = inject(Router);

  showDeleteModal = signal(false);
  deleteConfirmInput = signal('');
  isDeleting = signal(false);
  deleteError = signal<string | null>(null);

  projectName = computed(() => this.store.project()?.name ?? '');
  projectId = computed(() => this.store.project()?.id ?? '');

  deleteEnabled = computed(() => this.deleteConfirmInput() === this.projectName());

  openDeleteModal(): void {
    this.deleteConfirmInput.set('');
    this.deleteError.set(null);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deleteConfirmInput.set('');
    this.deleteError.set(null);
  }

  confirmDelete(): void {
    if (!this.deleteEnabled() || this.isDeleting()) return;
    this.isDeleting.set(true);
    this.settingsService.deleteProject(this.projectId()).subscribe({
      next: () => this.router.navigateByUrl('/my-projects'),
      error: () => {
        this.deleteError.set('Projekt konnte nicht gelöscht werden.');
        this.isDeleting.set(false);
      },
    });
  }
}
