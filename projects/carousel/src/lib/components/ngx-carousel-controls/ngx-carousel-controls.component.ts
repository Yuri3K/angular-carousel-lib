import { Component, inject, Input, TemplateRef, } from '@angular/core';
import { NgxCarouselService } from '../../services/ngx-carousel.service';
import { NgxStateService } from '../../services/ngx-state.service';
import { NgTemplateOutlet } from '@angular/common';
import { NgxAutoplayService } from '../../services/ngx-autoplay..service';
import { NgxNonStopService } from '../../services/ngx-non-stop.service';

@Component({
  selector: 'lib-ngx-carousel-controls',
  imports: [NgTemplateOutlet],
  templateUrl: './ngx-carousel-controls.component.html',
  styleUrl: './ngx-carousel-controls.component.scss',
})
export class NgxCarouselControlsComponent {
  @Input() btnLeft!: TemplateRef<any>
  @Input() btnRight!: TemplateRef<any>
  @Input() iconLeft!: TemplateRef<any>
  @Input() iconRight!: TemplateRef<any>
  @Input() stopBtn!: TemplateRef<any>
  @Input() iconPause!: TemplateRef<any>
  @Input() iconPlay!: TemplateRef<any>
  
  carousel = inject(NgxCarouselService);
  autoplay = inject(NgxAutoplayService);
  nonStop = inject(NgxNonStopService);
  state = inject(NgxStateService)

}
