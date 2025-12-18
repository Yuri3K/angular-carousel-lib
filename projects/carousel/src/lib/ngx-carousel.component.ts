import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ContentChild, ElementRef, inject, Input, OnChanges, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
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
export class NgxCarouselComponent implements OnInit, AfterViewInit, OnChanges{
  @Input({required: true}) config!: NgxCarouselConfig
  @Input({required: true}) slides!: any[]
  @Input({required: true}) windowWidth = 0

  @ViewChild('carouselList', { static: true }) carouselList!: ElementRef<HTMLDivElement>;
  @ContentChild('slideTemplate', {static: true}) slideTemplate!: TemplateRef<any>
  @ContentChild('controlsTemplate', {static: true}) controlsTemplate!: TemplateRef<any>

  private readonly renderer = inject(Renderer2)

  navigation = inject(NgxCarouselNavigationService)
  autoplay = inject(NgxAutoplayService)
  swipe = inject(NgxSwipeService)
  layout = inject(NgxCarouselLayoutService)
  state = inject(NgxCarouselStateService)

  ngOnInit() {
    this.state.init(this.config)
    this.state.setSlides(this.slides)
  }
  
  ngAfterViewInit(): void {
    this.swipe.registerSlideList(this.carouselList)
    this.swipe.registerRenderer(this.renderer)

    this.layout.setCarouselWidth(this.carouselList.nativeElement)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.state.setWidth(changes['windowWidth'].currentValue)
  }
}
