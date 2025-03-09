import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { IDescription } from '../../interfaces/description.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
    headers: new HttpHeaders( {'Content-Type': 'application/json'} )
};
@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

  apiURL: string = 'http://localhost:8222/api/v1/description'; 


    
  constructor(private http: HttpClient) { 

  }

  getAllDescription(): Observable<IDescription[]> {
      return this.http.get<IDescription[]>(this.apiURL);
  }

  ajouterDescription(Description: IDescription): Observable<IDescription> {
      return this.http.post<IDescription>(this.apiURL, Description, httpOptions);
  }

  supprimerDescription(id: string) {
      const url = `${this.apiURL}/${id}`;
      return this.http.delete(url, httpOptions);
  }
      
  consulterDescription(id: string): Observable<IDescription> {
      const url = `${this.apiURL}/${id}`;
      return this.http.get<IDescription>(url);
  }

  updateDescription(Description :IDescription) : Observable<IDescription>{
      return this.http.put<IDescription>(this.apiURL, Description, httpOptions);
  }
}
