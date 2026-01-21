import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-header',
  templateUrl: './template-header.component.html',
  styleUrls: ['./template-header.component.scss'],
  standalone: false
})
export class TemplateHeaderComponent implements OnInit {
  public navOpen = false

  constructor() { }

  ngOnInit() {
  }

  public toggleNav() {
    this.navOpen = !this.navOpen
  }

}
