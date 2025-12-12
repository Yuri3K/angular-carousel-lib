import { Inject, Injectable, Optional, signal } from "@angular/core";
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselConfig } from "../ngx-carousel.types";

@Injectable({
    providedIn: 'root'
})

export class NgxCarouselService {
    private config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG)
    private slidesData = signal<any[]>([])
    currentSlide = signal(0)

    constructor(
        @Optional() @Inject(NGX_CAROUSEL_CONFIG) defaultCtf: NgxCarouselConfig
    ) {
        this.config.set({
            ...DEFAULT_CAROUSEL_CONFIG,
            ...defaultCtf || {}
        })
        console.log("🔸 this.config:", this.config())
    }

    getConfig(): NgxCarouselConfig {
        return this.config()
    }

    registerSlides(slidesData: any[]) {
        this.slidesData.set(slidesData)
    }

    getSlidesLength() {
        return this.slidesData().length
    }

    next() {
        console.log("NEXT")
        const length = this.getSlidesLength()
        if (length <= 0) return
        this.currentSlide.update(i => i + 1)
    }

    prev() {
        const length = this.getSlidesLength()
        if (length <= 0) return
        this.currentSlide.update(i => i - 1)
    }
}