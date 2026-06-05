import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../enviroments/enviroment.dev';

@Injectable({ providedIn: 'root' })
export class ProjectFavoriteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/v1/users/me/favorites`;

  isFavorited(projectId: string): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/${projectId}`, { observe: 'response' }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  addFavorite(projectId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${projectId}`, null);
  }

  removeFavorite(projectId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${projectId}`);
  }
}
