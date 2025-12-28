import { ElementRef, inject, Injectable, Renderer2, signal } from '@angular/core';
import { NgxCarouselService } from './ngx-carousel.service';
import { NgxAutoplayService } from './ngx-autoplay..service';
import { NgxStateService } from './ngx-state.service';
import { NgxLayoutService } from './ngx-layout.service';

@Injectable()
export class NgxSwipeService {
  // Порог в пикселях для различения клика и свайпа
  private readonly CLICK_LIMIT = 5; // px
  private readonly SWIPE_LIMIT = 0.05; // %

  private carousel = inject(NgxCarouselService);
  private autoplay = inject(NgxAutoplayService);
  private state = inject(NgxStateService)
  private layout = inject(NgxLayoutService)

  private renderer!: Renderer2;
  private carouselList!: ElementRef<HTMLDivElement>;
  private startX = 0;
  private currentX = 0;

  isSwiping = signal(false);

  // Определяем, был ли свайп достаточным, чтобы считать его жестом, а не кликом.
  // Будет использоваться для блокировки кликов по ссылкам.
  isSwipedEnough = signal(false);

  registerSlideList(element: ElementRef<HTMLDivElement>) {
    this.carouselList = element;
  }

  setRenderer(renderer: Renderer2) {
    this.renderer = renderer;
  }

  onPointerDown(event: PointerEvent) {
    if (this.carousel.isAnimating()) return

    this.startX = event.clientX;
    this.currentX = 0;
    this.isSwipedEnough.set(false);
    this.isSwiping.set(true);
    this.autoplay.stop();

    // Отключаем transition в начале свайпа (через Renderer2)
    this.renderer.setStyle(this.carouselList.nativeElement, 'transition', 'none');
  }

  onPointerMove(event: PointerEvent) {
    this.currentX = event.clientX - this.startX

    if (this.state.isFade()) return
    if (!this.isSwiping()) return;

    // Если отключена бесконечная прокрутка, то останавливаем свайп
    // при достижении первого и последнего слайда
    if (!this.state.loop()) {
      const length = this.state.slides().length
      const current = this.state.currentSlide();
      const slidesToshow = this.state.slidesToShow()

      if ((current <= 0) && (this.currentX > 0)) return // свайпаем на предыдущий слайд
      if ((current >= length - slidesToshow) && (this.currentX < 0)) return // свайпаем на следующий слайд
    }

    // Проверяем, превысили ли мы порог, чтобы считать это "свайпом", а не кликом
    if (Math.abs(this.currentX) > this.CLICK_LIMIT) {
      this.isSwipedEnough.set(true);

      // pointercapture гарантирует, что все pointermove события будут приходить на этот элемент, 
      // даже если палец/мышь вышли за пределы слайдера.
      // Без него свайп часто "обрывается", если пользователь ведёт чуть в сторону.
      this.carouselList.nativeElement.setPointerCapture(event.pointerId);
    }

    // Смещение в пикселях к текущему слайду
    const baseTranslate = -this.state.currentSlide() * this.layout.slideStepPx()

    // Смещение в пикселях (текущее + пользовательское)
    const offsetPx = baseTranslate + this.currentX

    // Обновляем transform напрямую
    this.renderer.setStyle(
      this.carouselList.nativeElement,
      'transform',
      `translateX(${offsetPx}px)`
    );
  }

  onPointerUp(event: PointerEvent) {
    if (this.state.isFade()) {
      if (this.currentX < -50) this.carousel.next()
      if (this.currentX > 50) this.carousel.prev()

      this.isSwiping.set(false)
      return
    }

    if (!this.isSwiping()) return;

    // 1. Включаем transition обратно, прежде чем менять currentSlide()
    this.renderer.setStyle(
      this.carouselList.nativeElement,
      'transition',
      `transform ${this.state.speed()}ms ease`
    );

    const swipeDistance = this.currentX;
    const limit = this.carouselList.nativeElement.clientWidth * this.SWIPE_LIMIT;
    const step = this.layout.slideStepPx()
    const slidesDragged = Math.round(swipeDistance / step) * -1 // сколько слайдов было пролистано за одно перерягивание. Домножаем на -1 так как направление перетягивания swipeDistance по своему знаку противоположно той стороне, куда нужно сместить слайды. То есть при свайпе вправо (листаем вперед), swipeDistance станет отрицательным, а слайды нам нужно сдвинуть в бОльшую сторону

    if (swipeDistance < -limit) {
      Math.abs(slidesDragged) > 0 ?
        this.carousel.shiftBy(slidesDragged) :
        this.carousel.next()
    } else if (swipeDistance > limit) {
      Math.abs(slidesDragged) > 0 ?
        this.carousel.shiftBy(slidesDragged) :
        this.carousel.prev()
    } else {
      // Возврат на место, так как длинна свайпа недостаточная по длинне 
      // (так как transition уже включен, это будет плавно)
      this.snapBack();
    }

    // 2. Сбрасываем флаги
    this.isSwiping.set(false);
    this.isSwipedEnough.set(false);
    this.currentX = 0;
    this.autoplay.resume();
  }

  private snapBack() {
    const offsetPx = -this.state.currentSlide() * this.layout.slideStepPx();

    // Просто устанавливаем transform в текущую позицию. Transition уже включен в onPointerUp.
    this.renderer
      .setStyle(
        this.carouselList.nativeElement,
        'transform',
        `translateX(${offsetPx}px)`
      )
  }
}