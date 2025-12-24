import { inject, Injectable, signal } from '@angular/core';
import { NgxStateService } from './ngx-state.service';

@Injectable()
export class NgxCarouselService {
  // private config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG);
  // slidesData = signal<any[]>([]);
  private state = inject(NgxStateService)
  disableTransition = signal(false);

  // currentSlide = signal(0);

  // slidesWithClones = computed(() => {
  //   const slides = this.slidesData();
  //   const length = slides.length;

  //   if (length <= 0) return [];

  //   if (this.config().loop && length > 1) {
  //     return [
  //       slides[length - 1], // Клон последнего в начало
  //       ...slides, // Все оригинальные
  //       slides[0], // Клон первого в конец
  //     ];
  //   }

  //   return slides;
  // });

  // constructor(
  //   @Optional() @Inject(NGX_CAROUSEL_CONFIG) defaultCtf: NgxCarouselConfig
  // ) {
  //   this.config.set({
  //     ...DEFAULT_CAROUSEL_CONFIG,
  //     ...(defaultCtf || {}),
  //   });
  // }

  // getConfig(): NgxCarouselConfig {
  //   return this.config();
  // }

  // registerSlides(slidesData: any[]) {
  //   this.slidesData.set(slidesData);

  //   const index = this.config().loop
  //     ? (this.config().startIndex ?? 0) + 1
  //     : this.config().startIndex ?? 0;

  //   this.currentSlide.set(index);
  // }

  // getSlidesLength() {
  //   return this.slidesData().length;
  // }

  next() {
    // const length = this.getSlidesLength();
    const length = this.state.slides().length
    if (length <= 1) return;

    this.disableTransition.set(false);
    const current = this.state.currentSlide();

    if (this.state.loop()) {
      // Переходим к следующему слайду (даже если это клон)
      this.state.setCurrentSlide(current + 1);

      // Если достигли клона
      if (current + 1 >= length + 1) {
        // Сбрасываем на первый оригинальный слайд
        this.scheduleSnapToReal(1);
      }
    } else if (current + 1 < length) {
      // В режиме без loop просто проверяем границы
      this.state.setCurrentSlide(current + 1);
    }
  }

  prev() {
    const length = this.state.slides().length
    if (length <= 1) return;

    this.disableTransition.set(false);
    const current = this.state.currentSlide();

    if (this.state.loop()) {
      this.state.setCurrentSlide(current - 1);

      if (current - 1 <= 0) {
        this.scheduleSnapToReal(length);
      }
    } else if (current > 0) {
      this.state.setCurrentSlide(current - 1);
    }
  }

  /**
   * Мгновенный переход к реальному слайду после завершения анимации
   */
  private scheduleSnapToReal(realIndex: number) {
    // Дожидаемся завершения анимации
    setTimeout(() => {
      // Отключаем анимацию
      this.disableTransition.set(true);

      // Выполняем мгновенное переключение слайда без анимации
      this.state.setCurrentSlide(realIndex);

      // Чтобы операция включения анимации выполнилась на следующем цикле Event Loop, задаем таймер
      setTimeout(() => {
        this.disableTransition.set(false);
      }, 50);
    }, 500); // Должно совпадать с длительностью transition в CSS
  }

  goTo(index: number) {
    const length = this.state.slides().length
    if (length === 0) return;

    if (this.state.loop()) {
      // В режиме loop просто устанавливаем целевой индекс
      this.state.setCurrentSlide(index + 1);
    } else {
      this.state.setCurrentSlide(index);
    }
  }

  getDisplayIndex(): number {
    const length = this.state.slides().length
    if (length === 0) return 0;

    const current = this.state.currentSlide();

    // Если loop отключен, то просто вернем индекс текущего слайда
    if (!this.state.loop()) return current;

    // Если на клоне последнего (индекс 0), показываем последний реальный
    if (current === 0) return length - 1;

    // Если на клоне первого (индекс len + 1), показываем первый реальный
    if (current === length + 1) return 0;

    // Иначе вычитаем 1, так как реальные слайды начинаются с индекса 1
    return current - 1;
  }
}
