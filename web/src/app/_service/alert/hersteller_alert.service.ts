import { Injectable } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Hersteller_alertService {

constructor() { }

  public createConfig(name?: string): SweetAlertOptions {
    return {
      title: 'Hersteller hinzufügen',
      text: 'Geben Sie den Namen des Herstellers ein, den Sie hinzufügen möchten.',
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      input: 'text',
      inputPlaceholder: 'Herstellername',
      inputValue: name,
      confirmButtonText: 'Hersteller hinzufügen',
      denyButtonText: 'Abbruch'
    }
  }

  public updateConfig(name: string): SweetAlertOptions {
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
      denyButtonText: 'Abbruch'
    }
  }

  public removeConfig(name: string): SweetAlertOptions {
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
}
