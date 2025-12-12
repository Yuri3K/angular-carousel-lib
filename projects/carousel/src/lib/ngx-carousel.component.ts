import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ContentChild, inject, Input, TemplateRef } from '@angular/core';
import { NgxCarouselService } from './services/ngx-carousel.service';
import { NgxCarouselControlsComponent } from './components/ngx-carousel-controls/ngx-carousel-controls.component';
import { NgxAutoplayService } from './services/ngx-autoplay..service';


@Component({
  selector: 'lib-ngx-carousel',
  imports: [
    NgTemplateOutlet,
    NgxCarouselControlsComponent
  ],
  templateUrl: './ngx-carousel.component.html',
  styleUrl: './ngx-carousel.component.scss'
})
export class NgxCarouselComponent implements AfterViewInit{
  @Input({required: true}) slides!: any[]
  @ContentChild('slideTemplate', {static: true}) slideTemplate!: TemplateRef<any>

  carousel = inject(NgxCarouselService)
  autoplay = inject(NgxAutoplayService)
  
  ngAfterViewInit(): void {
    this.carousel.registerSlides(this.slides)
  }
}
