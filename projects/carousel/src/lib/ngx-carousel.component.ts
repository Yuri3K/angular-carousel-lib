import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ContentChild, ElementRef, inject, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgxCarouselControlsComponent } from './components/ngx-carousel-controls/ngx-carousel-controls.component';
import { NgxAutoplayService } from './services/ngx-autoplay..service';
import { NgxSwipeService } from './services/ngx-swipe.service';
import { NgxCarouselConfig } from './ngx-carousel.types';
import { NgxCarouselStateService } from './services/ngx-carousel-state.service';
import { NgxCarouselLayoutService } from './services/ngx-carousel-layout.service';
import { NgxCarouselNavigationService } from './services/ngx-carousel-navigation.service';


@Component({
  selector: 'lib-ngx-carousel',
  imports: [
    NgTemplateOutlet,
    NgxCarouselControlsComponent
  ],
  templateUrl: './ngx-carousel.component.html',
  styleUrl: './ngx-carousel.component.scss',
  providers: [
    NgxCarouselNavigationService, 
    NgxAutoplayService, 
    NgxSwipeService,
    NgxCarouselStateService,
    NgxCarouselLayoutService
  ]

})
export class NgxCarouselComponent implements OnInit, AfterViewInit{
  @Input({required: true}) config!: NgxCarouselConfig
  @Input({required: true}) slides!: any[]

  @ViewChild('carouselList', { static: true }) carouselList!: ElementRef<HTMLDivElement>;
  @ContentChild('slideTemplate', {static: true}) slideTemplate!: TemplateRef<any>
  @ContentChild('controlsTemplate', {static: true}) controlsTemplate!: TemplateRef<any>

  private readonly renderer = inject(Renderer2)
  private resizeObserver!: ResizeObserver

  navigation = inject(NgxCarouselNavigationService)
  autoplay = inject(NgxAutoplayService)
  swipe = inject(NgxSwipeService)
  layout = inject(NgxCarouselLayoutService)
  state = inject(NgxCarouselStateService)

  ngOnInit() {
    this.state.init(this.config)
    this.state.setSlides(this.slides)
    this.watchResize()
  }
  
  ngAfterViewInit(): void {
    this.swipe.registerSlideList(this.carouselList)
    this.swipe.registerRenderer(this.renderer)

    this.resizeObserver.observe(this.carouselList.nativeElement)
  }

  private watchResize() {
    this.resizeObserver = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width
      this.layout.setCarouselWidth(width)
      this.state.setWidth(width)
    })
  }
}
