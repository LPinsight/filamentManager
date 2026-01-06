import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-element',
  templateUrl: './no-element.component.html',
  styleUrls: ['./no-element.component.scss']
})
export class NoElementComponent {
  @Input() title: string = ""
  @Input() class: string = ""

}
