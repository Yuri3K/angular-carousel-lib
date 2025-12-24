import { Component, inject, } from '@angular/core';
import { NgxCarouselService } from '../../services/ngx-carousel.service';
import { NgxStateService } from '../../services/ngx-state.service';

@Component({
  selector: 'lib-ngx-carousel-controls',
  imports: [],
  templateUrl: './ngx-carousel-controls.component.html',
  styleUrl: './ngx-carousel-controls.component.scss',
})
export class NgxCarouselControlsComponent {
  carousel = inject(NgxCarouselService);
  state = inject(NgxStateService)
}
