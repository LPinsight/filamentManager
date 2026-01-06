import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ort } from '../_interface/ort';
import { BehaviorSubject, map, tap } from 'rxjs';
import { apiUrl } from '../_config/api.config';

@Injectable({
  providedIn: 'root'
})
export class OrtService {
  private subject = new BehaviorSubject<Ort[]>([])
  ort$ = this.subject.asObservable()

  constructor(private http: HttpClient) { }

  loadAll() {
    return this.http.get<Ort[]>(`${apiUrl}/ort`).pipe(tap(data => {
      this.subject.next(data)
    }))
  }

  getNameById(id: string) {
    if (!id) return '—';

    const list = this.subject.value;
    return list.find(o => o.id === id)?.name ?? `Unbekannt (#${id})`;
  }

  create(name: string) {
    let json = {
    "name": name
    }
    
    return this.http.post<Ort>(`${apiUrl}/ort`, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

}
