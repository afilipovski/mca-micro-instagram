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

  state = 'home';

  user ?: IUser;

  constructor(
    private cs : ContentService,
    private gs : GenerationService
  ) {}

  ngOnInit(): void {
    this.gs.newUser("superuser").subscribe(su => {
      this.user = su;
    })
  }

  newPost ?: IPhoto;

  onNewPost() {
    if (!this.user)
      return;
    this.gs.newPhoto(this.user.id).subscribe(p => this.newPost = p)
  }
  onNewPostClose() {
    if (!this.newPost) return;
    if (this.newPost.url == "" || this.newPost.thumbnailUrl == "") {
      this.newPost = undefined;
      return;
    }
    // this.cs.setPhotos([this.newPost].concat(this.cs.photos));

    this.newPost = undefined;
  }
}
