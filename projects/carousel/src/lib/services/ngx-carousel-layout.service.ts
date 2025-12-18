import { computed, inject, Injectable, signal } from '@angular/core';
import { NgxCarouselStateService } from './ngx-carousel-state.service';

@Injectable({
  providedIn: 'root',
})
export class NgxCarouselLayoutService {
  private state = inject(NgxCarouselStateService);

  carouselWidth = signal(0)

  /* ========= MEASURE ========= */

  setCarouselWidth(container: HTMLDivElement) {
    this.carouselWidth.set(container.clientWidth)

    const resizeObserver = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width
      this.carouselWidth.set(width)
    })

    resizeObserver.observe(container)
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

  /* ========= CLONES ========= */
  slidesWithClones = computed(() => {
    if (this.state.isFade()) {
      return this.state.slides();
    }

    const slides = this.state.slides();
    const count = this.state.slidesToShow();

    if (!this.state.getConfig().loop && slides.length < count) {
      return slides;
    }

    return [
      ...slides.slice(-count),
      ...slides,
      ...slides.slice(0, count),
    ];
  });
}
