import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { ProjectFavoriteService } from '../../services/project-favorite.service';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  templateUrl: './favorite-button.html',
})
export class FavoriteButton implements OnInit {
  @Input({ required: true }) projectId!: string;

  private readonly favoriteService = inject(ProjectFavoriteService);

  favorited = signal(false);
  loading = signal(true);

  ngOnInit(): void {
    this.favoriteService.isFavorited(this.projectId).subscribe(v => {
      this.favorited.set(v);
      this.loading.set(false);
    });
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const previous = this.favorited();
    this.favorited.set(!previous);

    const action$ = previous
      ? this.favoriteService.removeFavorite(this.projectId)
      : this.favoriteService.addFavorite(this.projectId);

    action$.subscribe({ error: () => this.favorited.set(previous) });
  }
}
