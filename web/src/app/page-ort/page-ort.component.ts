import { Component, OnInit } from '@angular/core';
import { DataService } from '../_service/data.service';
import { Ort } from '../_interface/ort';

@Component({
  selector: 'app-page-ort',
  templateUrl: './page-ort.component.html',
  styleUrls: ['./page-ort.component.scss']
})
export class PageOrtComponent implements OnInit {
  orteListe: Ort[] = []

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.ort.ort$.subscribe(liste => {
      this.orteListe = liste
    })
  }

}
