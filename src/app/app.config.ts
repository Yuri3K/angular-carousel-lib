import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NGX_CAROUSEL_CONFIG } from 'carousel';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimations(),
    {
      provide: NGX_CAROUSEL_CONFIG,
      useValue: {
        autoplay: false,
        interval: 1000,
        loop: true,
        startIndex: 0,
        pauseOnHover: true,
        slidesToShow: 3,
        showDots: true,
        showArrows: true,
        breakpoints: [
          {
            breakpoint: 0, // до 768
            showArrows: false,
            showDots: true,
            slidesToShow: 1,

          },
          {
            breakpoint: 768, // от 768
            showArrows: false,
            showDots: true,
            slidesToShow: 2,
          },
          {
            breakpoint: 1024, // от 1024
            showArrows: true,
            showDots: false,
            slidesToShow: 3,
          },

        ]
      }
    }
  ]
};
