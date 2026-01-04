import { Component } from '@angular/core';
import { DataService } from './_service/data.service';
import { Hersteller } from './_interface/hersteller';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor (
    private dataService: DataService
  ) {}
  
}
