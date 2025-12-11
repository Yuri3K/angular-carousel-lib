import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'lib-ngx-carousel',
  imports: [
    NgTemplateOutlet,
  ],
  templateUrl: './ngx-carousel.component.html',
})
export class NgxCarouselComponent implements AfterViewInit{
  @Input({required: true}) slides!: any[]
  @ContentChild('slideTemplate', {static: true}) slideTemplate!: TemplateRef<any>
  
  ngAfterViewInit(): void {
    
  }
}
