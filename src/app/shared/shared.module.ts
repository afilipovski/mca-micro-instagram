import { NgModule } from '@angular/core';

import { ProfilePictureComponent } from './profile-picture/profile-picture.component';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PhotoDetailsComponent } from './photo-details/photo-details.component';
import { DeleteDialogComponent } from './photo-details/delete-dialog/delete-dialog.component';

@NgModule({
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    ProfilePictureComponent,
    PhotoDetailsComponent,
    DeleteDialogComponent
  ],
  exports: [
    ProfilePictureComponent,
    PhotoDetailsComponent
  ]
})
export class SharedModule { }
