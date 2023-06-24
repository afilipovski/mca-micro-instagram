import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IAlbum, IPhoto, IUser } from 'src/app/interfaces';
import { ContentService } from 'src/app/content.service';
import { GenerationService } from 'src/app/generation.service';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.css']
})
export class PhotoDetailsComponent implements OnChanges, OnInit {
  
  @Input() photo ?: IPhoto;
  @Input() startInEditMode : boolean = false;

  album !: IAlbum;
  user !: IUser;
  more : boolean = false;
  editMode : boolean = false;

  localData !: {
    username : string,
    albumTitle : string,
    photoTitle : string,
    albumId : number,
    photoId : number,
    url: string
  };

  constructor(
    private cs : ContentService,
    public gs : GenerationService,
    private dialog : MatDialog,
    private dialogRef : MatDialogRef<PhotoDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      photo : IPhoto,
      editMode ?: boolean
    }
  ) {}

  ngOnInit(): void {
    this.photo = this.data.photo;
    this.editMode = this.startInEditMode;
    this.cs.getAlbum(this.photo.albumId).subscribe(album => {
      this.album = album;
      this.cs.getUser(this.album.userId).subscribe(user => {
        this.user = user;

        this.localData = {
          username: user.username,
          albumId: album.id,
          albumTitle: album.title,
          photoId: this.photo!.id,
          photoTitle: this.photo!.title,
          url: this.photo!.url
        }

      })
    });
  }

  onClick(event : Event) {
    this.more = false;
  }
  onMoreClick(event : Event) {
    event.stopPropagation();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.photo)
      return;
    
  }
  deleteDialog() {
    let dialog = this.dialog.open(DeleteDialogComponent);
    dialog.afterClosed().subscribe(v => {
      if (v == false)
        return;
      this.more = false;
      this.cs.getAllPhotos().subscribe(ps => {
        this.cs.setPhotos(ps.filter(pi => pi.id != this.photo?.id));
      })
      this.dialogRef.close();
    })
  }
  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.album.id = this.photo!.albumId = this.localData.albumId;
      this.album.title = this.localData.albumTitle;
      this.photo!.id = this.localData.photoId;
      this.photo!.title = this.localData.photoTitle;
      this.photo!.url = this.photo!.thumbnailUrl = this.localData.url;
      this.user.username = this.localData.username;
    }
  }
  assignNewPhotoId() : void {
    this.gs.generatePhotoId().subscribe(id => {
      this.localData.photoId = id;
    })
  }
  assignNewAlbumId() : void {
    this.gs.generateAlbumId().subscribe(id => {
      this.cs.remapAlbum(this.album.id, id);
      this.localData.albumId = id;
    })
  }
  onImageClick() {
    if (!this.editMode)
      return;
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
      let files = Array.from(input.files!);
      let url = URL.createObjectURL(files[0]);
      this.localData.url = url;
    };
    input.click();
  }


}
