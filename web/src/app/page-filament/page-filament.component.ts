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

  hiddeForm = true
  editingFilament: Filament | null = null;
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
    this.hiddeForm = !this.hiddeForm

      // this.resetForm()
    if(this.hiddeForm) {
      this.resetForm()
    }
  }

  public async submit() {
    if (this.filamentForm.invalid) {
      this.filamentForm.markAllAsTouched()
      return
    }

    const filament = this.filamentForm.value
    
    const result = await Swal.fire(this.alertService.createFilamentConfig(filament, !this.editingFilament))

    if(result.isConfirmed) {
      if(this.editingFilament) {
        this.dataService.filament.update(filament, this.editingFilament.id).subscribe({
          next: (res) => {
            this.toastService.success(`Filament "${filament.farbe}" wurde erfolgreich aktualisiert.`, "Aktualisieren erfolgreich")
            this.resetForm()
            this.hiddeForm = true
            this.editingFilament = null
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Filament-Aktualisieren fehlgeschlagen');
          }
        })
      } else {
        this.dataService.filament.create(filament).subscribe({
          next: (res) => {
            this.toastService.success(`Filament "${filament.farbe}" wurde erfolgreich hinzugefügt.`, "Hinzufügen erfolgreich")
            this.resetForm()
            this.hiddeForm = true
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Filament-Hinzufügen fehlgeschlagen');
          }
        })
      }
    }
  }

  private resetForm() {
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

    Object.values(this.filamentForm.controls).forEach(control => {
      control.markAsPristine()
      control.markAsUntouched()
      control.updateValueAndValidity({emitEvent: false})
    })

    this.filamentForm.updateValueAndValidity({emitEvent: false})
  }

  public updateFilament(filament: Filament) {
    this.editingFilament = filament;
    this.hiddeForm = false;

    this.filamentForm.patchValue({
      farbe: filament.farbe,
      farbcode: filament.farbcode,
      hersteller_id: filament.hersteller.id,
      material_id: filament.material.id,
      gewicht_filament: filament.gewicht_filament,
      gewicht_spule: filament.gewicht_spule,
      preis: filament.preis,
      link: filament.link,
      temp_extruder: filament.temp_extruder,
      temp_bed: filament.temp_bed
    });
  }

}
