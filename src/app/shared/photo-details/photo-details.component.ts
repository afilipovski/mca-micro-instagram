import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
  
  photo ?: IPhoto;

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
      createMode ?: boolean
    }
  ) {}

  ngOnInit(): void {
    this.photo = this.data.photo;
    this.editMode = this.data.createMode ?? false;
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
      // this.cs.getAllPhotos().subscribe(ps => {
      //   this.cs.setPhotos(ps.filter(pi => pi.id != this.photo?.id));
      // })
      this.dialogRef.close();
    })
  }

  updateChanges() {
    this.album.id = this.photo!.albumId = this.localData.albumId;
    this.album.title = this.localData.albumTitle;
    this.photo!.id = this.localData.photoId;
    this.photo!.title = this.localData.photoTitle;
    this.photo!.url = this.photo!.thumbnailUrl = this.localData.url;
    this.user.username = this.localData.username;
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.updateChanges();
      if (!this.data.createMode)
        this.cs.updatePhoto(this.photo!,this.localData.albumTitle);
    }
    if (this.data.createMode && this.photo!.url) {
      this.data.createMode = false;
      this.cs.uploadPhoto(this.photo!).subscribe(_ => {
        this.localData.photoId = this.photo!.id;
        this.localData.albumId = this.album!.id;
        // this.cs.setPhotos([this.photo!].concat(this.cs.photos));
      });
    }
  }

  onImageClick() {
    if (!this.data.createMode)
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
