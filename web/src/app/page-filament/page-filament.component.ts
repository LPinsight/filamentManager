import { Component, OnInit } from '@angular/core';
import { Filament, FilamentSortMode } from '../_interface/filament';
import { DataService } from '../_service/data.service';
import Swal from 'sweetalert2';
import { AlertService } from '../_service/alert.service';
import { ToastService } from '../_service/toast.service';
import { Hersteller } from '../_interface/hersteller';
import { Material } from '../_interface/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FILAMENT_FILTER_CONFIG } from '../_config/filament.config';
import { Legende } from '../_interface/legende';
import { SpulenSortMode, Spule } from '../_interface/spule';
import { sortDirection } from '../_interface/main';

@Component({
  selector: 'app-page-filament',
  templateUrl: './page-filament.component.html',
  styleUrls: ['./page-filament.component.scss']
})
export class PageFilamentComponent implements OnInit {
  filamentList: Filament[] = []
  gefilterteFilamentList: Filament[] = []
  herstellerList: Hersteller[] = []
  materialList: Material[] = []

  preisMin = 0;
  preisMax = 0;
  gewichtMin = 0;
  gewichtMax = 0;

  hiddeForm = true
  editingFilament: Filament | null = null;
  filamentForm!: FormGroup
  filterForm!: FormGroup
  FILAMENT_FILTER_CONFIG = FILAMENT_FILTER_CONFIG

  sortMode: FilamentSortMode = 'farbe'
  sortDirection: sortDirection = 'asc'

  legende: Legende[] = [
    {label: 'Farbe', class: 'farbe'},
    {label: 'Hersteller', class: 'hersteller'},
    {label: 'Material'},
    {label: 'Preis'},
    {label: [
      {label: 'Gewicht Filament'},
      {label: 'Gewicht Spule'},
    ], class: 'gewicht'},
    {label: 'Aktionen', class: 'aktionen'},
  ]

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private toastService: ToastService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initForm()

    this.dataService.dataState$.subscribe(state => {
      // FILAMENT
      this.filamentList = state.filament
      this.gefilterteFilamentList = state.filament

      if(state.filament.length) {
        this.preisMin = Math.floor(Math.min(...state.filament.map(f => f.preis)))
        this.preisMax = Math.ceil(Math.max(...state.filament.map(f => f.preis)))

        this.gewichtMin = Math.floor(Math.min(...state.filament.map(f => f.gewicht_filament)))
        this.gewichtMax = Math.ceil(Math.max(...state.filament.map(f => f.gewicht_filament)))

        this.filterForm.patchValue({
          preisMin: this.preisMin,
          preisMax: this.preisMax,
          gewichtMin: this.gewichtMin,
          gewichtMax: this.gewichtMax,
        })
      }

      // HERSTELLER
      this.herstellerList = state.hersteller
      // MATERIAL
      this.materialList = state.material
    })

    this.filterForm.valueChanges.subscribe(_ => this.applyFilter())
    this.applyFilter()
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

    this.filterForm = this.fb.group({
      farbe: [''],

      hersteller_id: [null],
      material_id: [null],

      preisMin : [0],
      preisMax : [0],

      gewichtMin : [0],
      gewichtMax : [0],
    })
  }

  public async submit() {
    if (this.filamentForm.invalid) {
      this.filamentForm.markAllAsTouched()
      return
    }

    const filament = this.filamentForm.value
    const material = this.dataService.material.getNameById(filament.material_id)
    const hersteller = this.dataService.hersteller.getNameById(filament.hersteller_id)
    
    const result = await Swal.fire(this.alertService.filament.createUpdateConfig(filament, material, hersteller, !this.editingFilament))

    if(result.isConfirmed) {
      if(this.editingFilament) {
        this.dataService.filament.update(filament, this.editingFilament.id).subscribe({
          next: (res) => {
            this.toastService.success(`Filament "${filament.farbe}" wurde erfolgreich aktualisiert.`, "Aktualisieren erfolgreich")
            this.closeForm()
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Filament-Aktualisieren fehlgeschlagen');
          }
        })
      } else {
        this.dataService.filament.create(filament).subscribe({
          next: (res) => {
            this.toastService.success(`Filament "${filament.farbe}" wurde erfolgreich hinzugefügt.`, "Hinzufügen erfolgreich")
            this.closeForm()
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Filament-Hinzufügen fehlgeschlagen');
          }
        })
      }
    }
  }

  public resetForm() {
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

  public openCreateForm() {
    this.editingFilament = null
    this.resetForm()
    this.hiddeForm = false
  }

  public openEditForm(filament: Filament) {
    this.editingFilament = filament
    this.resetForm()
    this.hiddeForm = false
    this.filamentForm.patchValue({
      ...filament,
      hersteller_id: filament.hersteller.id,
      material_id: filament.material.id,
    })
  }

  public openDuplicateForm(filament: Filament) {
    this.openCreateForm() 
    this.filamentForm.patchValue({
      ...filament,
      hersteller_id: filament.hersteller.id,
      material_id: filament.material.id,
    })
  }

  public closeForm() {
    this.hiddeForm = true
    this.editingFilament = null
    this.resetForm()
  }

  private applyFilter() {
    const filter = this.filterForm.value

    const gefiltert = this.filamentList.filter(f => {
      if(filter.farbe && !f.farbe.toLowerCase().includes(filter.farbe.toLowerCase())) {
        return false
      }

      if(filter.hersteller_id && f.hersteller.id !== filter.hersteller_id) {
        return false
      }

      if(filter.material_id && f.material.id !== filter.material_id) {
        return false
      }

      if(f.preis < filter.preisMin || f.preis > filter.preisMax) {
        return false
      }

      if(f.gewicht_filament < filter.gewichtMin || f.gewicht_filament > filter.gewichtMax) {
        return false
      }

      return true
    })

    this.gefilterteFilamentList = this.sortFilament(gefiltert)
  }

  public resetFilter() {
    this.filterForm.patchValue({
      farbe: '',
      hersteller_id: null,
      material_id: null,
      preisMin: this.preisMin,
      preisMax: this.preisMax,
      gewichtMin: this.gewichtMin,
      gewichtMax: this.gewichtMax,
    });
  }

  public setSortMode(mode: FilamentSortMode) {
    if(this.sortMode === mode) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortMode = mode
      this.sortDirection = 'asc'
    }

    this.applyFilter()
  }

  private sortFilament(list: Filament[]): Filament[] {
    const factor = this.sortDirection === 'asc'? 1 : -1
    const sorted = [...list]

    switch(this.sortMode) {
      case 'farbe':
        return sorted.sort((a, b) =>  factor * (a.farbe.localeCompare(b.farbe)))
      case 'material':
        return sorted.sort((a, b) => factor * (a.material.name.localeCompare(b.material.name)))
      case 'hersteller':
        return sorted.sort((a, b) => factor * (a.hersteller.name.localeCompare(b.hersteller.name)))
      case 'gewicht':
        return sorted.sort((a, b) => factor * (a.gewicht_filament - b.gewicht_filament))
      default:
        return sorted
    }
  } 
}
