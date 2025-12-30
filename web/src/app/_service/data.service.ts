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
    material.loadAll().subscribe()
    hersteller.loadAll().subscribe()
    ort.loadAll().subscribe()
    filament.loadAll().subscribe()
    spule.loadAll().subscribe()
  }

}
