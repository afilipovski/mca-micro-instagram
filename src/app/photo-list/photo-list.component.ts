import { Component, HostListener, OnInit, Input } from '@angular/core';
import { IPhoto } from '../interfaces';
import { ContentService } from '../content.service';
import { MatDialog } from '@angular/material/dialog';
import { PhotoDetailsComponent } from '../shared/photo-details/photo-details.component';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css']
})
export class PhotoListComponent {
  isc = "#vert"

  constructor(
    private cs:ContentService,
    private dialog: MatDialog
  ){}
  
  @Input() photos !: IPhoto[];
  maxDisplayed: number = 70;

  displayedPhoto ?: IPhoto;

  onScroll(): void {
    this.maxDisplayed += 70;
  }

  displayPhoto(photo : IPhoto) {
    this.dialog.open(PhotoDetailsComponent, {
      data: {
        photo: photo
      }
    });
  }

}
