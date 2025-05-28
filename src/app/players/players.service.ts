import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(private http: HttpClient) { }

  login(player: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/login', player);
  }
}
