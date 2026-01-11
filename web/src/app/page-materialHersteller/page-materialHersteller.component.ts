import { Component, OnInit } from '@angular/core';
import { Material } from '../_interface/material';
import { DataService } from '../_service/data.service';
import { Hersteller } from '../_interface/hersteller';
import Swal from 'sweetalert2';
import { AlertService } from '../_service/alert.service';
import { ToastService } from '../_service/toast.service';
import { Legende } from '../_interface/legende';

@Component({
  selector: 'app-page-materialHersteller',
  templateUrl: './page-materialHersteller.component.html',
  styleUrls: ['./page-materialHersteller.component.scss'],
  standalone: false,
})
export class PageMaterialHerstellerComponent implements OnInit {
  materialList: Material[] = []
  gefilterteMaterialList: Material[] = []

  herstellerListe: Hersteller[] = []
  gefilterteHerstellerListe: Hersteller[] = []

  materialSearch: string = ''
  herstellerSearch: string = ''

  legendeHersteller: Legende[] = [
    {label: 'Name', class: 'aktionen'},
    {label: 'Aktionen', class: 'aktionen'},
  ]

  legendeMaterial: Legende[] = [
    {label: 'Name', class: 'material'},
    {label: 'Durchmesser', class: 'material'},
    {label: 'Dichte', class: 'material'},
    {label: 'Aktionen', class: 'aktionen'},
  ]

  constructor(
      private dataService: DataService,
      private alertService: AlertService,
      private toastService: ToastService,
    ) { }

  ngOnInit() {
    this.dataService.dataState$.subscribe(state => {
      this.materialList = state.material
      this.gefilterteMaterialList = state.material 

      this.herstellerListe = state.hersteller   
      this.gefilterteHerstellerListe = state.hersteller   
    })
  }

  public async addHersteller(name?: string) {
    const result = await Swal.fire(this.alertService.hersteller.createConfig(name))

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

  public filterHersteller() {
    const search = this.herstellerSearch.toLowerCase().trim()

    this.gefilterteHerstellerListe = this.herstellerListe.filter(hersteller => hersteller.name.toLowerCase().includes(search))    
  }

  public async addMaterial(name?: string) {
    const steps = ['1', '2', '3']
    const swalQueue = Swal.mixin(this.alertService.MixinConfig(steps))
    const material: string = name ? name : ''
    const values = [material, '', '']
    let currentStep

    for (currentStep = 0; currentStep<steps.length;) {
      const result = await swalQueue.fire(this.alertService.material.createUpdateConfig(currentStep, values, true))

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

  public filterMaterial() {
    const search = this.materialSearch.toLowerCase().trim()

    this.gefilterteMaterialList = this.materialList.filter(material => material.name.toLowerCase().includes(search))    
  }

}
