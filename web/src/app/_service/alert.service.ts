import { Injectable } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';
import { Material } from '../_interface/material';
import { Filament } from '../_interface/filament';
import { Hersteller } from '../_interface/hersteller';
import { Ort } from '../_interface/ort';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

constructor() { }

  public MixinConfig(steps: string[]): SweetAlertOptions {
    return {
      progressSteps: steps,
      confirmButtonText: 'Next &rarr;',
      cancelButtonText: '&larr; Back',
      inputAttributes: {
          required: 'true'
        },
      reverseButtons: true,
      validationMessage: 'This field is required'
    }
  }

  public createHerstellerConfig(): SweetAlertOptions {
    return {
      title: 'Hersteller hinzufügen',
      text: 'Geben Sie den Namen des Herstellers ein, den Sie hinzufügen möchten.',
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      input: 'text',
      inputPlaceholder: 'Herstellername',
      confirmButtonText: 'Hersteller hinzufügen',
      denyButtonText: 'Abbrechen'
    }
  }

  public updateHerstellerConfig(name: string): SweetAlertOptions {
    return {
      title: `Hersteller "${name}" anpassen`,
      text: `Geben Sie einen neuen Namen für den Hersteller "${name}" ein.`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      input: 'text',
      inputPlaceholder: 'Herstellername',
      inputValue: name,
      confirmButtonText: 'Hersteller aktualisieren',
      denyButtonText: 'Abbrechen'
    }
  }

  public removeHerstellerConfig(name: string): SweetAlertOptions {
    return {
      title: `Hersteller "${name}" entfernen`,
      text: `Möchten Sie den Hersteller wirklich entfernen?`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Hersteller nicht entfernen',
      denyButtonText: 'Hersteller entfernen'
    }
  }

  public createMaterialConfig(id: number, values: string[], neu: boolean): SweetAlertOptions {
    let title = neu ? 'Material hinzufügen' : 'Material bearbeiten'
    let confirmButton = neu ? 'Material hinzufügen' : 'Material aktualisieren'

    switch (id) {
      case 0: 
        return {
          title: title,
          currentProgressStep: 0,
          showCloseButton: true,
          focusConfirm: false,
          text: 'Name des Materials',
          input: 'text',
          inputPlaceholder: 'Materialname',
          inputValue: values[0]
        }
      case 1:
        return {
          title: title,
          currentProgressStep: 1,
          showCloseButton: true,
          focusConfirm: false,
          showCancelButton: true,
          text: 'Dichte des Materials',
          input: 'number',
          inputPlaceholder: 'Dichte',
          inputValue: values[1],
          inputAttributes: {
            step: '0.01',
            min: '0'
          }
        }
      case 2:
        return {
          title: title,
          currentProgressStep: 2,
          showCloseButton: true,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: confirmButton,
          text: 'Durchmesser des Materials',
          input: 'number',
          inputPlaceholder: 'Durchmesser',
          inputValue: values[2],
          inputAttributes: {
            step: '0.01',
            min: '0'
          }
        }
      default:
        return {
          title: title,
          text: 'id not found',
          icon: 'error'
        }
    }
  }

  public removeMaterialConfig(name: string): SweetAlertOptions {
    return {
      title: `Material "${name}" entfernen`,
      text: `Möchten Sie das Material wirklich entfernen?`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Material nicht entfernen',
      denyButtonText: 'Material entfernen'
    }
  }

  public removeFilamentConfig(name: string, hersteller: string, material: string): SweetAlertOptions {
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

  public createFilamentConfig(data: Filament, material: string, hersteller: string, neu: boolean): SweetAlertOptions {
    let title = neu ? 'Filament hinzufügen' : 'Filament aktualisieren'

    return {
      title: title,
      html: this.buildFilamentPreview(data, material, hersteller),
      icon: 'info',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: title,
      denyButtonText: 'Abbrechen'
    }
  }

  public addSpulenConfig(name: string, hersteller: string, material: string): SweetAlertOptions {
    return {
      title: `Spule von "${name} ${hersteller}-${material}" hinzufügen`,
      text: `Möchten Sie von dem Filament wirklich eine Spule hinzufügen?`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Spule hinzufügen',
      denyButtonText: 'Abbrechen'
    }
  }

  public changeArchivConfig(name: string, hersteller: string, material: string, archiv: boolean): SweetAlertOptions {
    const titel = archiv ? "aktivieren" : "archivieren"
    return {
      title: `Spule "${name} ${hersteller}-${material}" ${titel}`,
      text: `Möchten Sie die Spule wirklich ${titel}?`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: `Spule ${titel}`,
      denyButtonText: 'Abbrechen'
    }
  }

  public removeSpulenOrtConfig(): SweetAlertOptions {
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

  public setSpulenOrtConfig(orte: Ort[]): SweetAlertOptions {
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
      denyButtonText: 'Abbruch'
    }
  }

  private buildFilamentPreview(filament: Filament, material: string, hersteller: string): string {
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
        <p><b>Filamentgewicht:</b> ${filament.gewicht_filament} g</p>
        <p><b>Leerenspule:</b> ${filament.gewicht_spule} g</p>
        <p><b>Preis:</b> ${filament.preis} €</p>
        <p><b>URL:</b> ${filament.link || '-'}</p>
        <p><b>Extruder:</b> ${filament.temp_extruder} °C</p>
        <p><b>Druckbett:</b> ${filament.temp_bed} °C</p>
      </div>
    `;
  }

}
