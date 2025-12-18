import { Component, computed, inject } from '@angular/core';
import { NgxCarouselStateService } from '../../services/ngx-carousel-state.service';
import { NgxCarouselNavigationService } from '../../services/ngx-carousel-navigation.service';

@Component({
  selector: 'lib-ngx-carousel-controls',
  imports: [],
  templateUrl: './ngx-carousel-controls.component.html',
  styleUrl: './ngx-carousel-controls.component.scss',
})
export class NgxCarouselControlsComponent {
  navigation = inject(NgxCarouselNavigationService)
  state = inject(NgxCarouselStateService)

  private config = this.state.activeConfig

  isDots = computed(() => this.config().showDots)

  isArrows = computed(() => this.config().showArrows)
}
