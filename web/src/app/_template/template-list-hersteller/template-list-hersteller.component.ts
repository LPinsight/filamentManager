import { Component, Input, OnInit } from '@angular/core';
import { Hersteller } from '../../_interface/hersteller';
import { ToastService } from '../../_service/toast.service';
import Swal from 'sweetalert2';
import { AlertService } from '../../_service/alert.service';
import { DataService } from '../../_service/data.service';

@Component({
  selector: 'app-template-list-hersteller',
  templateUrl: './template-list-hersteller.component.html',
  styleUrls: ['./template-list-hersteller.component.scss'],
  standalone: false
})
export class TemplateListHerstellerComponent implements OnInit {
  @Input() hersteller!: Hersteller;

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {    
  }

  public async updateHersteller() {
    const result = await Swal.fire(this.alertService.hersteller.updateConfig(this.hersteller.name))

    if (result.isConfirmed) {
      this.dataService.hersteller.update(result.value, this.hersteller.id).subscribe({
        next: (res) => {
          this.toastService.success(`Hersteller "${this.hersteller.name}" wurde erfolgreich entfernt.`, "Entfernen erfolgreich")
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Hersteller-Entfernen fehlgeschlagen');
        }
      })
    }
  }

  public async removeHersteller() {
    const result = await Swal.fire(this.alertService.hersteller.removeConfig(this.hersteller.name))

    if (result.isDenied) {
      this.dataService.hersteller.remove(this.hersteller.id).subscribe({
        next: (res) => {
          this.toastService.success(`Hersteller "${this.hersteller.name}" wurde erfolgreich entfernt.`, "Entfernen erfolgreich")
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Hersteller-Entfernen fehlgeschlagen');
        }
      })
    }
  }

}
