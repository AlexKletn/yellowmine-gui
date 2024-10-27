import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

import { RedmineConfigService } from '@shared/model/redmine-config';

@Component({
  selector: 'ym-logout-button',
  standalone: true,
  imports: [
    ButtonModule,
    Ripple,
  ],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss',
})
export class LogoutButtonComponent {
  private redmineConfig = inject(RedmineConfigService);
  private router = inject(Router);

  logout() {
    this.redmineConfig.logout();
    this.router.navigate(['/']);
  }
}
