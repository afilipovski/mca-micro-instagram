import { Injectable } from '@angular/core';
import { IAlbum, IPhoto, IUser } from './interfaces';
import { Observable, Subject, catchError, last, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(
    private http: HttpClient  
  ) { }

  private photosById : Map<number,IPhoto> = new Map();
  private albumById : Map<number,IAlbum> = new Map();
  private userById : Map<number,IUser> = new Map();
  private lastSessionPhotos : IPhoto[] = [];

  photosSubject : Subject<void> = new Subject();
  usersSubject : Subject<void> = new Subject();

  getPhotosUpTo(upperBound : number): Observable<IPhoto[]> {
    let lowerBound = 0;
    for (let key of this.photosById.keys()) {
      lowerBound = Math.max(lowerBound, key);
    }
    lowerBound--;
    return new Observable(s => {
      this.http.get<IPhoto[]>(`https://jsonplaceholder.typicode.com/photos?_start=${lowerBound+1}&_limit=${upperBound-lowerBound}`)
      .subscribe(photoArrayResponse => {
        photoArrayResponse.forEach(photo => this.photosById.set(photo.id, photo));
        s.next(this.lastSessionPhotos.concat([...this.photosById.values()]))
      });
    })
  }

  uploadPhoto(photo : IPhoto): Observable<void> {
    return new Observable(s => 
    this.http.post<IPhoto>(`https://jsonplaceholder.typicode.com/photos`, {...photo}).subscribe(r => {
      photo.id = r.id;
      console.log("PHOTO UPLOADED - POST", r);
      this.lastSessionPhotos = [photo].concat(this.lastSessionPhotos);
      this.photosSubject.next();
      s.next();
    }));
  }

  updatePhoto(photo : IPhoto, albumDescription : string) : void {
      this.http.put<IPhoto>(`https://jsonplaceholder.typicode.com/photos/${photo.id}`, {...photo})
      .subscribe({
        next: (response) => {
          this.http.put<IPhoto>(`https://jsonplaceholder.typicode.com/albums/${response.albumId}`, {
            description: albumDescription
          })
          .subscribe(
            album => {
            console.log("PHOTO UPDATE - PUT", response);
            console.log("ALBUM UPDATE - PUT", album);
            },
          )
        },
        error: (error) => console.log("Photo doesn't exist in mock API. Changes saved locally.")
      })
  }

  deletePhoto(id : number): void {
    this.http.delete(`https://jsonplaceholder.typicode.com/photos/${id}`).subscribe(_ => {
      this.photosById.delete(id);
      this.lastSessionPhotos = this.lastSessionPhotos.filter(p => p.id != id);
      console.log(`REMOVED PHOTO - DELETE`);
      this.photosSubject.next();
    })
  }

  getAlbum(albumId : number): Observable<IAlbum> {
    if (this.albumById.has(albumId))
      return of<IAlbum>(this.albumById.get(albumId)!);
    const albumObservable = this.http.get<IAlbum>(`https://jsonplaceholder.typicode.com/albums/${albumId}`);
    return new Observable((observer) => {
      albumObservable.subscribe(album => {
        this.albumById.set(album.id,album)
        observer.next(album);
      })
    });
  }

  getUser(userId : number): Observable<IUser> {
    if (this.userById.has(userId))
      return of<IUser>(this.userById.get(userId)!);
    const userObservable = this.http.get<IUser>(`https://jsonplaceholder.typicode.com/users/${userId}`);
    return new Observable((observer) => {
      userObservable.subscribe(user => {
        this.userById.set(user.id,user)
        observer.next(this.userById.get(userId));
      })
    });
  }

  getAllUsers(): Observable<IUser[]> {
    return new Observable(observer => {
      this.http.get<IUser[]>(`https://jsonplaceholder.typicode.com/users`).subscribe(us => {
        us.forEach(ui => {
          this.userById.set(ui.id,ui);
        })
        observer.next(Array.from(this.userById.values()).reverse())
      })
    })
  }

  setUser(user : IUser): void {
    this.userById.set(user.id,user);
    this.usersSubject.next();
  }
  setAlbum(album : IAlbum): void {
    this.albumById.set(album.id, album);
  }
}
