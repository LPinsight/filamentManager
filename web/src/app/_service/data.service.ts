import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Material } from '../_interface/material';
import { Hersteller } from '../_interface/hersteller';
import { Ort } from '../_interface/ort';
import { Filament } from '../_interface/filament';
import { Spule } from '../_interface/spule';
import { BehaviorSubject, tap } from 'rxjs';
import { MaterialService } from './material.service';
import { HerstellerService } from './hersteller.service';
import { OrtService } from './ort.service';
import { FilamentService } from './filament.service';
import { SpuleService } from './spule.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    public material: MaterialService,
    public hersteller: HerstellerService,
    public ort: OrtService,
    public filament: FilamentService,
    public spule: SpuleService
  ) {
    this.loadAll()
    
    hersteller.changed$.subscribe(_ => {
      this.loadFilamentSpule()
    })

    material.changed$.subscribe(_ => {
      this.loadFilamentSpule()
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
