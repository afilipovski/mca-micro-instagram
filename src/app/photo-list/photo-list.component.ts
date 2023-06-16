import { Component, HostListener, OnInit } from '@angular/core';
import { IPhoto } from '../interfaces';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css']
})
export class PhotoListComponent implements OnInit {
  constructor(
    private cs:ContentService
  ){}
  
  photos: IPhoto[] = [];
  maxDisplayed: number = 70;
  details: boolean = false;

  ngOnInit(): void {
    this.cs.getAllPhotos().subscribe(photos => this.photos = photos);
  }

  onScroll(): void {
    this.maxDisplayed += 70;
  }

}
