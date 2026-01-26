import { Component, OnInit } from '@angular/core';
import { DataService } from '../_service/data.service';
import { Spule } from '../_interface/spule';
import { FilamentmitSpulen } from '../_interface/filament';
import { HerstellerMitFilament } from '../_interface/hersteller';
import { DataState } from '../_interface/main';
import { WebsocketService } from '../_service/websocket.service';

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
    gefiltertFilamentNachHersteller: HerstellerMitFilament[] = []

    farbenSearch = ''

  constructor(
    private dataService: DataService,
    private webSocket: WebsocketService
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
          offen: false
        }
      }

      acc[herstellerId].filament.push(filament)
      return acc
    }, {} as Record<string, HerstellerMitFilament>)

    this.filamentNachHersteller = Object.values(grouped)    
    this.gefiltertFilamentNachHersteller = Object.values(grouped)    
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

  public toggleHersteller (hersteller: HerstellerMitFilament) {
    hersteller.offen = !hersteller.offen
  }

  public filterFilament () {
    const search = this.farbenSearch.toLowerCase().trim()

    if(!search) {
      this.gefiltertFilamentNachHersteller = this.filamentNachHersteller
      return
    }

    this.gefiltertFilamentNachHersteller = this.filamentNachHersteller.map(hersteller => {
      const gefilterteFilamente = hersteller.filament.filter(f => f.filament.farbe.toLowerCase().includes(search))

      return {
        ...hersteller,
        filament: gefilterteFilamente,
        offen: hersteller.offen
      }
    })
    .filter(h => h.filament.length > 0)
    
  }

}
