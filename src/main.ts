import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import 'dayjs/locale/ru.js';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
