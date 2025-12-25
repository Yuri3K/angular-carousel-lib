import { computed, inject, Injectable, signal } from '@angular/core';
import { NgxStateService } from './ngx-state.service';

@Injectable()
export class NgxLayoutService {

  private state = inject(NgxStateService);

  /* ========= GEOMETRY ========= */
  slideWidthPx = computed(() => 
      this.state.width() / this.state.slidesToShow() - this.state.space() / 2
  );

  slideStepPx = computed(() => this.slideWidthPx() + this.state.space());

  translatePx = computed(() => {
    if (this.state.isFade()) return 'none';
    return `translate(-${this.state.currentSlide() * this.slideStepPx()}px)`;
  });
}
