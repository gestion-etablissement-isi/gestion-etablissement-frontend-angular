import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { IClasse } from "../../interfaces/classe.interface";
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
    headers: new HttpHeaders( {'Content-Type': 'application/json'} )
};
@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  apiURL: string = 'http://localhost:8222/api/v1/class'; 


    
    constructor(private http: HttpClient) { 

    }

    getAllClasses(): Observable<IClasse[]> {
        return this.http.get<IClasse[]>(this.apiURL);
    }

    ajouterClasse(classe: IClasse): Observable<IClasse> {
        return this.http.post<IClasse>(this.apiURL, classe, httpOptions);
    }

    supprimerClasse(id: string) {
        const url = `${this.apiURL}/${id}`;
        return this.http.delete(url, httpOptions);
    }
        
    consulterClasse(id: string): Observable<IClasse> {
        const url = `${this.apiURL}/${id}`;
        return this.http.get<IClasse>(url);
    }

    updateClasse(classe :IClasse) : Observable<IClasse>{
        return this.http.put<IClasse>(this.apiURL, classe, httpOptions);
    }
  
}



