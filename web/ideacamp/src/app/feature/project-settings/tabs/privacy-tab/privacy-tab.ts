import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ProjectResponse } from '../../../../models/project.model';
import { ProjectService } from '../../../project-site/project.service';

@Component({
  selector: 'app-privacy-tab',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './privacy-tab.html',
})
export class PrivacyTab implements OnInit {
  @Input() project!: ProjectResponse;

  private readonly projectService = inject(ProjectService);

  isPublic = signal(true);
  joinRequestsAllowed = signal(true);
  isSaving = signal(false);

  private originalIsPublic = true;
  private originalJoinRequestsAllowed = true;

  hasChanges = computed(
    () =>
      this.isPublic() !== this.originalIsPublic ||
      this.joinRequestsAllowed() !== this.originalJoinRequestsAllowed,
  );

  ngOnInit(): void {
    this.originalIsPublic = !this.project.isPrivateProject;
    this.originalJoinRequestsAllowed = this.project.allowJoinRequests;
    this.isPublic.set(this.originalIsPublic);
    this.joinRequestsAllowed.set(this.originalJoinRequestsAllowed);
  }

  togglePublicVisibility(): void {
    this.isPublic.set(!this.isPublic());
  }

  toggleAllowJoinRequests(): void {
    this.joinRequestsAllowed.set(!this.joinRequestsAllowed());
  }

  saveSettings(): void {
    if (!this.hasChanges() || this.isSaving()) return;

    this.isSaving.set(true);

    const calls: Observable<ProjectResponse>[] = [];

    if (this.isPublic() !== this.originalIsPublic) {
      calls.push(
        this.projectService.updateProject(this.project.id, {
          name: this.project.name,
          description: this.project.description,
          shortDescription: this.project.shortDescription ?? undefined,
          projectUrl: this.project.projectUrl,
          isPrivateProject: !this.isPublic(),
        }),
      );
    }

    if (this.joinRequestsAllowed() !== this.originalJoinRequestsAllowed) {
      calls.push(
        this.projectService.updateAllowJoinRequests(
          this.project.id,
          this.joinRequestsAllowed(),
        ),
      );
    }

    forkJoin(calls).pipe(
      finalize(() => this.isSaving.set(false)),
    ).subscribe({
      next: () => {
        this.originalIsPublic = this.isPublic();
        this.originalJoinRequestsAllowed = this.joinRequestsAllowed();
      },
      error: () => {
        this.isPublic.set(this.originalIsPublic);
        this.joinRequestsAllowed.set(this.originalJoinRequestsAllowed);
      },
    });
  }
}
