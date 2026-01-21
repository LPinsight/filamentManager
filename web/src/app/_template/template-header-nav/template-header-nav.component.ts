import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-template-header-nav',
  templateUrl: './template-header-nav.component.html',
  styleUrls: ['./template-header-nav.component.scss'],
  standalone: false
})
export class TemplateHeaderNavComponent implements OnInit {
  @Output() linkClicked = new EventEmitter<void>()

  constructor() { }

  ngOnInit() {
  }

  public closeNav() {
    this.linkClicked.emit()
  }

}
