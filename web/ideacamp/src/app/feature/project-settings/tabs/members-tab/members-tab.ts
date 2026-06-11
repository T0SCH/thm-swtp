import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectMember, ProjectMemberResponse } from '../../models/project-settings.model';
import { ProjectSettingsService } from '../../services/project-settings.service';
import { ProjectSettingsStore } from '../../project-settings.store';
import { UserSearchPick } from '../../../../shared/user-search-pick/user-search-pick';
import { UserSearchResult } from '../../../search/models/user-search-result.model';

@Component({
  selector: 'app-members-tab',
  standalone: true,
  imports: [NgClass, FormsModule, UserSearchPick],
  templateUrl: './members-tab.html',
})
export class MembersTab implements OnInit {
  private readonly store = inject(ProjectSettingsStore);
  private readonly projectSettingsService = inject(ProjectSettingsService);

  members = signal<ProjectMember[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  isDeleting = signal(false);

  memberToRemove = signal<ProjectMember | null>(null);

  isInviteModalOpen = signal(false);
  selectedUserToInvite = signal<UserSearchResult | null>(null);
  inviteMessage = signal('');
  isInviting = signal(false);
  inviteErrorMessage = signal<string | null>(null);
  inviteSuccessMessage = signal<string | null>(null);

  pendingInvitedUserIds = signal<string[]>([]);

  excludedUserIds = computed(() => {
    const project = this.store.project();
    if (!project) return [];
    return [project.ownerId,
      ...this.members().map((mem) => mem.id),
      ...this.pendingInvitedUserIds()];
  });

  ngOnInit(): void {
    const projectId = this.store.project()?.id;
    if (!projectId) return;
    this.loadMembers();
    this.loadUserIdPendingInvites();
  }

  openRemoveModal(member: ProjectMember): void {
    this.memberToRemove.set(member);
  }

  closeRemoveModal(): void {
    this.memberToRemove.set(null);
  }

  confirmRemove(): void {
    const member = this.memberToRemove();
    const projectId = this.store.project()?.id;
    if (!member || !projectId || member.role === 'Owner') return;

    this.isDeleting.set(true);
    this.errorMessage.set(null);

    this.projectSettingsService.deleteProjectMember(projectId, member.id).subscribe({
      next: () => {
        this.members.update((list) => list.filter((mem) => mem.id !== member.id));
        this.memberToRemove.set(null);
        this.isDeleting.set(false);
      },
      error: () => {
        this.errorMessage.set('Mitglied konnte nicht gelöscht werden. Bitte versuchen Sie es gleich nochmal.');
        this.isDeleting.set(false);
      },
    });
  }

  openInviteModal(): void {
    this.isInviteModalOpen.set(true);
    this.inviteMessage.set('');
    this.inviteErrorMessage.set(null);
    this.inviteSuccessMessage.set(null);
    this.selectedUserToInvite.set(null);
  }

  closeInviteModal(): void {
    if (this.isInviting()) {
      return;
    }
    this.isInviteModalOpen.set(false);
    this.inviteMessage.set('');
    this.inviteErrorMessage.set(null);
    this.selectedUserToInvite.set(null);
  }

  selectUserToInvite(user: UserSearchResult): void {
    this.selectedUserToInvite.set(user);
  }

  inviteSelectedUser(): void {
    const user = this.selectedUserToInvite();
    const projectId = this.store.project()?.id;

    if (!user || !projectId || this.isInviting()) {
      return;
    }

    this.isInviting.set(true);
    this.inviteErrorMessage.set(null);

    this.projectSettingsService.createProjectInvite(projectId, {
      invitedUserId: user.keycloakId,
      message: this.inviteMessage().trim() || undefined,
    })
      .subscribe({
        next: () => {
          this.inviteSuccessMessage.set(`Einladung wurde erfolgreich an ${user.username} gesendet.`);
          this.pendingInvitedUserIds.update((ids) => [...ids, user.keycloakId]);
          this.isInviting.set(false);
          this.closeInviteModal();

          setTimeout(() => {
            this.inviteSuccessMessage.set(null)
          }, 5000);
        },
        error: () => {
          this.inviteErrorMessage.set('Einladung konnte nicht erstellt werden, bitte versuchen Sie es erneut.');
          this.isInviting.set(false);
        },
      });
  }

  private loadMembers(): void {
    const projectId = this.store.project()?.id;
    if (!projectId) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.projectSettingsService.getProjectMembers(projectId).subscribe({
      next: (members) => {
        this.members.set(members.map((member) => this.toProjectMember(member)));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Mitglieder konnten nicht geladen werden. Bitte versuchen sie es später nochmal.');
        this.isLoading.set(false);
      },
    });
  }

  private loadUserIdPendingInvites(): void {
    const projectId = this.store.project()?.id;
    if (!projectId) return;

    this.projectSettingsService.getProjectInvites(projectId).subscribe({
      next: (invites) => {
        this.pendingInvitedUserIds.set(
          invites
            .filter((invite) => invite.status === 'PENDING')
            .map((invite) => invite.invitedUserId),
        );
      },
      error: () => {
        this.pendingInvitedUserIds.set([]);
      }
    });
  }

  private toProjectMember(member: ProjectMemberResponse): ProjectMember {
    return {
      id: member.keycloakId,
      name: member.username,
      email: member.email,
      initials: this.getInitials(member.username),
      avatarColor: this.getAvatarColor(member.username),
      role: 'Member',
    }
  }

  private getInitials(name: string): string {
    return name.slice(0, 2).toUpperCase();
  }

  private getAvatarColor(val: string): string {
    const colors = ['bg-lime-500', 'bg-slate-500', 'bg-rose-500', 'bg-blue-500', 'bg-violet-500'];
    const index = val.length % colors.length;
    return colors[index];
  }
}
