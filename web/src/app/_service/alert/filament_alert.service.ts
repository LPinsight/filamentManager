import { Injectable } from '@angular/core';
import { Base_alertService } from './base_alert.service';
import { SweetAlertOptions } from 'sweetalert2';
import { Filament } from '../../_interface/filament';

@Injectable({
  providedIn: 'root'
})
export class Filament_alertService {

  constructor(private base: Base_alertService) { }

  public createUpdateConfig(data: Filament, material: string, hersteller: string, neu: boolean): SweetAlertOptions {
    let title = neu ? 'Filament hinzufügen' : 'Filament aktualisieren'

    return {
      title: title,
      html: this.base.buildDataPreview(material, hersteller, data),
      icon: 'info',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: title,
      denyButtonText: 'Abbruch'
    }
  }

  public removeConfig(name: string, hersteller: string, material: string): SweetAlertOptions {
    return {
      title: `Filament "${name} ${hersteller}-${material}" entfernen`,
      text: `Möchten Sie das Filament wirklich entfernen?`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Filament nicht entfernen',
      denyButtonText: 'Filament entfernen'
    }
  }
}
