import { Component, Input, OnInit } from '@angular/core';
import { Filament } from '../../_interface/filament';

@Component({
  selector: 'app-template-list-filament',
  templateUrl: './template-list-filament.component.html',
  styleUrls: ['./template-list-filament.component.scss']
})
export class TemplateListFilamentComponent implements OnInit {
  @Input() filament!: Filament

  constructor() { }

  ngOnInit() {
  }

}
