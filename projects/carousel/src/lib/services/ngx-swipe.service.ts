import {
  computed,
  ElementRef,
  inject,
  Injectable,
  Renderer2,
  signal,
} from '@angular/core';
import { NgxAutoplayService } from './ngx-autoplay..service';
import { NgxCarouselStateService } from './ngx-carousel-state.service';
import { NgxCarouselLayoutService } from './ngx-carousel-layout.service';
import { NgxCarouselNavigationService } from './ngx-carousel-navigation.service';

@Injectable()
export class NgxSwipeService {
  // Порог в пикселях для различения клика и свайпа
  private readonly CLICK_LIMIT = 5; // px
  private readonly SWIPE_LIMIT = 0.05; // %

  private navigation = inject(NgxCarouselNavigationService);
  private state = inject(NgxCarouselStateService)
  private layout = inject(NgxCarouselLayoutService)
  private autoplay = inject(NgxAutoplayService);

  private renderer!: Renderer2;
  private carouselList!: ElementRef<HTMLDivElement>;
  private startX = 0;
  private currentX = 0;

  private config = computed(() => this.state.activeConfig());

  // Определяем, был ли свайп достаточным, чтобы считать его жестом, а не кликом.
  // Будет использоваться для блокировки кликов по ссылкам.
  isSwipedEnough = signal(false);
  isSwiping = signal(false);

  registerSlideList(element: ElementRef<HTMLDivElement>) {
    this.carouselList = element;
  }

  registerRenderer(renderer: Renderer2) {
    this.renderer = renderer;
  }

  onPointerDown(event: PointerEvent) {
    if (this.navigation.isAnimating()) return;

    this.startX = event.clientX;
    this.currentX = 0;
    this.isSwipedEnough.set(false);
    this.isSwiping.set(true);
    this.autoplay.stop();

    // Отключаем transition в начале свайпа (через Renderer2)
    this.renderer.setStyle(
      this.carouselList.nativeElement,
      'transition',
      'none'
    );
  }

  onPointerMove(event: PointerEvent) {
    if (this.state.activeConfig().animation === 'fade') {
      this.currentX = event.clientX - this.startX;
      return
    };

    if (!this.isSwiping()) return;

    this.currentX = event.clientX - this.startX;

    // Если отключена бесконечная прокрутка, то останавливаем свайп
    // при достижении первого и последнего слайда
    if (!this.config().loop) {
      const length = this.state.getSlidesLength();
      const current = this.state.currentSlide();
      const slidesToShow = this.state.slidesToShow();

      if (current <= 0 && this.currentX > 0) return; // свайпаем на предыдущий слайд, но это первый слайд
      if (current >= length - slidesToShow && this.currentX < 0) return; // свайпаем на следующий слайд, но это последний слайд
    }

    // Проверяем, превысили ли мы порог, чтобы считать это "свайпом", а не кликом
    if (Math.abs(this.currentX) > this.CLICK_LIMIT) {
      this.isSwipedEnough.set(true);

      // pointercapture гарантирует, что все pointermove события будут приходить на этот элемент,
      // даже если палец/мышь вышли за пределы слайдера.
      // Без него свайп часто "обрывается", если пользователь ведёт чуть в сторону.
      this.carouselList.nativeElement.setPointerCapture(event.pointerId);
    }

    const baseTranslate =
      -this.state.currentSlide() * this.layout.slideStepPx();

    const offsetPx = baseTranslate + this.currentX;

    this.renderer.setStyle(
      this.carouselList.nativeElement,
      'transform',
      `translateX(${offsetPx}px)`
    );
  }

  onPointerUp(event: PointerEvent) {
    if (this.state.activeConfig().animation === 'fade') {
      if (this.currentX < -50) this.navigation.next();
      else if (this.currentX > 50) this.navigation.prev();
      this.isSwiping.set(false);
      return;
    }

    if (!this.isSwiping()) return;

    // 1. Включаем transition обратно, прежде чем менять currentSlide()
    this.renderer.setStyle(
      this.carouselList.nativeElement,
      'transition',
      `transform ${this.state.activeConfig().speed}ms ease`
    );

    const swipeDistance = this.currentX;
    const limit =
      this.carouselList.nativeElement.clientWidth * this.SWIPE_LIMIT;

    const step = this.layout.slideStepPx();
    const slidesDragged = Math.round(swipeDistance / step);
    const delta = -slidesDragged;

    if (swipeDistance < -limit) {
      Math.abs(delta) > 0 ? this.navigation.shiftBy(delta) : this.navigation.next();
    } else if (swipeDistance > limit) {
      Math.abs(delta) > 0 ? this.navigation.shiftBy(delta) : this.navigation.prev();
    } else {
      if (Math.abs(swipeDistance) > this.CLICK_LIMIT) {
        this.snapBack();
      }
    }

    // 2. Сбрасываем флаги
    this.isSwiping.set(false);
    this.isSwipedEnough.set(false);
    this.currentX = 0;
    this.autoplay.resume();
  }

  private snapBack() {
    const offset = -this.state.currentSlide() * this.layout.slideStepPx();

    // Просто устанавливаем transform в текущую позицию. Transition уже включен в onPointerUp.
    this.renderer.setStyle(
      this.carouselList.nativeElement,
      'transform',
      `translateX(${offset}px)`
    );
  }
}
