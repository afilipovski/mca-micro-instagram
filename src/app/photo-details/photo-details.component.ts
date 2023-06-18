import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IAlbum, IPhoto, IUser } from '../interfaces';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.css']
})
export class PhotoDetailsComponent implements OnChanges {
  
  @Input() photo ?: IPhoto;
  @Output() close = new EventEmitter<void>();

  album !: IAlbum;
  username : string = "";
  more : boolean = false;

  constructor(
    private cs : ContentService  
  ) {}

  onClick(event : Event) {
    this.close.emit();
    this.more = false;
  }
  onWindowClick(event : Event) {
    this.more = false;
    event.stopPropagation();
  }
  onMoreClick(event : Event) {
    event.stopPropagation();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.photo)
      return;
    this.cs.getAlbum(this.photo.albumId).subscribe(album => {
      this.album = album
      this.cs.getUser(this.album.userId).subscribe(user => {
        this.username = user.username;
      })
    });
  }
  toggleBookmarked() {
    this.photo!.bookmarked = !this.photo!.bookmarked;
  }
}
