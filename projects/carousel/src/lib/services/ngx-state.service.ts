import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselConfig } from '../ngx-carousel.types';

@Injectable()
export class NgxStateService {
  private config = signal<NgxCarouselConfig>({});
  private width = signal(0)
  slides = signal<any[]>([]);
  currentSlide = signal(0);

  private appCfg = inject(NGX_CAROUSEL_CONFIG, { optional: true });

  /* ========= ACTIVECONFIG ========= */
  activeConfig = computed(() => {
    return {
      ...this.config(),
      ...this.activeBreakpoint() ?? {}
    }
  })

  slidesToShow = computed(() => this.activeConfig().slidesToShow ?? 1);
  autoplay = computed(() => this.activeConfig().autoplay ?? true);
  interval = computed(() => this.activeConfig().interval ?? 5000);
  pauseOnHover = computed(() => this.activeConfig().pauseOnHover ?? true);
  space = computed(() => this.activeConfig().spaceBetween ?? 0);
  isFade = computed(() => this.activeConfig().animation === 'fade');
  loop = computed(() => this.activeConfig().loop)
  isArrows = computed(() => this.activeConfig().showArrows)
  isDots = computed(() => this.activeConfig().showDots)

  /* ========= BREAKPOINTS ========= */
  activeBreakpoint = computed<Partial<NgxCarouselConfig> | null>(() => {
    const breakpoints = this.config().breakpoints ?? []
    const w = this.width();

    return [...breakpoints]
      .sort((a, b) => b.breakpoint - a.breakpoint)
      .find(bp => w >= bp.breakpoint) ?? null
  })

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

  constructor() {
    effect(() => {
      const slides = this.slides()
      const cfg = this.activeConfig()

      if (!slides.length) return

      const index = this.loop() ?
        (cfg.startIndex ?? 0) + this.slidesToShow() :
        cfg.startIndex ?? 0

      this.setCurrentSlide(index)
    })
  }

  /* ========= INIT ========= */
  init(customConfig: NgxCarouselConfig = {}) {
    this.config.set({
      ...DEFAULT_CAROUSEL_CONFIG,
      ...this.appCfg ?? {},
      ...customConfig
    });
    console.log("🔸 this.config:", this.config())
  }

  setWidth(width: number) {
    this.width.set(width)
    // console.log("ACTIVE", this.activeConfig())
  }

  setSlides(slides: any[]) {
    this.slides.set(slides);
  }

  setCurrentSlide(index: number) {
    this.currentSlide.set(index);
  }
}
