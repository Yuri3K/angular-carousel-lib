import { Component, HostListener, OnInit } from '@angular/core';
import { SlideComponent } from './components/slide/slide.component';
import { NgxCarouselComponent, NgxCarouselConfig } from 'carousel';
import { ControlsComponent } from './components/controls/controls.component';

@Component({
  selector: 'app-root',
  imports: [
    NgxCarouselComponent,
    SlideComponent,
    ControlsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  slides = [
    {
      "id": 0,
      "title": "Freshness Delivered Right to Your Door",
      "subtitle": "50% OFF",
      "descr": "Only from July 7 to 13 — up to 50% off seasonal fruits and veggies. Don’t miss out!",
      "btn": "Buy Now",
      "link": "/",
    },
    {
      "id": 1,
      "title": "Go Wild With Tomatoes",
      "subtitle": "Deal: 3 kg for the Price of 1",
      "descr": "From July 12 to 15, enjoy discounts on homegrown, juicy tomatoes!",
      "btn": "Buy Now",
      "link": "/",
    },
    {
      "id": 2,
      "title": "Make Everyone Else Green With Envy",
      "subtitle": "Greens on Sale",
      "descr": "",
      "btn": "Buy Now",
      "link": "/",
    },
    {
      "id": 3,
      "title": "Make Everyone Else Green With Envy",
      "subtitle": "Greens on Sale",
      "descr": "",
      "btn": "Buy Now",
      "link": "/",
    },
    {
      "id": 4,
      "title": "Make Everyone Else Green With Envy",
      "subtitle": "Greens on Sale",
      "descr": "",
      "btn": "Buy Now",
      "link": "/",
    }
  ]


  configMain: NgxCarouselConfig = {
    autoplay: false,
    interval: 1000,
    loop: true,
    startIndex: 0,
    pauseOnHover: true,
    slidesToShow: 1,
    showDots: true,
    showArrows: true,
    speed: 250,
    spaceBetween: 20,
    breakpoints: [
      {
        breakpoint: 0, // до 768
        showArrows: true,
        showDots: true,
        slidesToShow: 3,

      },
      {
        breakpoint: 768, // от 768
        showArrows: true,
        showDots: true,
        slidesToShow: 3,
      },
      {
        breakpoint: 1024, // от 1024
        showArrows: true,
        showDots: true,
        slidesToShow: 3,
      },

    ]
  }

  configSeconfary: NgxCarouselConfig = {
    autoplay: false,
    interval: 2000,
    loop: true,
    startIndex: 0,
    pauseOnHover: true,
    slidesToShow: 3,
    showDots: true,
    showArrows: true,
    speed: 500,
    spaceBetween: 50,
    animation:'fade',
    breakpoints: [
      {
        breakpoint: 0, // до 768
        showArrows: false,
        showDots: false,
        slidesToShow: 3,
      },
      {
        breakpoint: 768, // от 768
        showArrows: true,
        showDots: true,
        slidesToShow: 3,
      },
      {
        breakpoint: 1024, // от 1024
        showArrows: true,
        showDots: false,
        slidesToShow: 3,
      },

    ]
  }

  windowWidth = 0

  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth
  }

  ngOnInit() {
    this.onResize()
  }
}
