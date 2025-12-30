import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hersteller } from '../_interface/hersteller';
import { BehaviorSubject, tap } from 'rxjs';
import { apiUrl } from '../_config/api.config';

@Injectable({
  providedIn: 'root'
})
export class HerstellerService {
  private subject = new BehaviorSubject<Hersteller[]>([])
  hersteller$ = this.subject.asObservable()

  constructor(private http: HttpClient) { }

  loadAll() {
      return this.http.get<Hersteller[]>(`${apiUrl}/hersteller`).pipe(tap(data => {
        this.subject.next(data)
      }))
    }
}
