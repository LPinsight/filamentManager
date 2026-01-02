import { Injectable } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';

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

}
