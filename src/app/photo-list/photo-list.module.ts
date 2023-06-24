import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PhotoListComponent } from './photo-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PhotoListComponent
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    SharedModule
  ],
  exports: [
    PhotoListComponent
  ]
})
export class PhotoListModule { }
