import { Injectable } from '@angular/core';
import { Filament } from '../_interface/filament';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../_config/api.config';

@Injectable({
  providedIn: 'root'
})
export class FilamentService {
  private subject = new BehaviorSubject<Filament[]>([])
  filament$ = this.subject.asObservable()

  constructor(private http: HttpClient) { }

  loadAll() {
      return this.http.get<Filament[]>(`${apiUrl}/filament`).pipe(tap(data => {
        this.subject.next(data)
      }))
    }
}
