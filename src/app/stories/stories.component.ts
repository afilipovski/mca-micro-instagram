import { Component, OnInit } from '@angular/core';
import { ContentService } from '../content.service';
import { IUser } from '../interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {
  constructor(
    private cs : ContentService  
  ) {}

  users$ : Observable<IUser[]> = this.cs.getAllUsers();

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
