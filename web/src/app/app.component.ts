import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showScrollUp = false

  constructor (
  ) {}

  @HostListener('window:scroll')
  onWindowScroll(){
    this.showScrollUp = window.scrollY > 200
  }

  scrollUp() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
}
