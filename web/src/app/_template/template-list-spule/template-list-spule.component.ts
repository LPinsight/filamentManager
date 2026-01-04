import { Component, Input, OnInit } from '@angular/core';
import { Spule } from '../../_interface/spule';
import { ToastService } from '../../_service/toast.service';
import { AlertService } from '../../_service/alert.service';
import { DataService } from '../../_service/data.service';
import Swal from 'sweetalert2';
import { Ort } from '../../_interface/ort';

@Component({
  selector: 'app-template-list-spule',
  templateUrl: './template-list-spule.component.html',
  styleUrls: ['./template-list-spule.component.scss']
})
export class TemplateListSpuleComponent implements OnInit {
  @Input() spule!: Spule
  orteList: Ort[] = []

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private toastService: ToastService,
  ) {
    this.dataService.ort.ort$.subscribe(o => this.orteList = o)
  }

  ngOnInit() {    
  }

  public async chanceArchiv() {
    const result = await Swal.fire(this.alertService.changeArchivConfig(this.spule.filament.farbe, this.spule.filament.hersteller.name, this.spule.filament.material.name, this.spule.archiviert))

    if (result.isConfirmed) {
      const wordding = this.spule.archiviert ? "aktiviert" : "archiviert"
      const titel = this.spule.archiviert ? "Aktivierung" : "Archivierung"
      this.dataService.spule.updateArchiv(this.spule).subscribe({
        next: (res) => {
          this.toastService.success(`Spule "${this.spule.filament.farbe}" wurde erfolgreich ${wordding}.`, `${titel} erfolgreich`)
        },
        error: (err) => {
          this.toastService.error(err.error.message, `${titel} fehlgeschlagen`);
        }
      })
    }
  }

  public async chanceOrt(event: string) {
    switch(event){
      case "update":
        const result1 = await Swal.fire(this.alertService.setSpulenOrtConfig(this.orteList))

        if (result1.isConfirmed) {
          this.dataService.spule.updateOrt(this.spule.id, result1.value).subscribe({
            next: (res) => {
              this.toastService.success(`Der Ort "${this.dataService.ort.getNameById(result1.value)}" wurde erfolgreich ausgewählt.`, `Ort erfolgreich ausgewählt`)
            },
            error: (err) => {
              this.toastService.error(err.error.message, `Ort-Auswählen fehlgeschlagen`);
            }
          })
        }
        return
        
      case "remove":
        const result2 = await Swal.fire(this.alertService.removeSpulenOrtConfig())
        
        if (result2.isDenied) {
          this.dataService.spule.updateOrt(this.spule.id, null).subscribe({
            next: (res) => {
              this.toastService.success(`Der Ort wurde erfolgreich entfernt.`, `Ort erfolgreich entfernt`)
            },
            error: (err) => {
              this.toastService.error(err.error.message, `Ort-Entfernen fehlgeschlagen`);
            }
          })
        }
        return
      default:
        console.log(undefined);
        return
    }
  }

}
