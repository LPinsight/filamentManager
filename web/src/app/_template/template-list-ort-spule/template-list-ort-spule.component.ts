import { Component, Input, OnInit } from '@angular/core';
import { Spule } from '../../_interface/spule';
import { AlertService } from '../../_service/alert.service';
import { DataService } from '../../_service/data.service';
import { ToastService } from '../../_service/toast.service';

@Component({
  selector: 'app-template-list-ort-spule',
  templateUrl: './template-list-ort-spule.component.html',
  styleUrls: ['./template-list-ort-spule.component.scss']
})
export class TemplateListOrtSpuleComponent implements OnInit {
  @Input() spule!: Spule

  constructor(
    // private dataService: DataService,
    // private alertService: AlertService,
    // private toastService: ToastService,
  ) {}

  ngOnInit(){
  }
}
