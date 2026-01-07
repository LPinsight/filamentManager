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
      inputValue: name,
      confirmButtonText: 'Ort hinzufügen',
      denyButtonText: 'Abbruch'
    }
  }

}
