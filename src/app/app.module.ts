import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

import { HttpClientModule } from '@angular/common/http'


import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component'
import { FormsModule } from '@angular/forms';
import { StoriesComponent } from './stories/stories.component';

import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import { PhotoListModule } from './photo-list/photo-list.module';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    DeleteDialogComponent,
    StoriesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    PhotoListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
