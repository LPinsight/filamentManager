import { Component, OnInit } from '@angular/core';
import { DataService } from '../_service/data.service';
import { Ort, OrtmitSpulen } from '../_interface/ort';
import { AlertService } from '../_service/alert.service';
import { ToastService } from '../_service/toast.service';
import Swal from 'sweetalert2';
import { Spule, spuleDrop, spuleDropRequest } from '../_interface/spule';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-page-ort',
  templateUrl: './page-ort.component.html',
  styleUrls: ['./page-ort.component.scss']
})
export class PageOrtComponent implements OnInit {
  orteListe: Ort[] = []
  ortMitSpulen: OrtmitSpulen[] = []

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.dataService.dataState$.subscribe(state => {
      this.orteListe = state.ort

      const spulenOhneOrt = state.spule.filter(s => !s.ort.id)
      const keinOrtBlock = spulenOhneOrt.length > 0 ? [{
        ort: {id: "__kein_ort__", name: "kein Ort"},
        spulen: spulenOhneOrt
      }] : []

      this.ortMitSpulen = [
        ...keinOrtBlock,
        ...state.ort.map(ort => ({
        ort,
        spulen: state.spule.filter(s => s.ort?.id === ort.id)
      }))
      ]
    })
  }

  public async createOrt() {
    const result = await Swal.fire(this.alertService.ort.createConfig())

    if (result.isConfirmed) {
      this.dataService.ort.create(result.value).subscribe({
        next: (res) => {
          this.toastService.success(`Ort "${result.value}" wurde erfolgreich hinzugefügt.`, "Hinzufügen erfolgreich")
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Ort-Hinzufügen fehlgeschlagen');
        }
      })
    }


  }

  public onSpuleDropped(event: spuleDropRequest[]) {
    // this.dataService.spule.updateOrt(event.spule.id, event.ortId).subscribe()
    this.dataService.spule.updateSortOrt(event).subscribe({
      error: err => {
        this.toastService.error(err.error, "Sortierung fehlgeschlagen")
        this.dataService.spule.loadAll().subscribe()
      }
    })
  }

  public async sortOrte() {
    const sortierbareOrte = this.orteListe
      .filter(o => o.id !== '__kein_ort__')
      .map(o => ({...o}))
    
    const result = await Swal.fire({
      ...this.alertService.ort.sortConfig(),
      didOpen: () => {
        this.renderOrtSortListe(sortierbareOrte)
      },
      preConfirm: () => {
        return sortierbareOrte.map((ort, index) => ({
          id: ort.id,
          sortIndex: index
        }))
      }
    })

    if(result.isConfirmed) {
      this.dataService.ort.updateSort(result.value).subscribe({
        next: res => {
          this.toastService.success("Orte wurden erfolgreich sortiert", "Sortieren erfolgreich")
        },
        error: err => {
          this.toastService.error(err.error, 'Sortierern fehlgeschlagen')
        }
      })
    }
  }

  private renderOrtSortListe(orte: Ort[]) {
    const container = document.getElementById('ort-sort-container')
    if (!container) return

    container.innerHTML = `
    <div class="ort-sort-list">
      <div class="ort-sort-item disabled" data-id="__kein_ort__">
        <span class="drag-handle disabled">☰</span>
        <span>Kein Ort</span>
      </div>
      ${orte.map(o => `
        <div class="ort-sort-item" data-id="${o.id}">
          <span class="drag-handle">☰</span>
          <span>${o.name}</span>
        </div>
      `).join('')}
    </div>`

    this.enableDragAndDrop(container, orte)
  }

  private enableDragAndDrop(container: HTMLElement, orte: Ort[]) {
    const items = Array.from(container.querySelectorAll('.ort-sort-item')) as HTMLElement[]

    let draggedIndex: number | null = null

    items.forEach((item, index) => {
      const id = item.dataset['id']

      if(id === '__kein_ort__') {
        item.draggable = false
        return
      }

      item.draggable = true

      item.addEventListener('dragstart', () => {
        draggedIndex = items.indexOf(item) -1
        item.classList.add('dragging')
      })

      item.addEventListener('dragend', () => {
        draggedIndex = null
        item.classList.remove('dragging')
      })

      item.addEventListener('dragover', e => {
        e.preventDefault()
      })

      item.addEventListener('drop', () => {
        if (draggedIndex === null) return

        const targetIndex = items.indexOf(item) -1
        if (targetIndex === draggedIndex) return

        const moved = orte.splice(draggedIndex, 1)[0]
        orte.splice(targetIndex, 0, moved)

        this.renderOrtSortListe(orte)
      })





    })
  }

}
