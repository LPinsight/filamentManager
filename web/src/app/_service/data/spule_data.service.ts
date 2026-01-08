import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Spule, spuleDropRequest } from '../../_interface/spule';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../_config/api.config';
import { Filament } from '../../_interface/filament';

@Injectable({
  providedIn: 'root'
})
export class Spule_dataService {
  private spuleSubject = new BehaviorSubject<Spule[]>([])
  spule$ = this.spuleSubject.asObservable()

  constructor(private http: HttpClient) { }

  loadAll() {
    return this.http.get<Spule[]>(`${apiUrl}/spule`).pipe(tap(data => {
      this.spuleSubject.next(data)
    }))
  }

  create(filament: Filament) {
    let json = {
      "filament_id": filament.id,
      "verbrauchtes_Gewicht": 0,
      "archiviert": false
    }
    
    return this.http.post<Spule>(`${apiUrl}/spule`, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

  remove(id: string) {
    return this.http.delete<Spule>(`${apiUrl}/spule/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

  getFarbeById(id: string) {
    if (!id) return '—';

    const list = this.spuleSubject.value;
    return list.find(s => s.id === id)?.filament.farbe ?? `Unbekannt (#${id})`;
  }

  updateArchiv(spule: Spule) {
    let json = {
      "archiviert": !spule.archiviert
    }
    
    return this.http.patch<Spule>(`${apiUrl}/spule/${spule.id}/archiv`, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

  updateOrt(spuleId: string, ortId: string | null) {
    let json = {
      "ort_id": ortId
    }
    
    return this.http.patch<Spule>(`${apiUrl}/spule/${spuleId}/ort`, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

  removeNfc(spuleId: string) {
    let json = {
      "nummer": null,
      "nfc": null
    }
    
    return this.http.patch<Spule>(`${apiUrl}/spule/${spuleId}/nfc/remove`, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

  editNummer(spuleId: string, nummer: number) {
    let json = {
      "nummer": nummer
    }
    
    return this.http.patch<Spule>(`${apiUrl}/spule/${spuleId}/nummer`, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.loadAll().subscribe()
      return res
    }))
  }

  updateSortOrt(updates: spuleDropRequest[]) {    
    return this.http.patch<void>(`${apiUrl}/spule/ort`, updates, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(() => {        
        this.loadAll().subscribe()
      })
    )
  }

}
