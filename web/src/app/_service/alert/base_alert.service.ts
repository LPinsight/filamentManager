import { Injectable } from '@angular/core';
import { Filament } from '../../_interface/filament';
import { Spule } from '../../_interface/spule';

@Injectable({
  providedIn: 'root'
})
export class Base_alertService {

  constructor() { }

  public buildDataPreview(material: string, hersteller: string, data: Filament | Spule): string {

    if(this.isSpule(data)) {
      return this.buildSpulePrieview(material, hersteller, data)
    }

    return this.buildFilamentPrieview(material, hersteller, data)
  }

  private isSpule(data: Filament | Spule): data is Spule {
    return 'filament' in data
  }

  private formatGramm(value: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'unit',
      unit: 'gram'
    }).format(value)
  }

  private formatEuro(value: number): string {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  private buildFilamentPrieview(material: string, hersteller: string, filament: Filament) {
    return `
      <div style="text-align:left">
        <p><b>Farbe:</b> ${filament.farbe}</p>
        <p>
          <b>Farbcode:</b>
          <span style="
            display:inline-block;
            width:16px;
            height:16px;
            background:${filament.farbcode};
            border:1px solid #000;
            vertical-align:middle;
          "></span>
          ${filament.farbcode}
        </p>
        <p><b>Hersteller:</b> ${hersteller}</p>
        <p><b>Material:</b> ${material}</p>
        <p><b>Filamentgewicht:</b> ${this.formatGramm(filament.gewicht_filament)}</p>
        <p><b>Leerenspule:</b> ${this.formatGramm(filament.gewicht_spule)}</p>
        <p><b>Preis:</b> ${this.formatEuro(filament.preis)} €</p>
        <p><b>URL:</b> ${filament.link || '-'}</p>
        <p><b>Extruder:</b> ${filament.temp_extruder} °C</p>
        <p><b>Druckbett:</b> ${filament.temp_bed} °C</p>
      </div>
    `;
  }

  private buildSpulePrieview(material: string, hersteller: string, spule: Spule) {
    return `
      <div style="text-align:left">
        <p><b>Farbe:</b> ${spule.filament.farbe}</p>
        <p>
          <b>Farbcode:</b>
          <span style="
            display:inline-block;
            width:16px;
            height:16px;
            background:${spule.filament.farbcode};
            border:1px solid #000;
            vertical-align:middle;
          "></span>
          ${spule.filament.farbcode}
        </p>
        <p><b>Hersteller:</b> ${hersteller}</p>
        <p><b>Material:</b> ${material}</p>
        <p><b>Verbeibendes Gewicht:</b> ${this.formatGramm(spule.verbleibendes_Gewicht)}</p>
        <p><b>Verbrauchtes Gewicht:</b> ${this.formatGramm(spule.verbrauchtes_Gewicht)}</p>
        <p><b>NFC-Tag:</b> ${spule.nfc ? "NFC-Tag zugeordnet": "kein NFC-Tag zugeordnet"}</p>
        <p><b>Spulen Nr.:</b> ${spule.nummer || "keine Nummer zugeordnet"}</p>
        <p><b>Preis:</b> ${this.formatEuro(spule.filament.preis)} €</p>
        <p><b>Extruder:</b> ${spule.filament.temp_extruder} °C</p>
        <p><b>Druckbett:</b> ${spule.filament.temp_bed} °C</p>
      </div>
    `;
  }
}
