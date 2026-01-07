import { Component, OnInit } from '@angular/core';
import { DataService } from '../_service/data.service';
import { Ort, OrtmitSpulen } from '../_interface/ort';
import { AlertService } from '../_service/alert.service';
import { ToastService } from '../_service/toast.service';
import Swal from 'sweetalert2';
import { Spule } from '../_interface/spule';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-page-ort',
  templateUrl: './page-ort.component.html',
  styleUrls: ['./page-ort.component.scss']
})
export class PageOrtComponent implements OnInit {
  orteListe: Ort[] = []
  ortMitSpulen: OrtmitSpulen[] = []

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.dataService.ort.ort$.subscribe(liste => {
      this.orteListe = liste
    })

    combineLatest([
      this.dataService.ort.ort$,
      this.dataService.spule.spule$
    ]).subscribe(([orte, spulen]) => {
      this.ortMitSpulen = [
        {
          ort: {id: "__kein_ort__", name: "kein Ort"},
          spulen: spulen.filter(s => !s.ort.id)
        },
        ...orte.map(ort => ({
        ort,
        spulen: spulen.filter(s => s.ort?.id === ort.id)
      }))
      ]
    })
  }

  public async createOrt() {
    const result = await Swal.fire(this.alertService.ort.createConfig())

    if (result.isConfirmed) {
      this.dataService.ort.create(result.value).subscribe({
        next: (res) => {
          this.toastService.success(`Ort "${result.value}" wurde erfolgreich hinzugefügt.`, "Hinzufügen erfolgreich")
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Ort-Hinzufügen fehlgeschlagen');
        }
      })
    }


  }

}
