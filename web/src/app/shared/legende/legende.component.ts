import { Component, Input } from '@angular/core';
import { Legende } from '../../_interface/legende';

@Component({
  selector: 'app-legende',
  templateUrl: './legende.component.html',
  styleUrls: ['./legende.component.scss']
})
export class LegendeComponent {
  @Input() items: Legende[] = []

  isNested(label: string | Legende[]): label is Legende[] {
    return Array.isArray(label)
  }
}
