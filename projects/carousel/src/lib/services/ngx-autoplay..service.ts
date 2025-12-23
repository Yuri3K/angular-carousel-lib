import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { NgxCarouselService } from './ngx-carousel.service';

@Injectable()
export class NgxAutoplayService {
  private carousel = inject(NgxCarouselService)
  private isPlaying = signal(true)
  private config = computed(() => this.carousel.getConfig());
  private timerAutoplay: any = null

  constructor() {
    effect(() => {
      if(!this.config().autoplay || this.carousel.getSlidesLength() <= 1) {
        this.stop()
        return
      }

      this.config().autoplay ?
        this.resume() :
        this.stop()
    })
  }

  private start() {

    if (!this.config().autoplay || !this.isPlaying()) return
    
    this.stop()
    const delay  = this.config().interval ?? 5000
    this.timerAutoplay = setInterval(() => this.carousel.next(), delay )
  }

  stop() {
    this.isPlaying.set(false)
    if (this.timerAutoplay) {
      clearInterval(this.timerAutoplay)
      this.timerAutoplay = null
    }
  }

  pause() {
    if(this.config().pauseOnHover) {
      this.stop();
    }
  }

  resume() {
    if(this.config().autoplay) {
      this.isPlaying.set(true);

      setTimeout(() => this.start(), 0);
    }
  }
}
