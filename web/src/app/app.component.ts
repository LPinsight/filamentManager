import { Component, HostListener, OnInit } from '@angular/core';
import { WebsocketService } from './_service/websocket.service';
import { ToastService } from './_service/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showScrollUp = false

  constructor (
    private websocket: WebsocketService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.websocket.connect()

    this.websocket.onButtonPress().subscribe(res => {
      this.toastService.info(res.button)
      console.log(res);
    })

    this.websocket.onRfidScan().subscribe(res => {
      this.toastService.info(res.uid)
      console.log(res);
    })
    
  }

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
