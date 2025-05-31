import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-display',
  standalone: true,
  imports: [],
  templateUrl: './menu-display.component.html',
  styleUrl: './menu-display.component.scss'
})
export class MenuDisplayComponent {
 images: string[] = [
    'http://localhost:8083/images/1.png',
    'http://localhost:8083/images/2.png',
    'http://localhost:8083/images/3.png',
    'http://localhost:8083/images/4.png',
    'http://localhost:8083/images/5.png'
    // 'assets/images/slide2.png',
    // 'assets/images/slide3.png'
  ];
  currentIndex = 0;

  ngOnInit(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 5000); // ⏱️ change image every 5 sec
  }
}
