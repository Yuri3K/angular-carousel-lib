import { computed, inject, Injectable, signal } from '@angular/core';
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselConfig } from '../ngx-carousel.types';

@Injectable()
export class NgxStateService {
  private config = signal<NgxCarouselConfig>({});
  private width = signal(0)
  
  private appCfg = inject(NGX_CAROUSEL_CONFIG, { optional: true });
  activeConfig = computed(() => {
    return {
      ...this.config ?? {},
      ...this.activeBreakpoint() ?? {}
    }
  })

  /* ========= BREAKPOINTS ========= */
  activeBreakpoint = computed<Partial<NgxCarouselConfig> | null>(() => {
    const breakpoints = this.config().breakpoints ?? []
    const w = this.width();

    return[...breakpoints]
      .sort((a, b) => b.breakpoint - a.breakpoint)
      .find(bp => w >= bp.breakpoint) ?? null
  })  

  constructor() {}

  /* ========= INIT ========= */
  init(customConfig: NgxCarouselConfig = {}) {
    this.config.set({
      ...DEFAULT_CAROUSEL_CONFIG,
      ...this.appCfg ?? {},
      ...customConfig ?? {}
    });
    console.log("🔸 this.config:", this.config())
  }

  setWidth(width: number) {
    this.width.set(width)
  }
}
