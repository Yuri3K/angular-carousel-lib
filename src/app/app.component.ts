import { Component } from '@angular/core';
import { SlideComponent } from './components/slide/slide.component';
import { NgxCarouselComponent } from 'carousel';

@Component({
  selector: 'app-root',
  imports: [
    NgxCarouselComponent,
    SlideComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  slides = [
      {
        "title": "Freshness Delivered Right to Your Door",
        "subtitle": "50% OFF",
        "descr": "Only from July 7 to 13 — up to 50% off seasonal fruits and veggies. Don’t miss out!",
        "btn": "Buy Now",
        "link": "/",
      },
      {
        "title": "Go Wild With Tomatoes",
        "subtitle": "Deal: 3 kg for the Price of 1",
        "descr": "From July 12 to 15, enjoy discounts on homegrown, juicy tomatoes!",
        "btn": "Buy Now",
        "link": "/",
      },
      {
        "title": "Make Everyone Else Green With Envy",
        "subtitle": "Greens on Sale",
        "descr": "",
        "btn": "Buy Now",
        "link": "/",
      }
    ]
}
