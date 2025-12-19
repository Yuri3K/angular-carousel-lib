import { InjectionToken } from "@angular/core"

export interface NgxCarouselBreakpoint extends NgxCarouselConfig {
  breakpoint: number, // Ширина экрана, при которой применяется конфигурация (max-width)
}

export interface NgxCarouselConfig {
  autoplay?: boolean,
  interval?: number,
  loop?: boolean,
  pauseOnHover?: boolean;
  animation?: 'slide' | 'fade',
  startIndex?: number,
  slidesToShow?: number
  showArrows?: boolean;
  showDots?: boolean;
  spaceBetween?: number;
  speed?: number;
  breakpoints?: NgxCarouselBreakpoint[],
}

export const DEFAULT_CAROUSEL_CONFIG: NgxCarouselConfig = {
  autoplay: true, // автопроигрывание слайдов
  interval: 5000, // время переключения слайдов
  loop: true,     // бесконечная прокрутка
  pauseOnHover: true, // останавливать автопрокрутку при наведении
  animation: 'slide',  // тип анимации
  startIndex: 0,      // начальный номер слайда
  slidesToShow: 1,     // по умолчанию показываем 1 слайд
  showArrows: true,
  showDots: true,
  spaceBetween: 0,
  speed: 500,
  breakpoints: [],     // по умолчанию нет брейкпоинтов
}

// export const NGX_CAROUSELconfig = new InjectionToken<NgxCarouselConfig>('NGX_CAROUSELconfig')