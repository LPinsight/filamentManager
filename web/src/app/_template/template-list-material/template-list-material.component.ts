import { Component, Input, OnInit } from '@angular/core';
import { Material } from '../../_interface/material';
import { AlertService } from '../../_service/alert.service';
import { DataService } from '../../_service/data.service';
import { ToastService } from '../../_service/toast.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-template-list-material',
  templateUrl: './template-list-material.component.html',
  styleUrls: ['./template-list-material.component.scss'],
  standalone: false
})
export class TemplateListMaterialComponent implements OnInit {
  @Input() material!: Material

  constructor(
      private dataService: DataService,
      private alertService: AlertService,
      private toastService: ToastService,
    ) { }

  ngOnInit() {
  }

  public async updateMaterial() {
    const steps = ['1', '2', '3']
    const swalQueue = Swal.mixin(this.alertService.MixinConfig(steps))
    const values = [this.material.name, this.material.dichte.toString(), this.material.durchmesser.toString()]
    let currentStep

    for (currentStep = 0; currentStep<steps.length;) {
      const result = await swalQueue.fire(this.alertService.createMaterialConfig(currentStep, values, false))

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
      this.dataService.material.update(this.material.id, values[0], Number(values[1]), Number(values[2])).subscribe({
        next: (res) => {
          this.toastService.success(`Material "${values[0]}" wurde erfolgreich angepasst.`, "Aktualisierung erfolgreich")
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Material-Aktualisierung fehlgeschlagen');
        }
      })
    }
  }

  public async removeMaterial() {
    const result = await Swal.fire(this.alertService.removeMaterialConfig(this.material.name))
    
    if (result.isDenied) {
      this.dataService.material.remove(this.material.id).subscribe({
        next: (res) => {
          this.toastService.success(`Material "${this.material.name}" wurde erfolgreich entfernt.`, "Entfernen erfolgreich")
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Material-Entfernen fehlgeschlagen');
        }
      })
    }
  }

}
