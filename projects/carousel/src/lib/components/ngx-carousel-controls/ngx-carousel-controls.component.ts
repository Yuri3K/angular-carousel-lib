import { Component, computed, effect, inject } from '@angular/core';
import { NgxCarouselService } from '../../services/ngx-carousel.service';
import { NgxCarouselStateService } from '../../services/ngx-carousel-state.service';

@Component({
  selector: 'lib-ngx-carousel-controls',
  imports: [],
  templateUrl: './ngx-carousel-controls.component.html',
  styleUrl: './ngx-carousel-controls.component.scss',
})
export class NgxCarouselControlsComponent {
  carousel = inject(NgxCarouselService)
  state = inject(NgxCarouselStateService)

  private config = this.state.activeConfig

  isDots = computed(() => this.config().showDots)

  isArrows = computed(() => this.config().showArrows)
}
