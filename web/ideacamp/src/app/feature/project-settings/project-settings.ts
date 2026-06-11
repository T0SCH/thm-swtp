import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ProjectService } from '../project-site/project.service';
import { AuthService } from '../auth/auth.service';
import { ProjectSettingsStore } from './project-settings.store';
import { JoinRequestsTab } from './tabs/join-requests-tab/join-requests-tab';
import { MembersTab } from './tabs/members-tab/members-tab';
import { PrivacyTab } from './tabs/privacy-tab/privacy-tab';
import { DangerZoneTab } from './tabs/danger-zone-tab/danger-zone-tab';

type Tab = 'join-requests' | 'members' | 'privacy' | 'danger-zone';

@Component({
  selector: 'app-project-settings',
  standalone: true,
  imports: [NgClass, RouterLink, JoinRequestsTab, MembersTab, PrivacyTab, DangerZoneTab],
  templateUrl: './project-settings.html',
})
export class ProjectSettings implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  readonly store = inject(ProjectSettingsStore);

  activeTab = signal<Tab>('join-requests');

  readonly tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'join-requests', label: 'Beitrittsanfragen', icon: 'pi-user-plus' },
    { id: 'members',       label: 'Mitglieder',       icon: 'pi-user'      },
    { id: 'privacy',       label: 'Privatsphäre',      icon: 'pi-lock'      },
    { id: 'danger-zone',   label: 'Projekt Löschen',   icon: 'pi-trash'     },
  ];

  ngOnInit(): void {
    const projectUrl = this.route.snapshot.paramMap.get('projectUrl');
    if (!projectUrl) {
      this.store.setError('Keine Projekt URL gegeben.');
      this.store.setLoading(false);
      return;
    }

    this.projectService.getProjectByUrl(projectUrl).subscribe({
      next: (data) => {
        const user = this.authService.user();
        if (!user || user.id !== data.ownerId) {
          this.router.navigateByUrl(`/project/${data.projectUrl}`);
          return;
        }
        this.store.setProject(data);
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setError('Projekt konnte nicht geladen werden.');
        this.store.setLoading(false);
      },
    });
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }
}
