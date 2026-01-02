import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hersteller } from '../_interface/hersteller';
import { BehaviorSubject, map, tap } from 'rxjs';
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

  create(name: string) {
    let json = {
    "name": name
    }
    
    return this.http.post<Hersteller>(`${apiUrl}/hersteller`, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

  update(name: string, id: string) {
    let json = {
    "name": name
    }
    
    return this.http.put<Hersteller>(`${apiUrl}/hersteller/${id}`, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

  remove(id: string) {
    return this.http.delete<Hersteller>(`${apiUrl}/hersteller/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }
}
