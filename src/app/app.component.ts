import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { definePreset } from 'primeng/themes';
import { Nora } from 'primeng/themes/nora';

import { AppConfigService } from '@shared/model/app-config/app-config.service';
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private appService = inject(AppConfigService);

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
            // 50: 'hsl(from var(--primary) h s calc(l - 50)',
            // 100: 'hsl(from var(--primary) h s calc(l - 40)',
            // 200: 'hsl(from var(--primary) h s calc(l - 30)',
            // 300: 'hsl(from var(--primary) h s calc(l - 20)',
            // 400: 'hsl(from var(--primary) h s calc(l - 10)',
            500: 'var(--primary)',
            600: 'hsl(from var(--primary) h s calc(l + 10))',
            700: 'hsl(from var(--primary) h s calc(l + 20))',
            800: 'hsl(from var(--primary) h s calc(l + 30))',
            900: 'hsl(from var(--primary) h s calc(l + 40))',
            950: 'hsl(from var(--primary) h s calc(l + 50))',
          },
          colorScheme: {
            light: {
              // primary: {
              //   color: 'var(--primary)',
              //   inverseColor: '#ffffff',
              //   hoverColor: 'var(--highlight-color)',
              //   activeColor: 'var(--active-background)',
              // },
              // // highlight: {
              // //   background: 'var(--background)',
              // //   focusBackground: 'var(--foreground)',
              // //   color: '#ffffff',
              // //   focusColor: '#ffffff',
              // // },
            },
            dark: {
              // primary: {
              //   color: 'var(--primary)',
              //   inverseColor: '{purple.950}',
              //   hoverColor: '{purple.500}',
              //   activeColor: '{purple.300}',
              // },
              // // highlight: {
              // //   background: 'var(--background)',
              // //   focusBackground: 'var(--foreground)',
              // //   color: 'rgba(255,255,255,.87)',
              // //   focusColor: 'rgba(255,255,255,.87)',
              // // },
            },
          },
        },
        components: {
          select: {
            root: {
              borderColor: 'var(--border)',
            },
          },
          multiselect: {
            root: {
              borderColor: 'var(--border)',
            },
          },
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
          scrollpanel: {
            bar: {
              size: '.4em',
            },
          },
        },
      }),

      options: {
        darkModeSelector: '.p-dark',
      },
    });
  }
}
