import { Component, inject, Input, TemplateRef, } from '@angular/core';
import { NgxCarouselService } from '../../services/ngx-carousel.service';
import { NgxStateService } from '../../services/ngx-state.service';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'lib-ngx-carousel-controls',
  imports: [NgTemplateOutlet],
  templateUrl: './ngx-carousel-controls.component.html',
  styleUrl: './ngx-carousel-controls.component.scss',
})
export class NgxCarouselControlsComponent {
  @Input() iconLeft!: TemplateRef<any>
  @Input() iconRight!: TemplateRef<any>
  
  carousel = inject(NgxCarouselService);
  state = inject(NgxStateService)

}
