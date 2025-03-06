import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { ICours } from '../../interfaces/cours.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
    headers: new HttpHeaders( {'Content-Type': 'application/json'} )
};
@Injectable({
    providedIn: 'root'
})
export class CoursService {
  apiURL: string = 'http://localhost:8222/api/v1/cours'; 


    
  constructor(private http: HttpClient) { 

  }

  getAllCours(): Observable<ICours[]> {
      return this.http.get<ICours[]>(this.apiURL);
  }

  ajouterCours(Cours: ICours): Observable<ICours> {
      return this.http.post<ICours>(this.apiURL, Cours, httpOptions);
  }

  supprimerCours(id: string) {
      const url = `${this.apiURL}/${id}`;
      return this.http.delete(url, httpOptions);
  }
      
  consulterCours(id: string): Observable<ICours> {
      const url = `${this.apiURL}/${id}`;
      return this.http.get<ICours>(url);
  }

  updateCours(Cours :ICours) : Observable<ICours>{
      return this.http.put<ICours>(this.apiURL, Cours, httpOptions);
  }
}
