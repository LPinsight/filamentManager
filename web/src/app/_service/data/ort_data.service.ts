import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ort, ortDrop } from '../../_interface/ort';
import { BehaviorSubject, map, tap } from 'rxjs';
import { apiUrl } from '../../_config/api.config';

@Injectable({
  providedIn: 'root'
})
export class Ort_dataService {
  private subject = new BehaviorSubject<Ort[]>([])
  ort$ = this.subject.asObservable()

  private changedSubject = new BehaviorSubject<void>(undefined)
  changed$ = this.changedSubject.asObservable()

  private notifyChanged() {
    this.changedSubject.next()
  }

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

  update(name: string, id: string) {
    let json = {
    "name": name
    }
    
    return this.http.put<Ort>(`${apiUrl}/ort/${id}`, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      this.notifyChanged()
      return res
    }))
  }

  remove(id: string) {
    return this.http.delete<Ort>(`${apiUrl}/ort/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

  updateSort(updates: ortDrop[]) {    
    return this.http.patch<void>(`${apiUrl}/ort/sort`, updates, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(() => {        
        this.loadAll().subscribe()
      })
    )
  }

}
