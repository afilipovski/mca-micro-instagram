import { Injectable } from '@angular/core';
import { IPhoto } from './interfaces';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(
    private http: HttpClient  
  ) { }

  getAllPhotos(): Observable<IPhoto[]> {
    return this.http.get<IPhoto[]>(`https://jsonplaceholder.typicode.com/photos`);
  }
}
