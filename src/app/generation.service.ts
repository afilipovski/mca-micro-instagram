import { Injectable } from '@angular/core';
import { IAlbum, IPhoto, IUser } from './interfaces';
import { ContentService } from './content.service';
import { Observable, concat, of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GenerationService {
  constructor(
    private cs : ContentService  
  ) { }

  generatePhotoId() : Observable<number> {
    let maxId = 0;
    return new Observable(observer => {
      this.cs.getAllPhotos().subscribe(ps => {
          ps.forEach(pi => {
            maxId = Math.max(maxId,pi.id);
          })
          observer.next(maxId + 1);
        }
      )
    });
  }
  generateId(m : Map<number, any>) : Observable<number> {
    let maxId = 100;
    m.forEach((v,k) => {
      maxId = Math.max(maxId, k);
    })
    return of(maxId + 1);
  }
  generateAlbumId() : Observable<number> {
    return this.generateId(this.cs.albumById);
  }
  generateUserId() : Observable<number> {
    return this.generateId(this.cs.userById);
  }

  newAlbum(userId : number) : Observable<IAlbum> {
    return new Observable(observer => {
      this.generateAlbumId().subscribe(ai => {
        let album : IAlbum = {
          id: ai,
          userId: userId,
          title: ""
        }
        this.cs.albumById.set(ai,album)
        observer.next(album)
      })
    });
  }

  newUser(username : string) : Observable<IUser> {
    return new Observable(observer => {
      this.generateUserId().subscribe(ui => {
        let user : IUser = {
          id: ui,
          username: username
        }
        this.cs.userById.set(ui,user);
        observer.next(user)
      })
    });
  }

  newPhoto(userId : number) : Observable<IPhoto> {
    return new Observable(observer => {
      this.newAlbum(userId).subscribe(album => {
        this.generatePhotoId().subscribe(pi => {
          let photo : IPhoto = {
            albumId: album.id,
            id: pi,
            title: "",
            url: "",
            thumbnailUrl: "",
            bookmarked: false,
            liked: false
          }
          this.cs.setPhotos([photo].concat(this.cs.photos));
          observer.next(photo);
        })
      })
    })
  }
}
