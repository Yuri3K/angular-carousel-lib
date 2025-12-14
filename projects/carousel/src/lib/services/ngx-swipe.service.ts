import { computed, ElementRef, inject, Injectable, Renderer2, signal } from '@angular/core';
import { NgxCarouselService } from './ngx-carousel.service';
import { NgxAutoplayService } from './ngx-autoplay..service';

@Injectable({
  providedIn: 'root'
})
export class NgxSwipeService {
  // Порог в пикселях для различения клика и свайпа
  private readonly CLICK_LIMIT = 5; // px
  private readonly SWIPE_LIMIT = 0.25; // %

  private carousel = inject(NgxCarouselService);
  private autoplay = inject(NgxAutoplayService);

  private renderer!: Renderer2;
  private carouselList!: ElementRef<HTMLDivElement>;
  private startX = 0;
  private currentX = 0;

  private isSwiping = signal(false);
  private config = computed(() => this.carousel.getConfig())

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
    this.startX = event.clientX;
    this.currentX = 0;
    this.isSwipedEnough.set(false);
    this.isSwiping.set(true);
    this.autoplay.stop();

    // Отключаем transition в начале свайпа (через Renderer2)
    this.renderer.setStyle(this.carouselList.nativeElement, 'transition', 'none');
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isSwiping()) return;

    this.currentX = event.clientX - this.startX;

        // Если отключена бесконечная прокрутка, то останавливаем свайп
    // при достижении первого и последнего слайда
    if(!this.config().loop){
      const length = this.carousel.getSlidesLength()
      const current = this.carousel.currentSlide()
      
      if((current <= 0) && (this.currentX > 0)) return             // свайпаем на предыдущий слайд
      if((current + 1 >= length) && (this.currentX < 0)) return    // свайпаем на следующий слайд
    }

    // Проверяем, превысили ли мы порог, чтобы считать это "свайпом", а не кликом
    if (Math.abs(this.currentX) > this.CLICK_LIMIT) {
      this.isSwipedEnough.set(true);
      
      // pointercapture гарантирует, что все pointermove события будут приходить на этот элемент, 
      // даже если палец/мышь вышли за пределы слайдера.
      // Без него свайп часто "обрывается", если пользователь ведёт чуть в сторону.
      this.carouselList.nativeElement.setPointerCapture(event.pointerId);
    }

    // Смещение в процентах (пользовательское + текущий слайд)
    const offset = -(this.carousel.currentSlide() * 100) +
      (this.currentX / this.carouselList.nativeElement.clientWidth) * 100;

    // Обновляем transform напрямую
    this.renderer.setStyle(this.carouselList.nativeElement, 'transform', `translateX(${offset}%)`);
  }

  onPointerUp(event: PointerEvent) {
    if (!this.isSwiping()) return;
 
    // 1. Включаем transition обратно, прежде чем менять currentSlide()
    this.renderer.setStyle(this.carouselList.nativeElement, 'transition', 'transform 0.5s ease');

    const swipeDistance = this.currentX;
    const limit = this.carouselList.nativeElement.clientWidth * this.SWIPE_LIMIT;

    if (swipeDistance < -limit) {
      this.carousel.next();
    } else if (swipeDistance > limit) {
      this.carousel.prev();
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
    // Просто устанавливаем transform в текущую позицию. Transition уже включен в onPointerUp.
    this.renderer
      .setStyle(
        this.carouselList.nativeElement, 
        'transform', 
        `translateX(-${this.carousel.currentSlide() * 100}%)`
      )
  }
}