import { Component, OnInit } from '@angular/core';
import { DataService } from '../_service/data.service';
import { Spule } from '../_interface/spule';
import { Filament } from '../_interface/filament';
import { Material } from '../_interface/material';
import { Hersteller } from '../_interface/hersteller';
import { DataState } from '../_interface/main';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
  standalone: false
})
export class PageHomeComponent implements OnInit {
    listen!: DataState

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.dataState$.subscribe(state => this.listen = state)
  }

}
