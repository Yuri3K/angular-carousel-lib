import { effect, inject, Injectable, signal } from '@angular/core';
import { NgxCarouselService } from './ngx-carousel.service';
import { NgxStateService } from './ngx-state.service';

@Injectable()
export class NgxAutoplayService {
  private carousel = inject(NgxCarouselService)
  state = inject(NgxStateService)
  isPlaying = signal(true)
  private timerAutoplay: any = null

  constructor() {
    effect(() => {
      if(!this.state.autoplay() || this.state.slides().length <= 1) {
        this.stop()
        return
      }

      this.state.autoplay() ?
        this.resume() :
        this.stop()
    })
  }

  private start() {

    if (!this.state.autoplay() || !this.isPlaying()) return
    
    this.stop()
    const delay  = this.state.interval() ?? 5000
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
    if(this.state.pauseOnHover()) {
      this.stop();
    }
  }

  resume() {
    if(this.state.autoplay()) {
      this.isPlaying.set(true);

      setTimeout(() => this.start(), 0);
    }
  }

  toggle() {
    if(this.state.mode() == 'non-stop') return

    this.isPlaying() 
      ? this.stop()
      : this.start()
  }
}
