import { Component, OnInit } from '@angular/core';
import { IPhoto } from './interfaces';
import { ContentService } from './content.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'micro-instagram';

  state : string = 'home';
  photos : IPhoto[] = [];

  constructor(
    private cs : ContentService  
  ) {}

  setState(value : string) {
    this.state = value;    
  }
  ngOnInit(): void {
    this.cs.getAllPhotos().subscribe(photos => this.photos = photos);
    this.cs.subject.subscribe(v => {
      this.photos = v;
    })
  }
  bookmarkedPhotos(): IPhoto[] {
    return this.photos.filter(p => p.bookmarked);
  }
}
