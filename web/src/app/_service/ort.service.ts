import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ort } from '../_interface/ort';
import { BehaviorSubject, tap } from 'rxjs';
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
}
