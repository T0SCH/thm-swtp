import { Component, inject, OnInit,signal} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ProjectService} from './project.service';
import {ProjectResponse} from './models/project.model';
import { ProjectHeader } from './components/project-header/project-header';
import { InfoCard } from './components/info-card/info-card';
import { OpenPositionCard } from './components/open-position-card/open-position-card';
import { ProjectSidebar } from './components/project-sidebar/project-sidebar';

@Component({
  selector: 'app-project-site',
  standalone: true,
  imports: [ProjectHeader, InfoCard, OpenPositionCard, ProjectSidebar],
  templateUrl: './project-site.html',
})
export class ProjectSite {
  private readonly route = inject(ActivatedRoute);
  private readonly projectService = inject(ProjectService);

  project = signal<ProjectResponse | null>(null);
  errorMessage = signal<string | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.errorMessage.set("Keine Projekt-ID angegeben.");
      this.isLoading.set(false);
      return;
    }

    this.projectService.getProject(id).subscribe({
      next: (data) => {
        this.project.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set("Projektdaten konnten nicht abgerufen werden.");
        this.isLoading.set(false);
      },
    });
  }
}
