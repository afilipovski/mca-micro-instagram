import { Injectable } from '@angular/core';
import { IAlbum, IPhoto, IUser } from './interfaces';
import { ContentService } from './content.service';
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class GenerationService {
  constructor(
    private cs : ContentService,
    private http : HttpClient
  ) { }

  generatePhotoId() : Observable<number> {
    let maxId = 0;
    return new Observable(observer => {
      // this.cs.getAllPhotos().subscribe(ps => {
      //     ps.forEach(pi => {
      //       maxId = Math.max(maxId,pi.id);
      //     })
      //     observer.next(maxId + 1);
      //   }
      // )
      observer.next(10000);
    });
  }

  newAlbum(userId : number) : Observable<IAlbum> {
    return new Observable(observer => {
      this.http.post<IAlbum>(`https://jsonplaceholder.typicode.com/albums`, {
        userId: userId,
        title: ""
      }).subscribe(album => {
        console.log("NEW ALBUM - POST", album);
        this.cs.albumById.set(album.id,album)
        observer.next(album)
      })
    });
  }

  newUser(username : string) : Observable<IUser> {
    return new Observable(observer => {
      this.http.post<IUser>(`https://jsonplaceholder.typicode.com/users`, {
        username: username
      }).subscribe(user => {
        console.log("NEW USER - POST", user);
        this.cs.setUser(user);        
        observer.next(user);
      })
    });
  }

  newPhoto(userId : number) : Observable<IPhoto> {
    console.log("NEW PHOTO - CREATED LOCALLY");
    return new Observable(observer => {
      this.newAlbum(userId).subscribe(album => {
        const photo : IPhoto = {
          albumId: album.id,
          id: 0,
          title: "",
          url: "",
          thumbnailUrl: "",
          bookmarked: false,
          liked: false
        }
        observer.next(photo);
      })
    })
  }
}
