import { Component, OnInit } from '@angular/core';
import { DataService } from '../_service/data.service';
import { Spule } from '../_interface/spule';
import { Filament, FilamentmitSpulen } from '../_interface/filament';
import { Material } from '../_interface/material';
import { Hersteller, HerstellerMitFilament } from '../_interface/hersteller';
import { DataState } from '../_interface/main';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
  standalone: false
})
export class PageHomeComponent implements OnInit {
    listen!: DataState
    spulenNachFilament: FilamentmitSpulen[] = []
    filamentNachHersteller: HerstellerMitFilament[] = []

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.dataState$.subscribe(state => {
      this.listen = state

      this.groupSpulenByFilament(state.spule)
      this.groupFilamentByHersteller(this.spulenNachFilament)
    })
  }

  private groupFilamentByHersteller(filamentmitSpulen: FilamentmitSpulen[]) {
    const grouped = filamentmitSpulen.reduce((acc, filament) => {
      const herstellerId = filament.filament.hersteller.id

      if(!acc[herstellerId]) {
        acc[herstellerId] = {
          hersteller: filament.filament.hersteller,
          filament: [],
        }
      }

      acc[herstellerId].filament.push(filament)
      return acc
    }, {} as Record<string, HerstellerMitFilament>)

    this.filamentNachHersteller = Object.values(grouped)
    console.log(grouped);
    
    
  }

  private groupSpulenByFilament(spulen: Spule[]) {
    const aktiveSpulen = spulen.filter(s => !s.archiviert)

    const grouped = aktiveSpulen.reduce((acc, spule) => {
      const filamentId = spule.filament.id

      if(!acc[filamentId]) {
        acc[filamentId] = {
          filament: spule.filament,
          spulen: [],
          gesamtGewicht: 0,
          gesamtVerbrauch: 0,
          gesamtVerbleibend: 0
        }
      }

      acc[filamentId].spulen.push(spule)
      acc[filamentId].gesamtGewicht += spule.filament.gewicht_filament
      acc[filamentId].gesamtVerbrauch += spule.verbrauchtes_Gewicht ?? 0
      acc[filamentId].gesamtVerbleibend += spule.verbleibendes_Gewicht

      return acc
    }, {} as Record<string, FilamentmitSpulen>)

    this.spulenNachFilament = Object.values(grouped)
  }

}
