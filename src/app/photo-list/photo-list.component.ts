import { Component, HostListener, OnInit, Input } from '@angular/core';
import { IPhoto } from '../interfaces';
import { ContentService } from '../content.service';
import { MatDialog } from '@angular/material/dialog';
import { PhotoDetailsComponent } from '../shared/photo-details/photo-details.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css']
})
export class PhotoListComponent implements OnInit {
  isc = "#vert"

  constructor(
    private cs:ContentService,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.onScroll();
  }
  
  @Input() saved !: boolean;

  photos : IPhoto[] = [];
  maxDisplayed: number = 0;

  displayedPhoto ?: IPhoto;

  onScroll(): void {
    this.maxDisplayed += 70;
    this.cs.getPhotosUpTo(this.maxDisplayed).subscribe(p => this.photos = p);
  }

  getApplicablePhotos(photos : IPhoto[]): IPhoto[] {
    return photos.filter(p => !this.saved || p.bookmarked);
  }

  displayPhoto(photo : IPhoto) {
    this.dialog.open(PhotoDetailsComponent, {
      data: {
        photo: photo
      },
      maxWidth: '90vw'
    });
  }

}
