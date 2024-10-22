import { registerLocaleData } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import ru from '@angular/common/locales/ru';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { provideHighlightOptions } from 'ngx-highlightjs';

import { routes } from './app.routes';
import storeStatesConfig from './store-states.config';

registerLocaleData(ru);

export const appConfig = {
  providers: [
    importProvidersFrom([
      HttpClient,
      BrowserAnimationsModule,
      NgxsModule.forRoot(storeStatesConfig, {
        developmentMode: true,
      }),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      NgxsStoragePluginModule.forRoot({
        keys: '*',
      }),
      // NgxsFormPluginModule.forRoot(),
    ]),
    provideRouter(routes,
      withPreloading(PreloadAllModules),
    ),
    provideHttpClient(),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
    }),
  ],
};
