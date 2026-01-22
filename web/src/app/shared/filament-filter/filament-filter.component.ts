import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class FilamentFilterComponent implements OnInit {
  @Input() form!: FormGroup
  @Input() config!: FilamentFilterConfig

  @Input() preisMin = 0
  @Input() preisMax = 0

  @Input() gewichtMin = 0
  @Input() gewichtMax = 0

  @Output() reset = new EventEmitter<void>()

  filterOpen = false

  herstellerList: Hersteller[] = []
  materialList: Material[] = []
  ortList: Ort[] = []

  constructor(
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.dataState$.subscribe(state => {
      this.herstellerList = state.hersteller
      this.materialList = state.material
      this.ortList = state.ort
    })
  }

  resetForm () {
    this.filterOpen = false
    this.reset.emit()
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen
  }
}