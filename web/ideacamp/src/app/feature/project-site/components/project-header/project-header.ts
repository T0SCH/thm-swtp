import { Component, Input } from '@angular/core';
import { ProjectResponse } from '../../../../models/project.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-header.html'
})
export class ProjectHeader {
  @Input({ required: true }) project!: ProjectResponse;
  @Input() isOwner = false;
}
