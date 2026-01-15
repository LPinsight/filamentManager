import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filament-farbe',
  templateUrl: './filament-farbe.component.html',
  styleUrls: ['./filament-farbe.component.scss']
})
export class FilamentFarbeComponent {
  @Input() farbcode!: string
  @Input() farbe!: string
  @Input() nummer?: number
  @Input() link?: string
}
