import { Component, OnInit } from '@angular/core';
import { Filament } from '../_interface/filament';
import { DataService } from '../_service/data.service';
import Swal from 'sweetalert2';
import { AlertService } from '../_service/alert.service';
import { ToastService } from '../_service/toast.service';
import { Hersteller } from '../_interface/hersteller';
import { Material } from '../_interface/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-page-filament',
  templateUrl: './page-filament.component.html',
  styleUrls: ['./page-filament.component.scss']
})
export class PageFilamentComponent implements OnInit {
  filamentList: Filament[] = []
  herstellerList: Hersteller[] = []
  materialList: Material[] = []

  showForm = true
  filamentForm!: FormGroup

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private toastService: ToastService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.dataService.filament.filament$.subscribe(list => {
      this.filamentList = list
    })
    
    this.dataService.hersteller.hersteller$.subscribe(h => this.herstellerList = h)
    this.dataService.material.material$.subscribe(m => this.materialList = m)

    this.initForm()
  }

  initForm() {
    this.filamentForm = this.fb.group({
      farbe: ['', Validators.required],
      farbcode: ['#000000', [Validators.required, Validators.pattern(/^#([0-9A-Fa-f]{6})$/)]],
      hersteller_id: [null, Validators.required],
      material_id: [null, Validators.required],
      gewicht_filament: [null, [Validators.required, Validators.min(0)]],
      gewicht_spule: [null, [Validators.required, Validators.min(0)]],
      preis: [null, [Validators.required, Validators.min(0)]],
      link: [''],
      temp_extruder: [200, [Validators.required, Validators.min(0)]],
      temp_bed: [60, [Validators.required, Validators.min(0)]],
    })
  }

  toggleForm() {
    this.showForm = !this.showForm
    if(!this.showForm) {
      this.resetForm()
    }
  }

  submit() {
    if (this.filamentForm.invalid) {
      this.filamentForm.markAllAsTouched()
      return
    }

    const filament = this.filamentForm.value

    this.dataService.filament.create(filament).subscribe({
      next: (res) => {
        this.toastService.success(`Filament "${filament.farbe}" wurde erfolgreich hinzugefügt.`, "Hinzufügen erfolgreich")
        this.showForm = true
        this.resetForm()
      },
      error: (err) => {
        this.toastService.error(err.error.message, 'Filament-Hinzufügen fehlgeschlagen');
      }
    })
  }

  resetForm() {
  this.filamentForm.reset({
    farbe: '',
    farbcode: '#000000',
    hersteller_id: null,
    material_id: null,
    gewicht_filament: null,
    gewicht_spule: null,
    preis: null,
    link: '',
    temp_extruder: 200,
    temp_bed: 60
  });

  this.filamentForm.markAsPristine()
  this.filamentForm.markAsUntouched()
  this.filamentForm.updateValueAndValidity()
}

}
