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

    if (this.state.mode() == 'non-stop') {
      return `translateX(${-this.state.nonStopOffsetPx()}px)`
    }

    return `translateX(-${this.state.currentSlide() * this.slideStepPx()}px)`;
  });
}
