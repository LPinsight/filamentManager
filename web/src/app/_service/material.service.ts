import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Material } from '../_interface/material';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../_config/api.config';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private subject = new BehaviorSubject<Material[]>([])
  material$ = this.subject.asObservable()

  constructor(private http: HttpClient) { }

  loadAll() {
    return this.http.get<Material[]>(`${apiUrl}/material`).pipe(tap(data => {
      this.subject.next(data)
    }))
  }

}
