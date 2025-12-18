import { computed, Injectable, signal } from '@angular/core';
import {
  DEFAULT_CAROUSEL_CONFIG,
  NgxCarouselConfig,
} from '../ngx-carousel.types';

@Injectable()
export class NgxCarouselStateService {
  /* ========= BASE STATE ========= */
  private _config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG);
  private _width = signal(0);

  slides = signal<any[]>([]);
  currentSlide = signal(0);
  isAnimating = signal(0);
  disableTransition = signal(false);

  /* ========= DERIVED ========= */
  slidesToShow = computed(() => this._config().slidesToShow ?? 1);
  space = computed(() => this._config().spaceBetween ?? 0);
  isFade = computed(() => this._config().animation === 'fade');

  activeConfig = computed(() => this._config());

  /* ========= INIT ========= */
  init(config: NgxCarouselConfig) {
    this._config.set({
      ...DEFAULT_CAROUSEL_CONFIG,
      ...(config ?? {}),
    });

    this.updateBreakpoint(this._width());
  }

  setWidth(width: number) {
    this._width.set(width);
    this.updateBreakpoint(width);
  }

  setSlides(slides: any[]) {
    this.slides.set(slides);

    const index = this._config().loop
      ? (this._config().startIndex ?? 0) + this.slidesToShow()
      : this._config().startIndex ?? 0;

    this.currentSlide.set(index);
  }

  setCurrentSlide(index: number) {
    this.currentSlide.set(index);
  }

  getSlidesLength() {
    return this.slides().length;
  }

  /* ========= BREAKPOINTS ========= */
  private updateBreakpoint(width: number) {
    const breakpoints = this._config().breakpoints ?? [];

    const active = [...breakpoints]
      .sort((a, b) => b.breakpoint - a.breakpoint)
      .find((bp) => width >= bp.breakpoint);

    if (active) {
      this._config.update((cfg) => ({ ...cfg, ...active }));
    }
  }

  /* ========= READ ========= */
  getConfig() {
    return this._config();
  }
}
