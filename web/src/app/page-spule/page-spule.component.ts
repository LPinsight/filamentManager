import { Component, OnInit } from '@angular/core';
import { Spule } from '../_interface/spule';
import { DataService } from '../_service/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SPULE_FILTER_CONFIG } from '../_config/filament.config';
import { Legende } from '../_interface/legende';

@Component({
  selector: 'app-page-spule',
  templateUrl: './page-spule.component.html',
  styleUrls: ['./page-spule.component.scss']
})
export class PageSpuleComponent implements OnInit {
  spuleList: Spule[] = []
  gefilterteSpuleList: Spule[] = []

  aktiveSpulen: Spule[] = []
  archvierteSpulen: Spule[] = []

  preisMin = 0;
  preisMax = 0;
  gewichtMin = 0;
  gewichtMax = 0;

  filterForm!: FormGroup
  SPULE_FILTER_CONFIG = SPULE_FILTER_CONFIG

  legende: Legende[] = [
    {label: 'Farbe', class: 'farbe'},
    {label: 'Hersteller - Material', class: 'herstellerMaterial'},
    {label: 'Verbrauchtes Gewicht'},
    {label: 'Verbleibendes Gewicht'},
    {label: 'NFC-Tag'},
    {label: 'Ort'},
    {label: 'Aktionen', class: 'aktionenSpule'},
  ]

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initForm()

    this.dataService.spule.spule$.subscribe(list => {
      this.spuleList = list
      this.gefilterteSpuleList = list

      this.aktiveSpulen = list.filter(spule => !spule.archiviert)
      this.archvierteSpulen = list.filter(spule => spule.archiviert)

      if(list.length) {
        this.preisMin = Math.floor(Math.min(...list.map(s => s.filament.preis)))
        this.preisMax = Math.ceil(Math.max(...list.map(s => s.filament.preis)))

        this.gewichtMin = Math.floor(Math.min(...list.map(s => s.verbleibendes_Gewicht)))
        this.gewichtMax = Math.ceil(Math.max(...list.map(s => s.verbleibendes_Gewicht)))

        this.filterForm.patchValue({
          preisMin: this.preisMin,
          preisMax: this.preisMax,
          gewichtMin: this.gewichtMin,
          gewichtMax: this.gewichtMax,
        });
      }
    })

    this.filterForm.valueChanges.subscribe(_ => this.applyFilter())
  }

  initForm() {
    this.filterForm = this.fb.group({
      farbe: [''],
      archiviert: [null],

      hersteller_id: [null],
      material_id: [null],
      ort_id: [null],

      preisMin : [0],
      preisMax : [0],

      gewichtMin : [0],
      gewichtMax : [0],
    })
  }

  private applyFilter() {
    const filter = this.filterForm.value

    this.gefilterteSpuleList = this.spuleList.filter(s => {
      if(filter.farbe && !s.filament.farbe.toLowerCase().includes(filter.farbe.toLowerCase())) {
        return false
      }

      if(filter.hersteller_id && s.filament.hersteller.id !== filter.hersteller_id) {
        return false
      }

      if(filter.material_id && s.filament.material.id !== filter.material_id) {
        return false
      }
      
      if(filter.ort_id === '__kein_ort__') {        
        if(s.ort && s.ort.id) {          
          return false
        }
      } else if(filter.ort_id !== null){
        if(!s.ort || s.ort.id !== filter.ort_id) {
          return false
        }
      }

      if(s.filament.preis < filter.preisMin || s.filament.preis > filter.preisMax) {
        return false
      }

      if(s.verbleibendes_Gewicht < filter.gewichtMin || s.verbleibendes_Gewicht > filter.gewichtMax) {
        return false
      }

      if (filter.archiviert !== null && s.archiviert !== filter.archiviert) {
        return false;
      }

      return true
    })
  }

  public resetFilter() {
    this.filterForm.patchValue({
      farbe: '',
      archiviert: null,
      hersteller_id: null,
      material_id: null,
      ort_id: null,
      preisMin: this.preisMin,
      preisMax: this.preisMax,
      gewichtMin: this.gewichtMin,
      gewichtMax: this.gewichtMax,
    });
  }

}
