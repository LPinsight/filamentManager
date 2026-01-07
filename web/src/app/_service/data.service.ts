import { Injectable } from '@angular/core';
import { Material_dataService } from './data/material_data.service';
import { Hersteller_dataService } from './data/hersteller_data.service';
import { Ort_dataService } from './data/ort_data.service';
import { Filament_dataService } from './data/filament_data.service';
import { Spule_dataService } from './data/spule_data.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    public material: Material_dataService,
    public hersteller: Hersteller_dataService,
    public ort: Ort_dataService,
    public filament: Filament_dataService,
    public spule: Spule_dataService
  ) {
    this.loadAll()
    
    hersteller.changed$.subscribe(_ => {
      this.loadFilamentSpule()
    })

    material.changed$.subscribe(_ => {
      this.loadFilamentSpule()
    })

    ort.changed$.subscribe(_ => {
      spule.loadAll().subscribe()
    })

    filament.changed$.subscribe(_ => {
      spule.loadAll().subscribe()
    })
  }

  private loadAll () {
    this.material.loadAll().subscribe()
    this.hersteller.loadAll().subscribe()
    this.ort.loadAll().subscribe()
    this.filament.loadAll().subscribe()
    this.spule.loadAll().subscribe()
  }

  private loadFilamentSpule () {
    this.filament.loadAll().subscribe()
    this.spule.loadAll().subscribe()
  }

}
