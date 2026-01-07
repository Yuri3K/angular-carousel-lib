import { inject, Injectable } from '@angular/core';
import { NgxStateService } from './ngx-state.service';
import { NgxLayoutService } from './ngx-layout.service';

@Injectable()
export class NgxNonStopService {
  private state = inject(NgxStateService);
  private layout = inject(NgxLayoutService);

  private rafId: number | null = null;
  private lastTime = 0;

  start() {
    if (this.rafId !== null) return;

    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (time: number) => {
    const delta = time - this.lastTime;
    this.lastTime = time;

    const speedPxPerMs = (this.state.nonStopSpeed() ?? 40) / 1000;

    this.state.nonStopOffsetPx.update((v) => v + delta * speedPxPerMs);

    const limitWidth =
      this.state.slides().length * 2 *
      (this.layout.slideWidthPx() + this.state.space());

    if (this.state.nonStopOffsetPx() >= limitWidth) {
      this.state.nonStopOffsetPx.set(0);
    }

    this.rafId = requestAnimationFrame(this.tick);
  };
}
