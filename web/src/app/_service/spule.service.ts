import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Spule } from '../_interface/spule';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../_config/api.config';

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

}
