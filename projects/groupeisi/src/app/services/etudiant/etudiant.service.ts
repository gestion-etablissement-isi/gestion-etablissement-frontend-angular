import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { IEtudiant } from '../../interfaces/etudiant.interface'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
    headers: new HttpHeaders( {'Content-Type': 'application/json'} )
};
@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  apiURL: string = 'http://localhost:8222/api/v1/etudiants'; 


    
  constructor(private http: HttpClient) { 

  }

  getAllEtudiants(): Observable<IEtudiant[]> {
      return this.http.get<IEtudiant[]>(this.apiURL);
  }

  ajouterEtudiant(Etudiant: IEtudiant): Observable<IEtudiant> {
      return this.http.post<IEtudiant>(this.apiURL, Etudiant, httpOptions);
  }

  supprimerEtudiant(id: string) {
      const url = `${this.apiURL}/${id}`;
      return this.http.delete(url, httpOptions);
  }
      
  consulterEtudiant(id: string): Observable<IEtudiant> {
      const url = `${this.apiURL}/${id}`;
      return this.http.get<IEtudiant>(url);
  }

  updateEtudiant(Etudiant :IEtudiant) : Observable<IEtudiant>{
      return this.http.put<IEtudiant>(this.apiURL, Etudiant, httpOptions);
  }
}
