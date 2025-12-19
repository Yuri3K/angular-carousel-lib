import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { NgxCarouselStateService } from './ngx-carousel-state.service';
import { NgxCarouselNavigationService } from './ngx-carousel-navigation.service';

@Injectable()

export class NgxAutoplayService {
  private navigation = inject(NgxCarouselNavigationService)
  private state = inject(NgxCarouselStateService)
  private isPlaying = signal(true)
  private config = computed(() => this.state.activeConfig());
  private timerAutoplay: any = null

  constructor() {
    effect(() => {
      if(!this.config().autoplay || this.state.getSlidesLength() <= 1) {
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
    this.timerAutoplay = setInterval(() => this.navigation.next(), delay )
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
