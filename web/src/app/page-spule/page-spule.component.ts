import { Component, OnInit } from '@angular/core';
import { Spule } from '../_interface/spule';
import { DataService } from '../_service/data.service';

@Component({
  selector: 'app-page-spule',
  templateUrl: './page-spule.component.html',
  styleUrls: ['./page-spule.component.scss']
})
export class PageSpuleComponent implements OnInit {
  spuleList: Spule[] = []

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.spule.spule$.subscribe(list => {
      this.spuleList = list
    })
  }

}
