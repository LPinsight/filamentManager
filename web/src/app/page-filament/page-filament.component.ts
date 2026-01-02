import { Component, OnInit } from '@angular/core';
import { Filament } from '../_interface/filament';
import { DataService } from '../_service/data.service';
import Swal from 'sweetalert2';
import { AlertService } from '../_service/alert.service';
import { ToastService } from '../_service/toast.service';

@Component({
  selector: 'app-page-filament',
  templateUrl: './page-filament.component.html',
  styleUrls: ['./page-filament.component.scss']
})
export class PageFilamentComponent implements OnInit {
  filamentList: Filament[] = []

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.dataService.filament.filament$.subscribe(list => {
      this.filamentList = list
    })
  }

}
