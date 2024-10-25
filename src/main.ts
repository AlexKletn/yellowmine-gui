/// <reference types="@angular/localize" />

import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from '@app/app.component';
import { appConfig } from '@app/app.config';

import 'dayjs/locale/ru.js';

registerLocaleData(ru);
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
