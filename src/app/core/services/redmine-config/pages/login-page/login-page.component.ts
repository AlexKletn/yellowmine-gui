import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SetTokenAction } from '../../store/actions/setToken.action';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Router } from '@angular/router';

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
