import { InjectionToken } from '@angular/core';

export interface NgxCarouselBreakpoint extends NgxCarouselConfig {
  breakpoint: number; // Ширина экрана, при которой применяется конфигурация (max-width)
}

export type CarouselMode = 'carousel' | 'non-stop';

export type AnimationEasing =
  | 'linear'            // Равномерно, без ускорений
  | 'ease'              // Немного разгон → немного торможение
  | 'ease-in'           // Медленно → быстрее
  | 'ease-out'          // Быстро → медленно
  | 'ease-in-out'       // Медленно → быстро → медленно
  | `cubic-bezier(${number}, ${number}, ${number}, ${number})`;

export interface NgxCarouselConfig {
  mode?: CarouselMode;
  nonStopSpeed?: number;
  autoplay?: boolean;
  interval?: number;
  loop?: boolean;
  pauseOnHover?: boolean;
  animation?: 'slide' | 'fade';
  easing?: AnimationEasing;
  startIndex?: number;
  slidesToShow?: number;
  showArrows?: boolean;
  showDots?: boolean;
  spaceBetween?: number;
  speed?: number;
  breakpoints?: NgxCarouselBreakpoint[];
}

export const DEFAULT_CAROUSEL_CONFIG: NgxCarouselConfig = {
  mode: 'carousel', // режим карусели (перелистывание или безостановочная лента)
  nonStopSpeed: 40, // cкорость ленты в px/sec (только для 'non-stop')
  autoplay: true, // автопроигрывание слайдов
  interval: 5000, // время переключения слайдов
  loop: true,     // бесконечная прокрутка
  pauseOnHover: true, // останавливать автопрокрутку при наведении
  animation: 'slide',  // тип анимации
  easing: 'ease',
  startIndex: 0,      // начальный номер слайда
  slidesToShow: 1,     // по умолчанию показываем 1 слайд
  showArrows: true,
  showDots: true,
  spaceBetween: 0,
  speed: 500,
  breakpoints: [],     // по умолчанию нет брейкпоинтов
}

export const NGX_CAROUSEL_CONFIG = new InjectionToken<NgxCarouselConfig>(
  'NGX_CAROUSEL_CONFIG'
);
