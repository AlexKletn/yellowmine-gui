import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { Ripple } from 'primeng/ripple';

import { RedmineConfigService } from '@shared/model/redmine-config';
import { PagePanelComponent } from '@shared/ui/page-panel/page-panel.component';

@Component({
  selector: 'ym-login-page',
  standalone: true,
  imports: [
    PanelModule,
    PagePanelComponent,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    Ripple,
    FormsModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private redmineUrl = this.configService.getRedmineUrl;
  private router = inject(Router);

  redmineApiKeyUrl = computed(() => `${this.redmineUrl()}/my/account`);

  apiKeyModel = signal('');

  apiKeyLengthLabel = computed(() => `${this.apiKeyModel().length}/40`);
  saveDisabled = computed(() => this.apiKeyModel().length !== 40);

  constructor(
    private configService: RedmineConfigService,
  ) {
  }

  saveApiKey() {
    this.configService.saveApiKey(this.apiKeyModel());
    this.router.navigate(['/issues']);
  }
}
