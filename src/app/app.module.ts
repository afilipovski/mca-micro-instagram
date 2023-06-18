import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { PhotoListComponent } from './photo-list/photo-list.component';

import { HttpClientModule } from '@angular/common/http'

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';
import { MatIconModule } from '@angular/material/icon';
import { ProfilePictureComponent } from './profile-picture/profile-picture.component'

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    PhotoListComponent,
    PhotoDetailsComponent,
    ProfilePictureComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    InfiniteScrollModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
