import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  inject,
  Input,
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
  ],
})
export class NgxCarouselComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) slides!: any[];
  @Input() config!: NgxCarouselConfig;

  @ViewChild('carouselList', { static: true })
  carouselList!: ElementRef<HTMLDivElement>;
  @ContentChild('slideTemplate', { static: true })
  slideTemplate!: TemplateRef<any>;

  private readonly renderer = inject(Renderer2);
  private resizeObserver!: ResizeObserver;

  carousel = inject(NgxCarouselService);
  autoplay = inject(NgxAutoplayService);
  swipe = inject(NgxSwipeService);
  state = inject(NgxStateService);

  ngOnInit() {
    this.watchResize();
    this.state.init(this.config)
    this.state.setSlides(this.slides)
  }

  ngAfterViewInit(): void {
    this.carousel.registerSlides(this.slides);
    this.swipe.registerSlideList(this.carouselList);
    this.swipe.setRenderer(this.renderer);

    this.resizeObserver.observe(this.carouselList.nativeElement);
  }

  private watchResize() {
    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      // this.layout.setCarouselWidth(width);
      this.state.setWidth(width);
    });
  }
}
