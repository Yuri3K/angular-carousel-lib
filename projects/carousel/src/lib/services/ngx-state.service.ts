import { computed, effect, inject, Inject, Injectable, Optional, signal } from '@angular/core';
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselConfig } from '../ngx-carousel.types';

@Injectable()
export class NgxStateService {
  private config = signal<NgxCarouselConfig>({});
  private appCfg = inject(NGX_CAROUSEL_CONFIG, { optional: true });
  private width = signal(0)

  // activeConfig = computed(() => {
  //   return {
  //     ...DEFAULT_CAROUSEL_CONFIG,
  //     ...this.config ?? {},
  //     ...this.activeBreakpoint() ?? {}
  //   }
  // })

  //   /* ========= BREAKPOINTS ========= */
  // private activeBreakpoint = computed<Partial<NgxCarouselConfig> | null>(() => {
  //   const breakpoints = this.config().breakpoints ?? [];
  //   const w = this.width();

  //   return [...breakpoints]
  //     .sort((a, b) => b.breakpoint - a.breakpoint)
  //     .find(bp => w >= bp.breakpoint) ?? null;
  // });

  /* ========= BREAKPOINTS ========= */
  activeBreakpoint = computed<Partial<NgxCarouselConfig> | null>(() => {
    const breakpoints = this.config().breakpoints
    const w = this.width();

    return null
  })  

  constructor() {}

  /* ========= INIT ========= */
  init(customConfig: NgxCarouselConfig) {
    this.config.set({
      ...this.appCfg ?? {},
      ...customConfig ?? {}
    });
  }

  setWidth(width: number) {
    this.width.set(width)
  }
}
