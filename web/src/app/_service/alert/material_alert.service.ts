import { Injectable } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Material_alertService {

  constructor() { }

  public createUpdateConfig(id: number, values: string[], neu: boolean): SweetAlertOptions {
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

  public removeConfig(name: string): SweetAlertOptions {
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

}
