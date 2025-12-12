import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class NgxCarouselService {
    slidesData = signal<any[]>([])
    currentSlide = signal(0)

    registerSlides(slidesData: any[]) {
        this.slidesData.set(slidesData)
    }

    getSlidesLength() {
        return this.slidesData().length
    }

    next() {
        const length = this.getSlidesLength()
        this.currentSlide.update(i => i + 1)
        console.log("🚀 ~ this.currentSlide:", this.currentSlide())
    }

    prev() {
        const length = this.getSlidesLength()
        this.currentSlide.update(i => i - 1)
    }
}