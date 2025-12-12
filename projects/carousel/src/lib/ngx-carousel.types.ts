import { InjectionToken } from "@angular/core"

export interface NgxCarouselConfig {
  autoplay?: boolean,
  interval?: number,
  loop?: boolean,
  pauseOnHover?: boolean;
  animation?: 'slide' | 'fade',
  startIndex?: number,
}

export const DEFAULT_CAROUSEL_CONFIG: NgxCarouselConfig = {
  autoplay: true,
  interval: 5000,
  loop: true,
  pauseOnHover: true,
  animation: 'slide',
  startIndex: 0,
}

export const NGX_CAROUSEL_CONFIG = new InjectionToken<NgxCarouselConfig>('NGX_CAROUSEL_CONFIG')