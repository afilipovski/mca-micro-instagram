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

  photosById : Map<number,IPhoto> = new Map();
  albumById : Map<number,IAlbum> = new Map();
  userById : Map<number,IUser> = new Map();

  lastSessionPhotos : IPhoto[] = [];

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
      .subscribe(
        photo => {
          this.http.put<IPhoto>(`https://jsonplaceholder.typicode.com/albums/${photo.albumId}`, {
            description: albumDescription
          })
          .subscribe(
            album => {
            console.log("PHOTO UPDATE - PUT", photo);
            console.log("ALBUM UPDATE - PUT", album);
            },
            err => console.log("Album ID doesn't exist in mock API response. Changes applied locally.")
        )},
        err => {
          this.photosById.get(photo.id)!.title = photo.title;
          this.albumById.get(photo.albumId)!.title = albumDescription;
          console.log("Photo ID doesn't exist in mock API response. Changes applied locally.")
        }
      )
  }

  // getAllPhotos(): Observable<IPhoto[]> {
  //   if (this.photos)
  //     return of<IPhoto[]>(this.photos);
  //   const photosObservable = this.http.get<IPhoto[]>(`https://jsonplaceholder.typicode.com/photos`);
  //   return new Observable((observer) => {
  //     photosObservable.subscribe(photos => {
  //       this.photos = photos;
  //       observer.next(photos);
  //     });
  //   });
  // }

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
        observer.next(Array.from(this.userById.values()))
      })
    })
  }

  setPhotos(photos : IPhoto[]): void {
    // this.photos = photos;
    this.photosSubject.next();
  }

  remapAlbum(oldIndex : number, newIndex : number): void {
    const album = this.albumById.get(oldIndex);
    if (album)
      this.albumById.set(newIndex, album);
  }

  setUser(user : IUser): void {
    this.userById.set(user.id,user);
    this.usersSubject.next();
  }
}
