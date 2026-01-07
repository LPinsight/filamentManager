import { Injectable } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Ort_alertService {

  constructor() { }

  public createConfig(name?: string): SweetAlertOptions {
    return {
      title: 'Ort hinzufügen',
      text: 'Geben Sie den Namen des Ortes ein, den Sie hinzufügen möchten.',
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      input: 'text',
      inputPlaceholder: 'Ort',
      inputValue: name || "",
      confirmButtonText: 'Ort hinzufügen',
      denyButtonText: 'Abbruch'
    }
  }

  public updateConfig(name: string): SweetAlertOptions {
    return {
      title: `Ort "${name}" anpassen`,
      text: `Geben Sie einen neuen Namen für den Ort "${name}" ein.`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      input: 'text',
      inputPlaceholder: 'Ort',
      inputValue: name,
      confirmButtonText: 'Ort aktualisieren',
      denyButtonText: 'Abbruch'
    }
  }

  public removeConfig(name: string): SweetAlertOptions {
    return {
      title: `Ort "${name}" entfernen`,
      text: `Möchten Sie den Ort wirklich entfernen? Sollte der Ort noch Spulen zugewiesen haben, wird den Spulen der Ort zurückgesetzt.`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Ort nicht entfernen',
      denyButtonText: 'Ort entfernen'
    }
  }

}
