import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(private http: HttpClient, private cookies: CookieService) { }

  login(player: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/login', player);
  }

  register(player: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/register', player);
  }

  setToken(token: string) {
    this.cookies.set('token', token);
    console.log('Token guardado:', token);
  }

  getToken(): string {
    return this.cookies.get('token');
  }

  assignJob(playerId: number, jobId: number, jobAspectId: number) {
    return this.http.post(`http://localhost:3000/api/players/${playerId}/assign-job`, {
      jobId,
      jobAspectId
    });
  }

  getPlayerLogged(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get('http://localhost:3000/api/player/me', { headers });
  }
}
