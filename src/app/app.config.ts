import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
// import { NGX_CAROUSELconfig } from 'carousel';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimations(),
    // {
    //   provide: NGX_CAROUSELconfig,
    //   useValue: {
    //     autoplay: false,
    //     interval: 1000,
    //     loop: true,
    //     startIndex: 0,
    //     pauseOnHover: true,
    //     slidesToShow: 1,
    //     showDots: true,
    //     showArrows: true,
    //     speed: 250,
    //     spaceBetween: 20,
    //     breakpoints: [
    //       {
    //         breakpoint: 0, // до 768
    //         showArrows: true,
    //         showDots: true,
    //         slidesToShow: 3,

    //       },
    //       {
    //         breakpoint: 768, // от 768
    //         showArrows: true,
    //         showDots: true,
    //         slidesToShow: 3,
    //       },
    //       {
    //         breakpoint: 1024, // от 1024
    //         showArrows: true,
    //         showDots: true,
    //         slidesToShow: 3,
    //       },

    //     ]
    //   }
    // }
  ]
};
