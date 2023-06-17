import { Injectable } from '@angular/core';
import { IAlbum, IPhoto, IUser } from './interfaces';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(
    private http: HttpClient  
  ) { }

  photos !: IPhoto[];
  albumById : Map<number,IAlbum> = new Map();
  userById : Map<number,IUser> = new Map();

  getAllPhotos(): Observable<IPhoto[]> {
    if (this.photos)
      return of<IPhoto[]>(this.photos);
    let photosObservable = this.http.get<IPhoto[]>(`https://jsonplaceholder.typicode.com/photos`);
    photosObservable.subscribe(photos => this.photos = photos);
    return photosObservable;
  }

  getAlbum(albumId : number): Observable<IAlbum> {
    if (this.albumById.has(albumId))
      return of<IAlbum>(this.albumById.get(albumId)!);
    let albumObservable = this.http.get<IAlbum>(`https://jsonplaceholder.typicode.com/albums/${albumId}`);
    albumObservable.subscribe(album => this.albumById.set(album.id,album));
    return albumObservable;
  }

  getUser(userId : number): Observable<IUser> {
    if (this.userById.has(userId))
      return of<IUser>(this.userById.get(userId)!);
    let userObservable = this.http.get<IUser>(`https://jsonplaceholder.typicode.com/users/${userId}`);
    userObservable.subscribe(user => this.userById.set(user.id,user));
    return userObservable;
  }

  toggleBookmark(id : number) {
    let index = this.photos?.findIndex(p => p.id == id);
    if (index != -1)
      this.photos.find(p => p.id == id) ;
  }
}
