import { Component, OnInit } from '@angular/core';
import { IPhoto, IUser } from './interfaces';
import { ContentService } from './content.service';
import { GenerationService } from './generation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'micro-instagram';

  state : string = 'home';
  photos : IPhoto[] = [];

  user ?: IUser;

  constructor(
    private cs : ContentService,
    private gs : GenerationService
  ) {}

  setState(value : string) {
    this.state = value;    
  }
  ngOnInit(): void {
    this.cs.getAllPhotos().subscribe(photos => this.photos = photos);
    this.cs.photosSubject.subscribe(v => {
      this.photos = v;
    })

    this.gs.newUser("superuser").subscribe(su => {
      this.user = su;
    })
  }
  bookmarkedPhotos(): IPhoto[] {
    return this.photos.filter(p => p.bookmarked);
  }

  newPost ?: IPhoto;

  onNewPost() {
    this.gs.newPhoto(this.user!.id).subscribe(p => this.newPost = p)
  }
  onNewPostClose() {
    if (!this.newPost) return;
    if (this.newPost.url == "" || this.newPost.thumbnailUrl == "") {
      this.newPost = undefined;
      return;
    }
    this.cs.setPhotos([this.newPost].concat(this.cs.photos));

    this.newPost = undefined;
  }
}
