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
    const result = await Swal.fire(this.alertService.createMaterialConfig())

    if (result.isConfirmed) {
      this.toastService.success(result.value, "Hinzufügen erfolgreich")
    }
  }

}
