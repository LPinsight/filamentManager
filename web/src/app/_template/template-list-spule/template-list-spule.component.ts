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
    const result = await Swal.fire(this.alertService.spule.changeArchivConfig(this.spule.filament.farbe, this.spule.filament.hersteller.name, this.spule.filament.material.name, this.spule.archiviert))

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
        const result1 = await Swal.fire(this.alertService.spule.setOrtConfig(this.orteList, this.spule.ort.id))

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
        const result2 = await Swal.fire(this.alertService.spule.removeOrtConfig())
        
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
        return
    }
  }

  public async chanceNFC(event: string) {
    switch(event){
      case "update":        
        const result1 = await Swal.fire(this.alertService.spule.editNfcConfig())

        if (result1.isConfirmed) {
          this.editNummer()
          
        } else if (result1.isDenied) {
          Swal.fire("NFC-Tag an Box senden und zuweisen","", "success")
          
        }
        return
        
      case "remove":
        const result2 = await Swal.fire(this.alertService.spule.removeNfcConfig())
        
        if (result2.isDenied) {
          this.dataService.spule.removeNfc(this.spule.id).subscribe({
            next: (res) => {
              this.toastService.success(`Der NFC-Tag wurde erfolgreich entfernt.`, `NFC-Tag erfolgreich entfernt`)
            },
            error: (err) => {
              this.toastService.error(err.error.message, `NFC-Entfernen fehlgeschlagen`);
            }
          })
        }
        return
      default:
        return
    }
  }

  public async chanceGewicht () {
    const result = await Swal.fire(this.alertService.spule.chanceGewichtConfig(this.spule))

    if(result.isConfirmed) {
      const {gewicht} = result.value
      
      this.dataService.spule.updateGewicht(this.spule.id, gewicht).subscribe({
        next: (res) => {
          this.toastService.success(`Gewicht wurde erfolgreich angepasst.`, `Anpassung erfolgreich`)
        },
        error: (err) => {
          this.toastService.error(err.error.message, `Gewicht-Anpassung fehlgeschlagen`);
        }
      })
      
    }
    
  }

  private async editNummer() {
    const newNummer = await Swal.fire(this.alertService.spule.editNummerConfig(this.spule.nummer))
    let nummer= null;

    if (newNummer.isConfirmed) {
      nummer = newNummer.value
    } else if (newNummer.isDenied) {
      nummer = null
    } else {
      return
    }

    this.dataService.spule.editNummer(this.spule.id, Number(nummer)).subscribe({
        next: (res) => {
          this.toastService.success(`Die Spulen Nummer wurde erfolgreich gespeichert.`, `Nummer erfolgreich gespeichert`)
        },
        error: (err) => {
          this.toastService.error(err.error.message, `Nummer-Speichern fehlgeschlagen`);
        }
      })
  }

  public async remove() {
    const result = await Swal.fire(this.alertService.spule.removeConfig(
      this.spule.filament.farbe,
      this.spule.nummer,
      this.dataService.hersteller.getNameById(this.spule.filament.hersteller.id),
      this.dataService.material.getNameById(this.spule.filament.material.id)))

    if (result.isDenied) {
      this.dataService.spule.remove(this.spule.id).subscribe({
        next: (res) => {
          this.toastService.success(`Spule "${this.spule.nummer}-${this.spule.filament.farbe}" wurde erfolgreich entfernt.`, "Entfernen erfolgreich")
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Spule-Entfernen fehlgeschlagen');
        }
      })
    }

  }

}
