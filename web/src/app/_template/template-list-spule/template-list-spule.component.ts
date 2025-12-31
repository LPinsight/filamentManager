import { Component, Input, OnInit } from '@angular/core';
import { Spule } from '../../_interface/spule';

@Component({
  selector: 'app-template-list-spule',
  templateUrl: './template-list-spule.component.html',
  styleUrls: ['./template-list-spule.component.scss']
})
export class TemplateListSpuleComponent implements OnInit {
  @Input() spule!: Spule

  constructor() { }

  ngOnInit() {    
  }

}
