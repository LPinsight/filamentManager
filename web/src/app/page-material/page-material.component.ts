import { Component, OnInit } from '@angular/core';
import { Material } from '../_interface/material';
import { DataService } from '../_service/data.service';

@Component({
  selector: 'app-page-material',
  templateUrl: './page-material.component.html',
  styleUrls: ['./page-material.component.scss']
})
export class PageMaterialComponent implements OnInit {
  materialList: Material[] = []

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.material.material$.subscribe(liste => {
      this.materialList = liste
    })
  }

}
