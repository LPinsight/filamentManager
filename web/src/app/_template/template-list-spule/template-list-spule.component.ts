import { Component, Input, OnInit } from '@angular/core';
import { Spule } from '../../_interface/spule';
import { ToastService } from '../../_service/toast.service';
import { AlertService } from '../../_service/alert.service';
import { DataService } from '../../_service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-template-list-spule',
  templateUrl: './template-list-spule.component.html',
  styleUrls: ['./template-list-spule.component.scss']
})
export class TemplateListSpuleComponent implements OnInit {
  @Input() spule!: Spule

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {    
  }

  public async chanceArchiv() {
    const result = await Swal.fire(this.alertService.changeArchivConfig(this.spule.filament.farbe, this.spule.filament.hersteller.name, this.spule.filament.material.name, this.spule.archiviert))

    if (result.isConfirmed) {
      const wordding = this.spule.archiviert ? "aktiviert" : "archiviert"
      const titel = this.spule.archiviert ? "Aktivierung" : "Archivierung"
      this.dataService.spule.updateArchiv(this.spule).subscribe({
        next: (res) => {
          this.toastService.success(`Spule "${this.spule.filament.farbe}" wurde erfolgreich ${wordding}.`, `${titel} erfolgreich`)
        },
        error: (err) => {
          this.toastService.error(err.error.message, `${titel} fehlgeschlagen`);
        }
      })
    }
  }

}
