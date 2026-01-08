import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SpulenSortMode } from '../../_interface/spule';
import { sortDirection } from '../../_interface/main';
import { FilamentSortMode } from '../../_interface/filament';

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent<T extends string> {
  @Input() sortModeActiv!: T
  @Input() sortModeSelf!: T
  @Input() sortDirection!: sortDirection

  @Input() titel!: String
  @Input() svg?: String | null
  @Input() icon?: String | null

  @Output() clickSort = new EventEmitter<T>()

}
