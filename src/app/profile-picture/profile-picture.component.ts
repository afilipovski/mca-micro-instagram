import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.css']
})
export class ProfilePictureComponent implements OnChanges {
  @Input({ required: true }) name !: string;
  @Input() size : number = 32;

  style : any;

  hashName(name : string) : string {
    let res = 0;
    for (let index = 0; index < name.length; index++) {
      const element = name.charCodeAt(index);
      res = (255*res + element) % 30031;
    }
    return `rgb(${res%50+206},${res%150+106},${res%250+6})`;
  }
  ngOnChanges() {
    this.style = { 
      'background-color': this.hashName(this.name) ,
      'height': `${this.size}px`,
      'width': `${this.size}px`,
      'font-size': `${this.size * 0.4}px`
    }
  }
}
