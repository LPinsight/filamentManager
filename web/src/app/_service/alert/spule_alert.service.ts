import { Injectable } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';
import { Spule } from '../../_interface/spule';
import { Base_alertService } from './base_alert.service';
import { Ort } from '../../_interface/ort';

@Injectable({
  providedIn: 'root'
})
export class Spule_alertService {

  constructor(
    private base: Base_alertService
  ) { }

  public createConfig(name: string, hersteller: string, material: string): SweetAlertOptions {
    return {
      title: `Spule von "${name} ${hersteller}-${material}" hinzufügen`,
      text: `Möchten Sie von dem Filament wirklich eine Spule hinzufügen?`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Spule hinzufügen',
      denyButtonText: 'Abbruch'
    }
  }

  public showConfig(data: Spule, material: string, hersteller: string): SweetAlertOptions {

    return {
      title: 'Spule anzeigen',
      html: this.base.buildDataPreview(material, hersteller,data),
      icon: 'info',
      showCloseButton: true,
    }
  }

  public changeArchivConfig(name: string, hersteller: string, material: string, archiv: boolean): SweetAlertOptions {
    const titel = archiv ? "aktivieren" : "archivieren"
    return {
      title: `Spule "${name} ${hersteller}-${material}" ${titel}`,
      text: `Möchten Sie die Spule wirklich ${titel}? Damit wird der Ort, NFC-Tag sowie Nummer entfernt!`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: `Spule ${titel}`,
      denyButtonText: 'Abbruch'
    }
  }

  public setOrtConfig(orte: Ort[], value: string | null): SweetAlertOptions {
    const options: Record<string, string> = {}
    orte.forEach(ort => {
      options[ort.id] = ort.name
    })

    return {
      title: `Ort auswählen`,
      text: `Wählen Sie den Ort für die Spule aus?`,
      icon: 'question',
      input: 'select',
      inputOptions: options,
      inputPlaceholder: 'Ort auswählen',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Ort wählen',
      denyButtonText: 'Abbruch',
      inputValue: value
    }
  }

  public removeOrtConfig(): SweetAlertOptions {
    return {
      title: `Ort entfernen`,
      text: `Möchten Sie den Ort wirklich entfernen?`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Ort nicht entfernen',
      denyButtonText: 'Ort entfernen'
    }
  }

  public editNfcConfig(): SweetAlertOptions {
    return {
      title: `Aktion auswählen`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Nummer bearbeiten',
      denyButtonText: 'NFC-Tag zuweisen',
      denyButtonColor: "#7066e0",
      cancelButtonText: 'Abbruch',
      cancelButtonColor: "#dc3741",
    }
  }

  public removeNfcConfig(): SweetAlertOptions {
    return {
      title: `NFC-Tag entfernen`,
      text: `Möchten Sie den NFC-Tag wirklich entfernen?`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'NFC-Tag nicht entfernen',
      denyButtonText: 'NFC-Tag entfernen'
    }
  }

  public editNummerConfig(nummer?: number): SweetAlertOptions { 
    return {
      title: 'Nummer speichern',
      text: 'Geben Sie die Nummer der Spule ein.',
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      showCancelButton: true,
      input: 'number',
      inputPlaceholder: 'Spulen Nr.',
      inputValue: nummer && nummer > 0 ? nummer : 1,
      inputAttributes: {
        step: '1',
        min: '1',
        max: '4'
      },
      confirmButtonText: 'Nummer speichern',
      denyButtonText: 'Nummer löschen',
      denyButtonColor: "#7066e0",
      cancelButtonText: 'Abbruch',
      cancelButtonColor: "#dc3741",
    }
  }

}
