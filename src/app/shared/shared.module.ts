import { NgModule } from '@angular/core';

import { ProfilePictureComponent } from './profile-picture/profile-picture.component';
import { PhotoDetailsComponent } from '../photo-details/photo-details.component';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    ProfilePictureComponent,
    PhotoDetailsComponent
  ],
  exports: [
    ProfilePictureComponent,
    PhotoDetailsComponent
  ]
})
export class SharedModule { }
