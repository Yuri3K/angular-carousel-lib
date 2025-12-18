import {
  computed,
  inject,
  Inject,
  Injectable,
  Optional,
  Renderer2,
  signal,
} from '@angular/core';
import {
  DEFAULT_CAROUSEL_CONFIG,
  NgxCarouselBreakpoint,
  NgxCarouselConfig,
} from '../ngx-carousel.types';
import { NgxCarouselStateService } from './ngx-carousel-state.service';
import { NgxCarouselLayoutService } from './ngx-carousel-layout.service';

@Injectable({
  providedIn: 'root',
})
export class NgxCarouselService {
  private snapTimer: any = null;

  state = inject(NgxCarouselStateService)
  layout = inject(NgxCarouselLayoutService)

  isSnapping = false;
  isAnimating = signal(false);
  disableTransition = signal(false);

  next() {
    if (!this.startAnimation()) return;

    const length = this.layout.slidesWithClones().length;
    if (length <= 1) return;

    if (this.state.isFade()) {
      const next = (this.state.currentSlide() + 1) % length;
      this.state.setCurrentSlide(next);
      return;
    }

    this.disableTransition.set(false);
    const current = this.state.currentSlide();
    const slidesToShow = this.state.slidesToShow();

    if (this.state.getConfig().loop) {
      // Переходим к следующему слайду (даже если это клон)
      this.state.setCurrentSlide(current + 1);

      // Если достигли клона
      if (current + slidesToShow >= length - 1) {
        // Сбрасываем на первый оригинальный слайд
        const index = this.getRealIndex(current + 1);
        this.scheduleSnapToRealIndex(index);
      }
    } else if (current + 1 < length) {
      // В режиме без loop просто проверяем границы
      this.state.setCurrentSlide(current + 1);
    }
  }

  prev() {
    if (!this.startAnimation()) return;

    const length = this.layout.slidesWithClones().length;
    if (length <= 1) return;

    if (this.state.isFade()) {
      const prev = (this.state.currentSlide() - 1 + length) % length;
      this.state.setCurrentSlide(prev);
      return;
    }

    this.disableTransition.set(false);
    const current = this.state.currentSlide();
    const slidesToShow = this.state.slidesToShow();

    if (this.state.getConfig().loop) {
      // Переходим к предыдущему слайду (даже если это клон)
      this.state.setCurrentSlide(current - 1);

      if (current - slidesToShow <= 0) {
        const index = this.getRealIndex(current - 1);
        this.scheduleSnapToRealIndex(index);
      }
    } else if (current > 0) {
      this.state.setCurrentSlide(current - 1);
    }
  }

  private scheduleSnapToRealIndex(realIndex: number) {
    if (this.isSnapping) {
      if (this.snapTimer) {
        clearTimeout(this.snapTimer);
      }
      this.snapTimer = null;
    }

    this.isSnapping = true;
    const slidesToShow = this.state.slidesToShow();
    const realTarget = realIndex + slidesToShow;

    this.snapTimer = setTimeout(() => {
      this.disableTransition.set(true);
      this.state.setCurrentSlide(realTarget);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.disableTransition.set(false);
          this.isSnapping = false;
          if (this.snapTimer) {
            clearTimeout(this.snapTimer);
          }
          this.snapTimer = null;
        });
      });
    }, this.state.getConfig().speed);
  }

  goTo(index: number) {
    const length = this.state.getSlidesLength();
    if (length <= 0) return;

    const slidestToShow = this.state.slidesToShow();

    if (this.state.getConfig().loop) {
      // В режиме loop просто устанавливаем целевой индекс
      this.state.setCurrentSlide(index + slidestToShow);
    } else {
      this.state.setCurrentSlide(index);
    }
  }

  getDisplayIndex(): number {
    const length = this.layout.slidesWithClones().length;
    if (length <= 0) return 0;

    const current = this.state.currentSlide();
    const slidesToShow = this.state.slidesToShow();

    // Если loop отключен, то просто вернем индекс текущего слайда
    if (!this.state.getConfig().loop) return current;

    // Если на клоне последнего (индекс 0), показываем последний реальный
    if (current === 0) return length - 1;

    // Если на клоне первого (индекс len + 1), показываем первый реальный
    if (current === length - slidesToShow) return 0;

    // Иначе вычитаем slidesToShow, так как реальные слайды начинаются с индекса slidesToShow
    return current - slidesToShow;
  }

  shiftBy(delta: number) {
    if (delta === 0) return;
    if (!this.startAnimation()) return;

    const current = this.state.currentSlide();
    const slidesToShow = this.state.slidesToShow();
    const total = this.layout.slidesWithClones().length;

    let target = current + delta;

    this.disableTransition.set(false);

    if (!this.state.getConfig().loop) {
      const max = total - slidesToShow;
      target = Math.max(0, Math.min(target, max));
      this.state.setCurrentSlide(target);
      return;
    }

    this.state.setCurrentSlide(target);

    // вычисляем РЕАЛЬНЫЙ индекс
    const realIndex = this.getRealIndex(target);

    // если ушли в клоны — снапаемся туда же, но в реальной зоне
    if (target < slidesToShow || target >= total - slidesToShow) {
      this.scheduleSnapToRealIndex(realIndex);
    }
  }

  private getRealIndex(virtualIndex: number): number {
    const length = this.state.getSlidesLength();
    const slidesToShow = this.state.slidesToShow();

    if (!this.state.getConfig().loop) return virtualIndex;

    // виртуальный индекс → реальный
    let real = virtualIndex - slidesToShow;

    if (real < 0) real += length;
    if (real >= length) real -= length;

    return real;
  }

  startAnimation(): boolean {
    if (this.isAnimating()) return false;
    this.isAnimating.set(true);

    const duration = this.state.getConfig().speed ?? 500;

    setTimeout(() => {
      this.isAnimating.set(false);
    }, duration);

    return true;
  }
}
