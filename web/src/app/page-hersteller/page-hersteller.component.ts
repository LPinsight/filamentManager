import { Component, OnInit } from '@angular/core';
import { DataService } from '../_service/data.service';
import { Hersteller } from '../_interface/hersteller';

@Component({
  selector: 'app-page-hersteller',
  templateUrl: './page-hersteller.component.html',
  styleUrls: ['./page-hersteller.component.scss'],
  standalone: false
})
export class PageHerstellerComponent implements OnInit {
  herstellerListe: Hersteller[] = []

  constructor(
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.hersteller.hersteller$.subscribe(liste => {
      this.herstellerListe = liste      
    })
  }

}
