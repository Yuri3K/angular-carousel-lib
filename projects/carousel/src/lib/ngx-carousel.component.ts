import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ContentChild, ElementRef, inject, Input, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgxCarouselService } from './services/ngx-carousel.service';
import { NgxCarouselControlsComponent } from './components/ngx-carousel-controls/ngx-carousel-controls.component';
import { NgxAutoplayService } from './services/ngx-autoplay..service';
import { NgxSwipeService } from './services/ngx-swipe.service';


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
  @ViewChild('carouselList', { static: true }) carouselList!: ElementRef<HTMLDivElement>;
  @ContentChild('slideTemplate', {static: true}) slideTemplate!: TemplateRef<any>

  private readonly renderer = inject(Renderer2)

  carousel = inject(NgxCarouselService)
  autoplay = inject(NgxAutoplayService)
  swipe = inject(NgxSwipeService)
  
  ngAfterViewInit(): void {
    this.carousel.registerSlides(this.slides)
    this.swipe.registerSlideList(this.carouselList)
    this.swipe.setRenderer(this.renderer)
  }
}
