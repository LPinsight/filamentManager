import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Material } from '../_interface/material';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../_config/api.config';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private subject = new BehaviorSubject<Material[]>([])
  material$ = this.subject.asObservable()

  private changedSubject = new BehaviorSubject<void>(undefined)
  changed$ = this.changedSubject.asObservable()

  constructor(private http: HttpClient) { }

  private notifyChanged() {
    this.changedSubject.next()
  }

  loadAll() {
    return this.http.get<Material[]>(`${apiUrl}/material`).pipe(tap(data => {
      this.subject.next(data)
    }))
  }

  create(name: string, dichte: number, durchmesser: number) {
    let json = {
      "name": name,
      "dichte": dichte,
      "durchmesser": durchmesser
    }
    
    return this.http.post<Material>(`${apiUrl}/material`, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

  update(id: string, name: string, dichte: number, durchmesser: number) {
    let json = {
      "name": name,
      "dichte": dichte,
      "durchmesser": durchmesser
    }
    
    return this.http.put<Material>(`${apiUrl}/material/${id}`, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      this.notifyChanged()
      return res
    }))
  }

  remove(id: string) {
    return this.http.delete<Material>(`${apiUrl}/material/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

}
