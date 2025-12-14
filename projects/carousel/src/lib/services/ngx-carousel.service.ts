import { computed, ElementRef, Inject, Injectable, Optional, Renderer2, signal } from "@angular/core";
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselBreakpoint, NgxCarouselConfig } from "../ngx-carousel.types";

@Injectable({
    providedIn: 'root'
})

export class NgxCarouselService {
    private config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG)
    // private renderer!: Renderer2;
    // private carouselList!: HTMLDivElement;
    private width = signal(0)
    // activeBreakpoint = signal<NgxCarouselBreakpoint>({} as NgxCarouselBreakpoint)
    
    slidesData = signal<any[]>([])
    disableTransition = signal(false)
    currentSlide = signal(0)
    slidesToShow = computed(() => this.config().slidesToShow ?? 1)
    activeConfig = computed(() => this.config())

    slidesWithClones = computed(() => {
        const slides = this.slidesData()
        const length = slides.length
        const slidesToShow = this.slidesToShow()

        if (length <= 0) return []

        if (this.config().loop && length >= slidesToShow) {
            const startClones = slides.slice(length - slidesToShow) // Клоны последних N слайдов
            const endClones = slides.slice(0, slidesToShow)         // Клоны первых N слайдов

            return [
                ...startClones, // Клон последнего в начало
                ...slides,          // Все оригинальные
                ...endClones           // Клон первого в конец
            ]
        }

        return slides
    })


    constructor(
        @Optional() @Inject(NGX_CAROUSEL_CONFIG) defaultCtf: NgxCarouselConfig
    ) {
        this.config.set({
            ...DEFAULT_CAROUSEL_CONFIG,
            ...defaultCtf || {}
        })

        this.updateActiveBreakpoint(this.width())

        // console.log("WIDTH", this.width)
    }

    getConfig(): NgxCarouselConfig {
        return this.config()
    }

    setWidth(width: number) {
        this.width.set(width)
        this.updateActiveBreakpoint(width)
    }

    registerSlides(slidesData: any[]) {
        this.slidesData.set(slidesData)

        const index = this.config().loop ?
            ((this.config().startIndex ?? 0) + this.slidesToShow()) :
            (this.config().startIndex ?? 0)

        this.currentSlide.set(index)
    }

    getSlidesLength() {
        return this.slidesData().length
    }

    updateActiveBreakpoint(width: number) {
        const breakpoints = this.config().breakpoints || [];

        // Сортируем брейкпоинты по убыванию
        const sortedBreakpoints = [...breakpoints].sort((a, b) => b.breakpoint - a.breakpoint);

        // Находим подходящий брейкпоинт
        const active = sortedBreakpoints.find(bp => width >= bp.breakpoint) || {} as NgxCarouselBreakpoint;

        // console.log("🔸 active:", active)
        this.config.update(ctf => ({...ctf, ...active}))
        // console.log("🔸 this.config:", this.config())
        // this.activeBreakpoint.set(active);
    }

    next() {
        const length = this.slidesWithClones().length
        if (length <= 1) return

        this.disableTransition.set(false)
        const current = this.currentSlide()
        const slidesToShow = this.slidesToShow()

        if (this.config().loop) {
            // Переходим к следующему слайду (даже если это клон)
            this.currentSlide.set(current + 1)

            // Если достигли клона
            if (current + slidesToShow >= length - 1) {
                // Сбрасываем на первый оригинальный слайд
                this.scheduleSnapToReal(slidesToShow)
            }
        } else if (current + 1 < length) {
            // В режиме без loop просто проверяем границы
            this.currentSlide.set(current + 1)
        }
    }

    prev() {
        const length = this.slidesWithClones().length
        if (length <= 1) return

        this.disableTransition.set(false)
        const current = this.currentSlide()
        const slidesToShow = this.slidesToShow()

        if (this.config().loop) {
            // Переходим к предыдущему слайду (даже если это клон)
            this.currentSlide.set(current - 1)

            if (current - slidesToShow <= 0) {
                this.scheduleSnapToReal(length - 1 - slidesToShow)
            }
        } else if (current > 0) {
            this.currentSlide.set(current - 1)
        }
    }

    /**
   * Мгновенный переход к реальному слайду после завершения анимации
   */
    private scheduleSnapToReal(realIndex: number) {
        // Дожидаемся завершения анимации 
        setTimeout(() => {
            // Отключаем анимацию
            this.disableTransition.set(true)

            // Выполняем мгновенное переключение слайда без анимации
            this.currentSlide.set(realIndex)

            // Чтобы операция включения анимации выполнилась на следующем цикле Event Loop, задаем таймер
            setTimeout(() => {
                this.disableTransition.set(false)
            }, 50);
        }, 500); // Должно совпадать с длительностью transition в CSS
    }

    goTo(index: number) {
        const length = this.getSlidesLength();
        if (length <= 0) return;

        const slidestToShow = this.slidesToShow()

        if (this.config().loop) {
            // В режиме loop просто устанавливаем целевой индекс
            this.currentSlide.set(index + slidestToShow);
        } else {
            this.currentSlide.set(index);
        }
    }

    getDisplayIndex(): number {
        const length = this.getSlidesLength();
        if (length <= 0) return 0;

        const current = this.currentSlide();
        const slidesToShow = this.slidesToShow()

        // Если loop отключен, то просто вернем индекс текущего слайда
        if (!this.config().loop) return current

        // Если на клоне последнего (индекс 0), показываем последний реальный
        if (current === 0) return length - 1;

        // Если на клоне первого (индекс len + 1), показываем первый реальный
        if (current === length + 1) return 0;

        // Иначе вычитаем 1, так как реальные слайды начинаются с индекса 1
        return current - 1;
    }


}