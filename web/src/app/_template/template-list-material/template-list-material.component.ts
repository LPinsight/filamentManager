import { Component, Input, OnInit } from '@angular/core';
import { Material } from '../../_interface/material';

@Component({
  selector: 'app-template-list-material',
  templateUrl: './template-list-material.component.html',
  styleUrls: ['./template-list-material.component.scss'],
  standalone: false
})
export class TemplateListMaterialComponent implements OnInit {
  @Input() material!: Material

  constructor() { }

  ngOnInit() {
  }

}
