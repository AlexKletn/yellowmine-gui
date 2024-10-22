import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';

import { SetTokenAction } from '@shared/model/redmine-config/store/actions/setToken.action';

@Component({
  selector: 'rm-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PanelModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private store = inject(Store);
  private router = inject(Router);

  form = new FormGroup({
    api_key: new FormControl<string>(''),
  });

  submit() {
    this.store.dispatch(new SetTokenAction(this.form.value.api_key!));

    this.router.navigate(['/projects']);
  }
}
