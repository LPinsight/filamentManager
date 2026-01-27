import { Component, HostListener, OnInit } from '@angular/core';
import { WebsocketService } from './_service/websocket.service';
import { ToastService } from './_service/toast.service';
import { DataService } from './_service/data.service';
import { AlertService } from './_service/alert.service';
import Swal from 'sweetalert2';

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
    private dataService: DataService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.websocket.connect()

    this.websocket.onAssignResult().subscribe(res => {      
      if(res.success) {
        this.dataService.spule.loadAll().subscribe()
        this.toastService.success('NFC-Tag wurde erfolgreich zugewiesen', 'NFC-Zuordnung Erfolgreich')
      } else {
        this.toastService.error(res.message || 'NFC-Zuordnung fehlgeschlagen', 'NFC-Zuordnung Fehlgeschlagen')
      }
    })

    this.websocket.onAssignWeight().subscribe(async res => {
      let spule = this.dataService.spule.getSpuleById(res.spoolId)
      if (spule === undefined) {
        return
      }
      
      const result = await Swal.fire(this.alertService.spule.chanceGewichtConfig(spule))
      if(result.isConfirmed) {
      const {gewicht} = result.value
      
      this.dataService.spule.updateGewicht(res.spoolId, gewicht).subscribe({
        next: (res) => {
          this.toastService.success(`Gewicht wurde erfolgreich angepasst.`, `Anpassung erfolgreich`)
        },
        error: (err) => {
          this.toastService.error(err.error.message, `Gewicht-Anpassung fehlgeschlagen`);
        }
      })
      
    }
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
