import { computed, effect, Injectable, signal } from '@angular/core';
import {
  DEFAULT_CAROUSEL_CONFIG,
  NgxCarouselConfig,
} from '../ngx-carousel.types';

@Injectable()
export class NgxCarouselStateService {
  /* ========= BASE STATE ========= */
  private config = signal<NgxCarouselConfig>({});
  private width = signal(0);

  slides = signal<any[]>([]);
  currentSlide = signal(0);
  isAnimating = signal(0);
  disableTransition = signal(false);

  /* ========= DERIVED ========= */
  slidesToShow = computed(() => this.activeConfig().slidesToShow ?? 1);
  space = computed(() => this.activeConfig().spaceBetween ?? 0);
  isFade = computed(() => this.activeConfig().animation === 'fade');
  loop = computed(() => this.activeConfig().loop)

  activeConfig = computed<NgxCarouselConfig>(() => ({
    ...DEFAULT_CAROUSEL_CONFIG,
    ...this.config(),
    ...(this.activeBreakpoint() ?? {}),
  }));

  constructor() {
    effect(() => {
      const slides = this.slides()
      const cfg = this.activeConfig()
      if (!slides.length) return

      const index = cfg.loop
        ? (cfg.startIndex ?? 0) + this.slidesToShow()
        : cfg.startIndex ?? 0;

      this.currentSlide.set(index);
    })
  }

  /* ========= INIT ========= */
  init(config: NgxCarouselConfig) {
    this.config.set(config ?? {})
  }

  setWidth(width: number) {
    this.width.set(width);
  }

  setSlides(slides: any[]) {
    this.slides.set(slides);
  }

  setCurrentSlide(index: number) {
    this.currentSlide.set(index);
  }

  getSlidesLength() {
    return this.slides().length;
  }

  /* ========= CLONES ========= */
  slidesWithClones = computed(() => {
    if (this.isFade()) {
      return this.slides();
    }

    const slides = this.slides();
    const count = this.slidesToShow();

    if (!this.loop() && slides.length < count) {
      return slides;
    }

    return [
      ...slides.slice(-count),
      ...slides,
      ...slides.slice(0, count),
    ];
  });

  /* ========= BREAKPOINTS ========= */
  private activeBreakpoint = computed<Partial<NgxCarouselConfig> | null>(() => {
    const breakpoints = this.config().breakpoints ?? [];
    const w = this.width();

    return [...breakpoints]
      .sort((a, b) => b.breakpoint - a.breakpoint)
      .find(bp => w >= bp.breakpoint) ?? null;
  });
}
