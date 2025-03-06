import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { IProfesseur } from '../../interfaces/professeur.interface'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
    headers: new HttpHeaders( {'Content-Type': 'application/json'} )
};
@Injectable({
  providedIn: 'root'
})
export class ProfesseurService {
  apiURL: string = 'http://localhost:8222/api/v1/professeurs'; 


    
  constructor(private http: HttpClient) { 

  }

  getAllProfesseurs(): Observable<IProfesseur[]> {
      return this.http.get<IProfesseur[]>(this.apiURL);
  }

  ajouterProfesseur(Professeur: IProfesseur): Observable<IProfesseur> {
      return this.http.post<IProfesseur>(this.apiURL, Professeur, httpOptions);
  }

  supprimerProfesseur(id: string) {
      const url = `${this.apiURL}/${id}`;
      return this.http.delete(url, httpOptions);
  }
      
  consulterProfesseur(id: string): Observable<IProfesseur> {
      const url = `${this.apiURL}/${id}`;
      return this.http.get<IProfesseur>(url);
  }

  updateProfesseur(Professeur :IProfesseur) : Observable<IProfesseur>{
      return this.http.put<IProfesseur>(this.apiURL, Professeur, httpOptions);
  }
}
