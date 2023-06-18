import { Injectable } from '@angular/core';
import { IPhoto } from './interfaces';
import { ContentService } from './content.service';
import { Observable, of } from 'rxjs'

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
  

  // newPhoto() : Observable<IPhoto> {
  //   return new Observable(observer => {
  //     this.generatePhotoId().subscribe(pi => {
  //       this.g
  //     })
  //   })
  //   return {
  //     // albumId: maxId+1,
  //     // id: number;
  //     // title: string;
  //     // url: string;
  //     // thumbnailUrl: string;
  //     // bookmarked: boolean;
  //   }
  // }
}
