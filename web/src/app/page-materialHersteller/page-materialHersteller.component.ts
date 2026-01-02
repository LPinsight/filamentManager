import { Component, OnInit } from '@angular/core';
import { Material } from '../_interface/material';
import { DataService } from '../_service/data.service';
import { Hersteller } from '../_interface/hersteller';
import Swal from 'sweetalert2';
import { AlertService } from '../_service/alert.service';
import { ToastService } from '../_service/toast.service';

@Component({
  selector: 'app-page-materialHersteller',
  templateUrl: './page-materialHersteller.component.html',
  styleUrls: ['./page-materialHersteller.component.scss'],
  standalone: false,
})
export class PageMaterialHerstellerComponent implements OnInit {
  materialList: Material[] = []
  herstellerListe: Hersteller[] = []

  constructor(
      private dataService: DataService,
      private alertService: AlertService,
      private toastService: ToastService,
    ) { }

  ngOnInit() {
    this.dataService.material.material$.subscribe(liste => {
      this.materialList = liste
    })
    this.dataService.hersteller.hersteller$.subscribe(liste => {
      this.herstellerListe = liste      
    })
  }

  public async addHersteller() {
    const result = await Swal.fire(this.alertService.createHerstellerConfig())

    if (result.isConfirmed) {
      this.dataService.hersteller.create(result.value).subscribe({
        next: (res) => {
          this.toastService.success(`Hersteller "${result.value}" wurde erfolgreich hinzugefügt.`, "Hinzufügen erfolgreich")
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Hersteller-Hinzufügen fehlgeschlagen');
        }
      })
    }
  }

  public async addMaterial() {
    const steps = ['1', '2', '3']
    const swalQueue = Swal.mixin(this.alertService.MixinConfig(steps))
    const values = ['', '', '']
    let currentStep

    for (currentStep = 0; currentStep<steps.length;) {
      const result = await swalQueue.fire(this.alertService.createMaterialConfig(currentStep, values, true))

      if (result.value) {
        values[currentStep] = result.value
        currentStep++
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        currentStep--        
      } else if (result.dismiss === Swal.DismissReason.close) {
        break
      }
    }

    if (currentStep === steps.length) {
      this.dataService.material.create(values[0], Number(values[1]), Number(values[2])).subscribe({
        next: (res) => {
          this.toastService.success(`Material "${values[0]}" wurde erfolgreich hinzugefügt.`, "Hinzufügen erfolgreich")
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Material-Hinzufügen fehlgeschlagen');
        }
      })
    }
  }

}
