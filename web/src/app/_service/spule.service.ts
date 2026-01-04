import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Spule } from '../_interface/spule';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../_config/api.config';
import { Filament } from '../_interface/filament';
import { Ort } from '../_interface/ort';

@Injectable({
  providedIn: 'root'
})
export class SpuleService {
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

}
