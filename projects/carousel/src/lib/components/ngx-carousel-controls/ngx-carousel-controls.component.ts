import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxCarouselService } from '../../services/ngx-carousel.service';

@Component({
  selector: 'lib-ngx-carousel-controls',
  imports: [],
  templateUrl: './ngx-carousel-controls.component.html',
  styleUrl: './ngx-carousel-controls.component.scss',
})
export class NgxCarouselControlsComponent implements OnInit {
  carousel = inject(NgxCarouselService);

  private resizeObserver!: ResizeObserver;
  widthTest = 0

  ngOnInit() {
    console.log('INIT');
    setTimeout(() => {
      this.watchResize();
      
    }, 3000);
    setInterval(() =>   {
      console.log("TEST", this.widthTest)
    }, 100)
  }

  private watchResize() {
    console.log('IN');

    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      console.log('🚀 ~ width:', width);
      this.widthTest = width
      // this.layout.setCarouselWidth(width);
      // this.state.setWidth(width);
    });
    console.log("🚀 ~ this.resizeObserver:", this.resizeObserver)
  }
}
