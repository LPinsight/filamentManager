import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Hersteller } from '../../_interface/hersteller';
import { Material } from '../../_interface/material';
import { DataService } from '../../_service/data.service';
import { FilamentFilterConfig } from '../../_config/filament.config';
import { Ort } from '../../_interface/ort';

@Component({
  selector: 'app-filament-filter',
  templateUrl: './filament-filter.component.html',
  styleUrls: ['./filament-filter.component.scss']
})
export class FilamentFilterComponent {
  @Input() form!: FormGroup
  @Input() config!: FilamentFilterConfig

  @Input() preisMin = 0
  @Input() preisMax = 0

  @Input() gewichtMin = 0
  @Input() gewichtMax = 0

  @Output() reset = new EventEmitter<void>()


  herstellerList: Hersteller[] = []
  materialList: Material[] = []
  ortList: Ort[] = []

  constructor(
    private dataService: DataService
  ) {
    this.dataService.hersteller.hersteller$.subscribe(h => this.herstellerList = h)
    this.dataService.material.material$.subscribe(m => this.materialList = m)
    this.dataService.ort.ort$.subscribe(m => this.ortList = m)
  }
}