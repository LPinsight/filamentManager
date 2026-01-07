import { Component, Input, OnInit } from '@angular/core';
import { Spule } from '../../_interface/spule';
import { AlertService } from '../../_service/alert.service';
import { DataService } from '../../_service/data.service';
import { ToastService } from '../../_service/toast.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-template-list-ort-spule',
  templateUrl: './template-list-ort-spule.component.html',
  styleUrls: ['./template-list-ort-spule.component.scss']
})
export class TemplateListOrtSpuleComponent implements OnInit {
  @Input() spule!: Spule

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private toastService: ToastService,
  ) {}

  ngOnInit(){
  }

  public async showSpule () {
    const material: string = this.dataService.material.getNameById(this.spule.filament.material.id)
    const hersteller: string = this.dataService.hersteller.getNameById(this.spule.filament.hersteller.id)

    const result = Swal.fire(this.alertService.spule.showConfig(this.spule,material, hersteller))
  }
}
