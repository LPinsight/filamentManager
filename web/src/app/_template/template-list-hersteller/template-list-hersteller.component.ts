import { Component, Input, OnInit } from '@angular/core';
import { Hersteller } from '../../_interface/hersteller';

@Component({
  selector: 'app-template-list-hersteller',
  templateUrl: './template-list-hersteller.component.html',
  styleUrls: ['./template-list-hersteller.component.scss'],
  standalone: false
})
export class TemplateListHerstellerComponent implements OnInit {
  @Input() hersteller!: Hersteller;

  constructor() { }

  ngOnInit() {    
  }

}
