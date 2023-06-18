import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IAlbum, IPhoto, IUser } from '../interfaces';
import { ContentService } from '../content.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { GenerationService } from '../generation.service';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.css']
})
export class PhotoDetailsComponent implements OnChanges {
  
  @Input() photo ?: IPhoto;
  @Output() close = new EventEmitter<void>();

  album !: IAlbum;
  user !: IUser;
  more : boolean = false;
  editMode : boolean = false;

  constructor(
    private cs : ContentService,
    public gs : GenerationService,
    private dialog : MatDialog
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
      this.album = album;
      this.cs.getUser(this.album.userId).subscribe(user => {
        this.user = user;
      })
    });
  }
  toggleBookmarked() {
    this.photo!.bookmarked = !this.photo!.bookmarked;
  }
  deleteDialog() {
    let dialog = this.dialog.open(DeleteDialogComponent);
    dialog.afterClosed().subscribe(v => {
      if (v == true) {
        this.more = false;
        this.close.emit();  
        this.cs.getAllPhotos().subscribe(ps => {
          this.cs.setPhotos(ps.filter(pi => pi.id != this.photo?.id));
        })
      } 
    })
  }
  toggleEdit() {
    this.editMode = !this.editMode;
  }
  assignNewPhotoId() : void {
    this.gs.generatePhotoId().subscribe(id => {
      this.photo!.id = id;
    })
  }
  assignNewAlbumId() : void {
    this.gs.generateAlbumId().subscribe(id => {
      this.cs.remapAlbum(this.album.id, id);
      this.album!.id = id;
      this.photo!.albumId = id;
    })
  }
  onImageClick() {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
      let files = Array.from(input.files!);
      let url = URL.createObjectURL(files[0]);
      this.photo!.url = url;
      this.photo!.thumbnailUrl = url;
    };
    input.click();
    
  }


}
