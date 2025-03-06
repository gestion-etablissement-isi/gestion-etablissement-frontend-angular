import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { IMatiere } from '../../interfaces/matiere.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
    headers: new HttpHeaders( {'Content-Type': 'application/json'} )
};
@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  apiURL: string = 'http://localhost:8222/api/v1/matiere'; 


    
    constructor(private http: HttpClient) { 

    }

    getAllMatieres(): Observable<IMatiere[]> {
        return this.http.get<IMatiere[]>(this.apiURL);
    }

    ajouterMatiere(Matiere: IMatiere): Observable<IMatiere> {
        return this.http.post<IMatiere>(this.apiURL, Matiere, httpOptions);
    }

    supprimerMatiere(id: string) {
        const url = `${this.apiURL}/${id}`;
        return this.http.delete(url, httpOptions);
    }
        
    consulterMatiere(id: string): Observable<IMatiere> {
        const url = `${this.apiURL}/${id}`;
        return this.http.get<IMatiere>(url);
    }

    updateMatiere(Matiere :IMatiere) : Observable<IMatiere>{
        return this.http.put<IMatiere>(this.apiURL, Matiere, httpOptions);
    }
  
}



