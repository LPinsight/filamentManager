import { Component, Input, OnInit } from '@angular/core';
import { Ort } from '../../_interface/ort';
import { Spule } from '../../_interface/spule';
import { AlertService } from '../../_service/alert.service';
import { DataService } from '../../_service/data.service';
import { ToastService } from '../../_service/toast.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-template-list-ort',
  templateUrl: './template-list-ort.component.html',
  styleUrls: ['./template-list-ort.component.scss'],
  standalone: false
})
export class TemplateListOrtComponent implements OnInit {
  @Input() ort!: Ort
  @Input() spulenList!: Spule[]

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    
  }

  public async update() {
    const result = await Swal.fire(this.alertService.ort.updateConfig(this.ort.name))

    if (result.isConfirmed) {
      this.dataService.ort.update(result.value, this.ort.id).subscribe({
        next: (res) => {
          this.toastService.success(`Ort "${this.ort.name}" wurde erfolgreich angepasst.`, "Anpassung erfolgreich")
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Ort-Anpassung fehlgeschlagen');
        }
      })
    }
  }

  public async remove() {
    const result = await Swal.fire(this.alertService.ort.removeConfig(this.ort.name))

    if (!result.isDenied){
      return
    }

    if (this.spulenList.length === 0){
      this.removeFunc()
      return
    }

    const update$ = this.spulenList.map(spule => {
      return this.dataService.spule.updateOrt(spule.id, null)
    })

    forkJoin(update$).subscribe({
      next: () => this.removeFunc(),
      error: err => {
        console.log(err);
        
        this.toastService.error(err.error?.message, 'Fehler beim Aktualisieren der Spulen');
      }
    })
  }

  private removeFunc() {
    this.dataService.ort.remove(this.ort.id).subscribe({
      next: (res) => {
        this.toastService.success(`Ort "${this.ort.name}" wurde erfolgreich entfernt.`, "Entfernen erfolgreich")
      },
      error: (err) => {
        this.toastService.error(err.error.message, 'Ort-Entfernen fehlgeschlagen');
      }
    })
  }

}
