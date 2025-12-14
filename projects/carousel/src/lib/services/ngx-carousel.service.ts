import { computed, Inject, Injectable, Optional, signal } from "@angular/core";
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselConfig } from "../ngx-carousel.types";

@Injectable({
    providedIn: 'root'
})

export class NgxCarouselService {
    private config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG)
    slidesData = signal<any[]>([])
    disableTransition = signal(false)
    currentSlide = signal(0)

    slidesWithClones = computed(() => {
        const slides = this.slidesData()
        const length = slides.length

        if (length <= 0) return []

        if (this.config().loop && length > 1) {
            return [
                slides[length - 1], // Клон последнего в начало
                ...slides,          // Все оригинальные
                slides[0]           // Клон первого в конец
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
    }

    getConfig(): NgxCarouselConfig {
        return this.config()
    }

    registerSlides(slidesData: any[]) {
        this.slidesData.set(slidesData)

        const index = this.config().loop ?
            ((this.config().startIndex ?? 0) + 1) :
            (this.config().startIndex ?? 0)

        this.currentSlide.set(index)
    }

    getSlidesLength() {
        return this.slidesData().length
    }

    next() {
        const length = this.getSlidesLength()
        if (length <= 1) return

        this.disableTransition.set(false)
        const current = this.currentSlide()

        if (this.config().loop) {
            // Переходим к следующему слайду (даже если это клон)
            this.currentSlide.set(current + 1)

            // Если достигли клона
            if (current + 1 >= length + 1) {
                // Сбрасываем на первый оригинальный слайд
                this.scheduleSnapToReal(1)
            }
        } else if (current + 1 < length) {
            // В режиме без loop просто проверяем границы
            this.currentSlide.set(current + 1)
        }
    }

    prev() {
        const length = this.getSlidesLength()
        if (length <= 1) return

        this.disableTransition.set(false)
        const current = this.currentSlide()

        if (this.config().loop) {
            this.currentSlide.set(current - 1)

            if (current - 1 <= 0) {
                this.scheduleSnapToReal(length)
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
        const len = this.getSlidesLength();
        if (len === 0) return;

        if (this.config().loop) {
            // В режиме loop просто устанавливаем целевой индекс
            this.currentSlide.set(index + 1);
        } else {
            this.currentSlide.set(index);
        }
    }

    getDisplayIndex(): number {
        const len = this.getSlidesLength();
        if (len === 0) return 0;

        const current = this.currentSlide();

        // Если loop отключен, то просто вернем индекс текущего слайда
        if (!this.config().loop) return current

        // Если на клоне последнего (индекс 0), показываем последний реальный
        if (current === 0) return len - 1;

        // Если на клоне первого (индекс len + 1), показываем первый реальный
        if (current === len + 1) return 0;

        // Иначе вычитаем 1, так как реальные слайды начинаются с индекса 1
        return current - 1;
    }


}