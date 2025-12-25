import { inject, Injectable, signal } from '@angular/core';
import { NgxStateService } from './ngx-state.service';

@Injectable()
export class NgxCarouselService {
  private state = inject(NgxStateService)

  private jumpTimer: any = null;

  disableTransition = signal(false);
  isAnimating = signal(false);


  next() {
    if (!this.startAnimation()) return

    const length = this.state.slidesWithClones().length
    if (length <= 1) return;

    if (this.state.isFade()) {
      const nextNum = (this.state.currentSlide() + 1) % length
      this.state.setCurrentSlide(nextNum)
      return
    }

    this.disableTransition.set(false);
    const current = this.state.currentSlide();
    const slidesToShow = this.state.slidesToShow()

    if (this.state.loop()) {
      // Переходим к следующему слайду (даже если это клон)
      this.state.setCurrentSlide(current + 1);

      // Если достигли клона
      if (current + slidesToShow >= length - 1) {
        // Сбрасываем на первый оригинальный слайд
        const index = this.getRealIndex(current + 1)
        this.scheduleJumpToReal(index);
      }
    } else if (current + 1 < length) {
      // В режиме без loop просто проверяем границы
      this.state.setCurrentSlide(current + 1);
    }
  }

  prev() {
    if (!this.startAnimation()) return;

    const length = this.state.slidesWithClones().length;
    if (length <= 1) return;

    if (this.state.isFade()) {
      const prev = (this.state.currentSlide() - 1 + length) % length;
      this.state.setCurrentSlide(prev);
      return;
    }

    this.disableTransition.set(false);
    const current = this.state.currentSlide();
    const slidesToShow = this.state.slidesToShow();

    if (this.state.activeConfig().loop) {
      // Переходим к предыдущему слайду (даже если это клон)
      this.state.setCurrentSlide(current - 1);

      if (current - slidesToShow <= 0) {
        console.log("🔸 current:", current)
        const index = this.getRealIndex(current - 1);
        console.log("🔸 index:", index)
        this.scheduleJumpToReal(index);
      }
    } else if (current > 0) {
      this.state.setCurrentSlide(current - 1);
    }
  }

  // /**
  //  * Мгновенный переход к реальному слайду после завершения анимации
  //  */
  // private scheduleJumpToReal(realIndex: number) {
  //   // Дожидаемся завершения анимации
  //   setTimeout(() => {
  //     // Отключаем анимацию
  //     this.disableTransition.set(true);

  //     // Выполняем мгновенное переключение слайда без анимации
  //     this.state.setCurrentSlide(realIndex);

  //     // Чтобы операция включения анимации выполнилась на следующем цикле Event Loop, задаем таймер
  //     setTimeout(() => {
  //       this.disableTransition.set(false);
  //     }, 50);
  //   }, 500); // Должно совпадать с длительностью transition в CSS
  // }

  private scheduleJumpToReal(realIndex: number) {
    //Если таймер уже запущен, то остановить и обнулить
    if(this.jumpTimer) {
      clearTimeout(this.jumpTimer)
      this.jumpTimer = null
    }

    const slidesToShow = this.state.slidesToShow()
    const realTarget = realIndex + slidesToShow

    // Заново запысываес новый таймер
    this.jumpTimer = setTimeout(() => {
      this.disableTransition.set(true)
      this.state.setCurrentSlide(realTarget)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.disableTransition.set(false)
          if(this.jumpTimer) {
            clearTimeout(this.jumpTimer)
            this.jumpTimer = null
          }
        })
      })
    }, this.state.speed());
  }

  goTo(index: number) {
    const length = this.state.slides().length
    if (length <= 0) return;

    const slidestToShow = this.state.slidesToShow();

    if (this.state.loop()) {
      // В режиме loop просто устанавливаем целевой индекс
      this.state.setCurrentSlide(index + slidestToShow);
    } else {
      this.state.setCurrentSlide(index);
    }
  }

  getDisplayIndex(): number {
    const length = this.state.slidesWithClones().length;
    if (length <= 0) return 0;

    const current = this.state.currentSlide();
    const slidesToShow = this.state.slidesToShow();

    // Если loop отключен, то просто вернем индекс текущего слайда
    if (!this.state.loop()) return current;

    // Если на клоне последнего (индекс 0), показываем последний реальный
    if (current === 0) return length - 1;

    // Если на клоне первого (индекс len + 1), показываем первый реальный
    if (current === length - slidesToShow) return 0;

    // Иначе вычитаем slidesToShow, так как реальные слайды начинаются с индекса slidesToShow
    return current - slidesToShow;
  }

  startAnimation(): boolean {
    if (this.isAnimating()) return false;
    this.isAnimating.set(true);

    const duration = this.state.speed();

    setTimeout(() => {
      this.isAnimating.set(false);
    }, duration);

    return true;
  }

  private getRealIndex(virtualIndex: number): number {
    const length = this.state.slides().length
    const slidesToShow = this.state.slidesToShow()

    if (!this.state.loop()) return virtualIndex

    let real = virtualIndex - slidesToShow

    if (real < 0) real += length
    if (real >= length) real -= length

    return real
  }
}
