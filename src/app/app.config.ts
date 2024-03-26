import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import storeStatesConfig from './store-states.config';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

export const appConfig = {
  providers: [
    importProvidersFrom([
      HttpClient,
      BrowserAnimationsModule,
      NgxsModule.forRoot(storeStatesConfig, {
        developmentMode: true,
      }),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      NgxsStoragePluginModule.forRoot(),
      NgxsFormPluginModule.forRoot(),
    ]),
    provideRouter(routes),
    // provideClientHydration(),
    provideHttpClient(),
  ],
};
