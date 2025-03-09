import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { ICreneau } from "../../interfaces/creneau.interface";
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CreneauService {

  private apiURL: string = 'http://localhost:8222/api/v1/creneau';
  
  constructor(private http: HttpClient) {}

  getAllCreneaux(): Observable<ICreneau[]> {
      return this.http.get<ICreneau[]>(this.apiURL);
  }

  ajouterCreneau(creneau: ICreneau): Observable<ICreneau> {
      return this.http.post<ICreneau>(this.apiURL, creneau, httpOptions);
  }

  supprimerCreneau(id: string): Observable<void> {
      const url = `${this.apiURL}/${id}`;
      return this.http.delete<void>(url, httpOptions);
  }
      
  consulterCreneau(id: string): Observable<ICreneau> {
      const url = `${this.apiURL}/${id}`;
      return this.http.get<ICreneau>(url);
  }

  updateCreneau(creneau: ICreneau): Observable<ICreneau> {
      return this.http.put<ICreneau>(`${this.apiURL}/${creneau.id}`, creneau, httpOptions);
  }
}
