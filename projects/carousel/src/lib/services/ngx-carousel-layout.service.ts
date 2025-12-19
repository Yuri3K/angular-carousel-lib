import { computed, inject, Injectable, signal } from '@angular/core';
import { NgxCarouselStateService } from './ngx-carousel-state.service';

@Injectable({
  providedIn: 'root',
})
export class NgxCarouselLayoutService {
  private state = inject(NgxCarouselStateService);

  carouselWidth = signal(0)

  /* ========= MEASURE ========= */

  setCarouselWidth(width: number) {
    this.carouselWidth.set(width)
  }

  /* ========= GEOMETRY ========= */
  slideWidthPx = computed(() => {
    return (
      this.carouselWidth() / this.state.slidesToShow() - this.state.space() / 2
    );
  });

  slideStepPx = computed(() => this.slideWidthPx() + this.state.space());

  translatePx = computed(() => {
    if (this.state.isFade()) return 'none';
    return `translate(-${this.state.currentSlide() * this.slideStepPx()}px)`;
  });
}
