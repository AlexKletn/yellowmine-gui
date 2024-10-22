import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { definePreset } from 'primeng/themes';
import { Nora } from 'primeng/themes/nora';

import { HeaderComponent } from '@shared/ui/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private config: PrimeNGConfig,
  ) {
    this.config.ripple.set(true);
    this.config.theme.set({
      preset: definePreset(Nora, {
        primitive: {
          borderRadius: {
            none: '0',
            xs: '0',
            sm: '0',
            md: '0',
            lg: '0',
            xl: '0',
          },
        },
        semantic: {
          transitionDuration: '.5s',
          primary: {
            50: '{purple.50}',
            100: '{purple.100}',
            200: '{purple.200}',
            300: '{purple.300}',
            400: '{purple.400}',
            500: '{purple.500}',
            600: '{purple.600}',
            700: '{purple.700}',
            800: '{purple.800}',
            900: '{purple.900}',
            950: '{purple.950}',
          },
          colorScheme: {
            light: {
              primary: {
                color: 'var(--primary)',
                inverseColor: '#ffffff',
                hoverColor: '{purple.900}',
                activeColor: '{purple.800}',
              },
              highlight: {
                background: 'var(--background)',
                focusBackground: 'var(--foreground)',
                color: '#ffffff',
                focusColor: '#ffffff',
              },
            },
            dark: {
              primary: {
                color: 'var(--primary)',
                inverseColor: '{purple.950}',
                hoverColor: '{purple.500}',
                activeColor: '{purple.300}',
              },
              highlight: {
                background: 'var(--background)',
                focusBackground: 'var(--foreground)',
                color: 'rgba(255,255,255,.87)',
                focusColor: 'rgba(255,255,255,.87)',
              },
            },
          },
        },
        components: {
          image: {
            preview: {
              icon: {
                size: '1em',
              },
              mask: {
                background: 'unset',
                color: 'var(--primary-content)',
              },
            },
            toolbar: {
              position: {
                left: 'calc(100vw / 2 - 50%)',
                right: 'auto',
                top: 'auto',
                bottom: '2em',
              },
              blur: '0',
              background: 'var(--background)',
              borderColor: 'var(--border)',
              borderWidth: '.125em',
              padding: '0',
              gap: '0',
            },
            action: {
              color: 'var(--primary-content)',
              hoverColor: 'var(--primary-content)',
              hoverBackground: 'var(--highlight-color)',
              size: '3em',
              iconSize: '1em',
            },
          },
        },
        options: {
          darkModeSelector: '.my-app-dark',
        },
      }),
    });
  }
}
