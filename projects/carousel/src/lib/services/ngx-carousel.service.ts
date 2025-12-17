import {
  computed,
  Inject,
  Injectable,
  Optional,
  signal,
} from '@angular/core';
import {
  DEFAULT_CAROUSEL_CONFIG,
  // NGX_CAROUSEL_CONFIG,
  NgxCarouselBreakpoint,
  NgxCarouselConfig,
} from '../ngx-carousel.types';

@Injectable({
  providedIn: 'root',
})
export class NgxCarouselService {
  private config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG);
  private width = signal(0); // window width
  private snapTimer: any = null
  private carouselList = signal<HTMLDivElement | null>(null)

  isSnapping = false;
  isAnimating = signal(false)
  slidesData = signal<any[]>([]);
  disableTransition = signal(false);
  currentSlide = signal(0);
  slidesToShow = computed(() => this.config().slidesToShow ?? 1);
  space = computed(() => this.config().spaceBetween ?? 0);
  activeConfig = computed(() => this.config());
  slideWidthPx = computed(() =>
    // containreWidth - space * (slidesToShow - 1)) / slidesToShow
    this.carouselList() ?
      (this.carouselList()!.clientWidth / this.slidesToShow()) - this.space() / 2 :
      0
  );
  slideStepPx = computed(() => this.slideWidthPx() + (this.config().spaceBetween ?? 0));
  translatePx = computed(() => `translateX(-${this.currentSlide() * this.slideStepPx()}px)`);

  slidesWithClones = computed(() => {
    const slides = this.slidesData();
    const length = slides.length;
    const slidesToShow = this.slidesToShow();

    if (length <= 0) return [];

    if (this.config().loop && length >= slidesToShow) {
      const startClones = slides.slice(length - slidesToShow); // Клоны последних N слайдов
      const endClones = slides.slice(0, slidesToShow); // Клоны первых N слайдов

      return [
        ...startClones, // Клон последнего в начало
        ...slides, // Все оригинальные
        ...endClones, // Клон первого в конец
      ];
    }

    return slides;
  });

  constructor(
    // @Optional() @Inject(NGX_CAROUSEL_CONFIG) defaultCtf: NgxCarouselConfig
  ) {
    // this.config.set({
    //   ...DEFAULT_CAROUSEL_CONFIG,
    //   ...(defaultCtf || {}),
    // });

    // this.updateActiveBreakpoint(this.width());

    // console.log("WIDTH", this.width)
  }

  init(config: NgxCarouselConfig) {
    this.config.set({
      ...DEFAULT_CAROUSEL_CONFIG,
      ...config ?? {}
    })

    this.updateActiveBreakpoint(this.width());
  }

  getConfig(): NgxCarouselConfig {
    return this.config();
  }

  setWidth(width: number) {
    this.width.set(width);
    this.updateActiveBreakpoint(width);
  }

  registerSlideList(list: HTMLDivElement) {
    this.carouselList.set(list)
  }

  registerSlides(slidesData: any[]) {
    this.slidesData.set(slidesData);

    const index = this.config().loop
      ? (this.config().startIndex ?? 0) + this.slidesToShow()
      : this.config().startIndex ?? 0;

    this.currentSlide.set(index);
  }

  getSlidesLength() {
    return this.slidesData().length;
  }

  updateActiveBreakpoint(width: number) {
    const breakpoints = this.config().breakpoints || [];

    // Сортируем брейкпоинты по убыванию
    const sortedBreakpoints = [...breakpoints].sort(
      (a, b) => b.breakpoint - a.breakpoint
    );

    // Находим подходящий брейкпоинт
    const active =
      sortedBreakpoints.find((bp) => width >= bp.breakpoint) ||
      ({} as NgxCarouselBreakpoint);

    this.config.update((ctf) => ({ ...ctf, ...active }));
  }

  next() {
    if (!this.startAnimation()) return

    const length = this.slidesWithClones().length;
    if (length <= 1) return;

    this.disableTransition.set(false);
    const current = this.currentSlide();
    const slidesToShow = this.slidesToShow();

    if (this.config().loop) {
      // Переходим к следующему слайду (даже если это клон)
      this.currentSlide.set(current + 1);

      // Если достигли клона
      if (current + slidesToShow >= length - 1) {
        // Сбрасываем на первый оригинальный слайд
        const index = this.getRealIndex(current + 1)
        this.scheduleSnapToRealIndex(index);
      }
    } else if (current + 1 < length) {
      // В режиме без loop просто проверяем границы
      this.currentSlide.set(current + 1);
    }
  }

  prev() {
    if (!this.startAnimation()) return

    const length = this.slidesWithClones().length;
    if (length <= 1) return;

    this.disableTransition.set(false);
    const current = this.currentSlide();
    const slidesToShow = this.slidesToShow();

    if (this.config().loop) {
      // Переходим к предыдущему слайду (даже если это клон)
      this.currentSlide.set(current - 1);

      if (current - slidesToShow <= 0) {
        const index = this.getRealIndex(current - 1)
        this.scheduleSnapToRealIndex(index);
      }
    } else if (current > 0) {
      this.currentSlide.set(current - 1);
    }
  }

  // /**
  //  * Мгновенный переход к реальному слайду после завершения анимации
  //  */
  // private scheduleSnapToReal(realIndex: number) {
  //   if (this.isSnapping) {
  //     if (this.snapTimer) {
  //       clearTimeout(this.snapTimer)
  //     }
  //     this.snapTimer = null
  //   };

  //   this.isSnapping = true;

  //   // Дожидаемся завершения анимации
  //   this.snapTimer = setTimeout(() => {
  //     // Отключаем анимацию
  //     this.disableTransition.set(true);

  //     // Выполняем мгновенное переключение слайда без анимации
  //     this.currentSlide.set(realIndex);

  //     // 1-й requestAnimationFrame — применить transform
  //     // 2-й requestAnimationFrame — зафиксировать layout
  //     // только потом включаем transition
  //     requestAnimationFrame(() => {
  //       requestAnimationFrame(() => {
  //         this.disableTransition.set(false);
  //         this.isSnapping = false;
  //         if (this.snapTimer) {
  //           clearTimeout(this.snapTimer)
  //         }
  //         this.snapTimer = null
  //       });
  //     });
  //   }, 500); // Должно совпадать с длительностью transition в CSS
  // }

  private scheduleSnapToRealIndex(realIndex: number) {
    if (this.isSnapping) {
      if (this.snapTimer) {
        clearTimeout(this.snapTimer)
      }
      this.snapTimer = null
    };

    this.isSnapping = true;
    const slidesToShow = this.slidesToShow();
    const realTarget = realIndex + slidesToShow;

    this.snapTimer = setTimeout(() => {
      this.disableTransition.set(true);
      this.currentSlide.set(realTarget);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.disableTransition.set(false);
          this.isSnapping = false;
          if (this.snapTimer) {
            clearTimeout(this.snapTimer)
          }
          this.snapTimer = null
        });
      });
    }, this.config().speed);
  }

  goTo(index: number) {
    const length = this.getSlidesLength();
    if (length <= 0) return;

    const slidestToShow = this.slidesToShow();

    if (this.config().loop) {
      // В режиме loop просто устанавливаем целевой индекс
      this.currentSlide.set(index + slidestToShow);
    } else {
      this.currentSlide.set(index);
    }
  }

  getDisplayIndex(): number {
    const length = this.slidesWithClones().length;
    if (length <= 0) return 0;

    const current = this.currentSlide();
    const slidesToShow = this.slidesToShow();

    // Если loop отключен, то просто вернем индекс текущего слайда
    if (!this.config().loop) return current;

    // Если на клоне последнего (индекс 0), показываем последний реальный
    if (current === 0) return length - 1;

    // Если на клоне первого (индекс len + 1), показываем первый реальный
    if (current === length - slidesToShow) return 0;

    // Иначе вычитаем slidesToShow, так как реальные слайды начинаются с индекса slidesToShow
    return current - slidesToShow;
  }

  // shiftBy(delta: number) {
  //   if (delta === 0) return;

  //   const current = this.currentSlide();
  //   const slidesToShow = this.slidesToShow();
  //   const length = this.slidesWithClones().length;

  //   this.disableTransition.set(false);

  //   let target = current + delta;

  //   if (!this.config().loop) {
  //     const max = length - slidesToShow;
  //     target = Math.max(0, Math.min(target, max));
  //   }

  //   this.currentSlide.set(target);

  //   if (this.config().loop) {
  //     if (target + slidesToShow >= length - 1) {
  //       this.scheduleSnapToReal(slidesToShow);
  //     }
  //     if (target <= 0) {
  //       this.scheduleSnapToReal(length - 1 - slidesToShow);
  //     }
  //   }
  // }

  shiftBy(delta: number) {
    if (delta === 0) return;
    if (!this.startAnimation()) return

    const current = this.currentSlide();
    const slidesToShow = this.slidesToShow();
    const total = this.slidesWithClones().length;

    let target = current + delta;

    this.disableTransition.set(false);

    if (!this.config().loop) {
      const max = total - slidesToShow;
      target = Math.max(0, Math.min(target, max));
      this.currentSlide.set(target);
      return;
    }

    this.currentSlide.set(target);

    // вычисляем РЕАЛЬНЫЙ индекс
    const realIndex = this.getRealIndex(target);

    // если ушли в клоны — снапаемся туда же, но в реальной зоне
    if (target < slidesToShow || target >= total - slidesToShow) {
      this.scheduleSnapToRealIndex(realIndex);
    }
  }

  private getRealIndex(virtualIndex: number): number {
    const length = this.getSlidesLength();
    const slidesToShow = this.slidesToShow();

    if (!this.config().loop) return virtualIndex;

    // виртуальный индекс → реальный
    let real = virtualIndex - slidesToShow;

    if (real < 0) real += length;
    if (real >= length) real -= length;

    return real;
  }

  startAnimation(): boolean {
    if (this.isAnimating()) return false
    this.isAnimating.set(true)

    const duration = this.config().speed ?? 500

    setTimeout(() => {
      this.isAnimating.set(false)
    }, duration);

    return true
  }


  // getTranslateX(containreWidth: number) {
  //   const current = this.currentSlide()
  //   const space = this.space()
  //   const slidesToShow = this.slidesToShow()
  //   const slideWidht = (containreWidth - space * (slidesToShow - 1)) / slidesToShow

  //   return current * (slideWidht + space)
  // }
}
