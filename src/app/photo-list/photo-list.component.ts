import { Component, HostListener, OnInit, Input } from '@angular/core';
import { IPhoto } from '../interfaces';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css']
})
export class PhotoListComponent {
  constructor(
    private cs:ContentService
  ){}
  
  @Input() photos !: IPhoto[];
  maxDisplayed: number = 70;

  displayedPhoto ?: IPhoto;

  // ngOnInit(): void {
  //   this.cs.getAllPhotos().subscribe(photos => this.photos = photos);
  // }

  onScroll(): void {
    this.maxDisplayed += 70;
  }

}
