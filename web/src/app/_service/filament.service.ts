import { Injectable } from '@angular/core';
import { Filament } from '../_interface/filament';
import { BehaviorSubject, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../_config/api.config';
import { Material } from '../_interface/material';

@Injectable({
  providedIn: 'root'
})
export class FilamentService {
  private subject = new BehaviorSubject<Filament[]>([])
  filament$ = this.subject.asObservable()

  private changedSubject = new BehaviorSubject<void>(undefined)
  changed$ = this.changedSubject.asObservable()

  constructor(private http: HttpClient) { }

  private notifyChanged() {
    this.changedSubject.next()
  }

  loadAll() {
    return this.http.get<Filament[]>(`${apiUrl}/filament`).pipe(tap(data => {
      this.subject.next(data)
    }))
  }

  create(data: Filament) {
    return this.http.post<Filament>(`${apiUrl}/filament`, data, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

  remove(id: string) {
    return this.http.delete<Filament>(`${apiUrl}/filament/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

}
