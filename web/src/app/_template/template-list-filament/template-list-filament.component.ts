import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Filament } from '../../_interface/filament';
import { AlertService } from '../../_service/alert.service';
import { DataService } from '../../_service/data.service';
import { ToastService } from '../../_service/toast.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-template-list-filament',
  templateUrl: './template-list-filament.component.html',
  styleUrls: ['./template-list-filament.component.scss']
})
export class TemplateListFilamentComponent implements OnInit {
  @Input() filament!: Filament
  @Output() edit = new EventEmitter<Filament>()

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
  }

  public async removeFilament() {
    const result = await Swal.fire(this.alertService.removeFilamentConfig(this.filament.farbe, this.filament.hersteller.name, this.filament.material.name))

    if (result.isDenied) {
      this.dataService.filament.remove(this.filament.id).subscribe({
        next: (res) => {
          this.toastService.success(`Filament "${this.filament.farbe} ${this.filament.hersteller.name}-${this.filament.material.name}" wurde erfolgreich entfernt.`, "Entfernen erfolgreich")
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Filament-Entfernen fehlgeschlagen');
        }
      })
    }
  }

  public updateFilament() {
    this.edit.emit(this.filament)
  }

}
