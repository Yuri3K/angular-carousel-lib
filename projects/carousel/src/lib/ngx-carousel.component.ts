import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ContentChild, ElementRef, inject, Input, OnChanges, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NgxCarouselService } from './services/ngx-carousel.service';
import { NgxCarouselControlsComponent } from './components/ngx-carousel-controls/ngx-carousel-controls.component';
import { NgxAutoplayService } from './services/ngx-autoplay..service';
import { NgxSwipeService } from './services/ngx-swipe.service';
import { NgxCarouselConfig } from './ngx-carousel.types';


@Component({
  selector: 'lib-ngx-carousel',
  imports: [
    NgTemplateOutlet,
    NgxCarouselControlsComponent
  ],
  templateUrl: './ngx-carousel.component.html',
  styleUrl: './ngx-carousel.component.scss',
  providers: [
    NgxCarouselService, 
    NgxAutoplayService, 
    NgxSwipeService
  ]

})
export class NgxCarouselComponent implements OnInit, AfterViewInit, OnChanges{
  @Input({required: true}) config!: NgxCarouselConfig
  @Input({required: true}) slides!: any[]
  @Input({required: true}) windowWidth = 0

  @ViewChild('carouselList', { static: true }) carouselList!: ElementRef<HTMLDivElement>;
  @ContentChild('slideTemplate', {static: true}) slideTemplate!: TemplateRef<any>
  @ContentChild('controlsTemplate', {static: true}) controlsTemplate!: TemplateRef<any>

  private readonly renderer = inject(Renderer2)

  carousel = inject(NgxCarouselService)
  autoplay = inject(NgxAutoplayService)
  swipe = inject(NgxSwipeService)

  ngOnInit() {
    this.carousel.init(this.config)
  }
  
  ngAfterViewInit(): void {

    this.carousel.registerSlides(this.slides)
    this.carousel.registerSlideList(this.carouselList.nativeElement)
    // this.carousel.registerRenderer(this.renderer)
    this.swipe.registerSlideList(this.carouselList)
    this.swipe.registerRenderer(this.renderer)

    this.carousel.setWidth(this.windowWidth)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.carousel.setWidth(changes['windowWidth'].currentValue)
  }
}
