import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChild,
  effect,
  ElementRef,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgxCarouselService } from './services/ngx-carousel.service';
import { NgxCarouselControlsComponent } from './components/ngx-carousel-controls/ngx-carousel-controls.component';
import { NgxAutoplayService } from './services/ngx-autoplay..service';
import { NgxSwipeService } from './services/ngx-swipe.service';
import { NgxStateService } from './services/ngx-state.service';
import { NgxCarouselConfig } from './ngx-carousel.types';
import { NgxLayoutService } from './services/ngx-layout.service';

@Component({
  selector: 'lib-ngx-carousel',
  imports: [NgTemplateOutlet, NgxCarouselControlsComponent],
  templateUrl: './ngx-carousel.component.html',
  styleUrl: './ngx-carousel.component.scss',
  providers: [
    NgxCarouselService,
    NgxAutoplayService,
    NgxSwipeService,
    NgxStateService,
    NgxLayoutService,
  ],
})
export class NgxCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  // @Input({ required: true }) slides!: any[];
  // @Input() config!: NgxCarouselConfig;

  slides = input.required<any[]>()
  config = input<NgxCarouselConfig>({})
  
  @ViewChild('carouselList', { static: true }) carouselList!: ElementRef<HTMLDivElement>;
  @ContentChild('slideTemplate', { static: true }) slideTemplate!: TemplateRef<any>;
  @ContentChild('controlsTemplate', {static: true}) controlsTemplate!: TemplateRef<any>
  @ContentChild('iconLeft', {static: true}) iconLeft!: TemplateRef<any>
  @ContentChild('iconRight', {static: true}) iconRight!: TemplateRef<any>
  @ContentChild('btnLeft', {static: true}) btnLeft!: TemplateRef<any>
  @ContentChild('btnRight', {static: true}) btnRight!: TemplateRef<any>

  private readonly renderer = inject(Renderer2);
  private resizeObserver!: ResizeObserver;

  carousel = inject(NgxCarouselService);
  autoplay = inject(NgxAutoplayService);
  swipe = inject(NgxSwipeService);
  state = inject(NgxStateService);
  layout = inject(NgxLayoutService);

  constructor() {
    effect(() => {
      this.state.setSlides(this.slides())
    })

    effect(() => {
      this.state.init(this.config())
    });
  }

  ngOnInit() {
    this.watchResize();
  }

  ngAfterViewInit(): void {
    this.swipe.registerSlideList(this.carouselList);
    this.swipe.setRenderer(this.renderer);

    this.resizeObserver.observe(this.carouselList.nativeElement);
  }

  private watchResize() {
    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      // Отключаем анимацию, чтобы карусель перестроилась мгновенно
      this.carousel.disableTransition.set(true)
      this.state.setWidth(width);

      // Включаем анимацию обратно, когда браузер перерисовал страницу
      requestAnimationFrame(() => {
        this.carousel.disableTransition.set(false)
      })
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
