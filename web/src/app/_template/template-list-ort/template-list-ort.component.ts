import { Component, Input, OnInit } from '@angular/core';
import { Ort } from '../../_interface/ort';

@Component({
  selector: 'app-template-list-ort',
  templateUrl: './template-list-ort.component.html',
  styleUrls: ['./template-list-ort.component.scss'],
  standalone: false
})
export class TemplateListOrtComponent implements OnInit {
  @Input() ort!: Ort

  constructor() { }

  ngOnInit() {
  }

}
