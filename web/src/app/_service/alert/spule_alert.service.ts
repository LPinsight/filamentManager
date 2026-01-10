import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';
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

  public removeConfig(name: string, nummer: number,  hersteller: string, material: string): SweetAlertOptions {
    return {
      title: `Spule [${nummer}] von "${name} ${hersteller}-${material}" entfernen`,
      text: `Möchten Sie die Spule wirklich entfernen?`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Spule nicht entfernen',
      denyButtonText: 'Spule entfernen'
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

  public chanceGewichtConfig(spule: Spule): SweetAlertOptions {
    return {
      title: `Gewicht anpassen`,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'gewicht anpassen',
      denyButtonText: 'Abbruch',
      html: `
        <div class="input-Gewicht">
          <div class="bestand">
            <label> <span><b>Grundgewicht</b><br>Filament<br>Leerspule </span>
              <input type="number" class="swal2-input disabled" value="${spule.filament.gewicht_filament}" disabled>
              <input type="number" class="swal2-input disabled" value="${spule.filament.gewicht_spule}" disabled>
            </label>
            <label> <span><b>verbleibend</b><br>aktuell<br>Neu</span>
              <input id="bestandVerbleibend" type="number" class="swal2-input disabled" value="${spule.verbleibendes_Gewicht}" disabled>
              <input id="bestandVerbleibendNeu" type="number" class="swal2-input disabled" value="${spule.verbleibendes_Gewicht}" disabled>
            </label>
            <label> <span><b>verbraucht</b><br>aktuell<br>Neu</span>
              <input id="bestandVerbraucht" type="number" class="swal2-input disabled" value="${spule.verbrauchtes_Gewicht}" disabled>
              <input id="bestandVerbrauchtNeu" type="number" class="swal2-input disabled" value="${spule.verbrauchtes_Gewicht}" disabled>
            </label>
          </div>

          <label> <span>Gewicht (g):</span>
            <input id="gewicht" type="number" class="swal2-input" min="0" placeholder="Gewicht eingeben">
          </label>

          <div class="radio-buttons">
            <label>
              <input type="radio" name="mode" value="used" checked>
              <span>Verbrauchtes Gewicht</span>
            </label>

            <label>
              <input type="radio" name="mode" value="rest_mitSpule">
              <span>Restgewicht inkl. Spule</span>
            </label>

            <label>
              <input type="radio" name="mode" value="rest_ohneSpule">
              <span>Restgewicht ohne Spule</span>
            </label>
          </div>
        </div>
      `,
      didOpen: () => {
        const gewichtInput = document.getElementById('gewicht') as HTMLInputElement
        const radioButtons = document.querySelectorAll('input[name="mode"]')

        updateFields('switchMode')

        gewichtInput.addEventListener('input', () => {
          updateFields()
        })

        radioButtons.forEach((radio) => {
          radio.addEventListener('change', () => {
            updateFields('switchMode')
          })
        })

        function setGewichtData(value: number, min: number, max: number) {
          let gewichtHTML = document.getElementById('gewicht') as HTMLInputElement

          gewichtHTML.value = String(value)
          gewichtHTML.min = String(min)
          gewichtHTML.max = String(max)
        }

        function setShowValues(verbleibend: number, verbraucht: number) {
          let verbleibendHTML = document.getElementById('bestandVerbleibendNeu') as HTMLInputElement
          let verbrauchtHTML = document.getElementById('bestandVerbrauchtNeu') as HTMLInputElement

          verbleibendHTML.value = String(verbleibend)
          verbrauchtHTML.value = String(verbraucht)

        }

        function updateFields(change?: string) {
          const gewicht = Number((document.getElementById('gewicht') as HTMLInputElement).value)
          const mode = (document.querySelector('input[name="mode"]:checked') as HTMLInputElement)?.value
          
          let neuesVerbrauchtesGewicht = spule.verbrauchtes_Gewicht
          let neuesRestGewicht = spule.verbleibendes_Gewicht

          if(change === 'switchMode'){
            setShowValues(neuesRestGewicht, neuesVerbrauchtesGewicht)

            switch(mode){
              case 'used':
                setGewichtData(0, 1, spule.filament.gewicht_filament)
                return
              case 'rest_mitSpule':
                setGewichtData(
                  neuesRestGewicht+spule.filament.gewicht_spule,
                  spule.filament.gewicht_spule,
                  spule.filament.gewicht_filament + spule.filament.gewicht_spule)
                return
              case 'rest_ohneSpule':
                setGewichtData(neuesRestGewicht, 0, spule.filament.gewicht_filament)
                return
            }
          }

          switch(mode) {
            case 'used':
              if (!gewicht || gewicht <0 || gewicht > spule.verbleibendes_Gewicht) {
                Swal.showValidationMessage('Bitte ein gültiges Gewicht eingeben')
                return
              }
              Swal.resetValidationMessage()
              neuesRestGewicht -= gewicht
              neuesVerbrauchtesGewicht += gewicht
              break
    
            case 'rest_mitSpule':
              if(!gewicht || gewicht < spule.filament.gewicht_spule || gewicht > (spule.filament.gewicht_filament + spule.filament.gewicht_spule)) {
                Swal.showValidationMessage('Bitte ein gültiges Gewicht eingeben')
                return
              }
              Swal.resetValidationMessage()
              const spulenGewicht = spule.filament.gewicht_spule
              neuesRestGewicht = gewicht - spulenGewicht
              neuesVerbrauchtesGewicht = spule.filament.gewicht_filament - neuesRestGewicht
              break
    
            case 'rest_ohneSpule':
              if(gewicht < 0 || gewicht > spule.filament.gewicht_filament) {
                Swal.showValidationMessage('Bitte ein gültiges Gewicht eingeben')
                return
              }
              Swal.resetValidationMessage()
              neuesRestGewicht = gewicht
              neuesVerbrauchtesGewicht = spule.filament.gewicht_filament - gewicht
              break
          }

          setShowValues(neuesRestGewicht, neuesVerbrauchtesGewicht)
        }
      },
      preConfirm: () => {
        const gewicht = Number((document.getElementById('bestandVerbrauchtNeu') as HTMLInputElement).value) 

        return { gewicht }
      }
    }
  }

}
