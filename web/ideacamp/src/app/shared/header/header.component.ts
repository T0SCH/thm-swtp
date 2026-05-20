import { Component } from '@angular/core';
import { LogoComponent } from './logo/logo.component';
import { FeatureComponent } from './feature/feature.component';

@Component({
  selector: 'app-header',
  imports: [LogoComponent, FeatureComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
