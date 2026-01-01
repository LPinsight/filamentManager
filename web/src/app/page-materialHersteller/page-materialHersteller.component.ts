import { Component, OnInit } from '@angular/core';
import { Material } from '../_interface/material';
import { DataService } from '../_service/data.service';
import { Hersteller } from '../_interface/hersteller';

@Component({
  selector: 'app-page-materialHersteller',
  templateUrl: './page-materialHersteller.component.html',
  styleUrls: ['./page-materialHersteller.component.scss'],
  standalone: false,
})
export class PageMaterialHerstellerComponent implements OnInit {
  materialList: Material[] = []
  herstellerListe: Hersteller[] = []

  constructor(
      private dataService: DataService
    ) { }

  ngOnInit() {
    this.dataService.material.material$.subscribe(liste => {
      this.materialList = liste
    })
    this.dataService.hersteller.hersteller$.subscribe(liste => {
      this.herstellerListe = liste      
    })
  }

}
