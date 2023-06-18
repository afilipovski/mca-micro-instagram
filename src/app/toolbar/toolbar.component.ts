import { Component, Output, EventEmitter, Input } from '@angular/core';
import { IUser } from '../interfaces';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  getFontSet(control : string) {
    return control === this.state ? "material-icons" : "material-icons-outlined";
  }

  @Input() state !: string;
  @Input() user ?: IUser;
  @Output() controlClicked = new EventEmitter<string>();
  @Output() newPost = new EventEmitter<string>();

  homeControl() {
    window.scrollTo(0,0);
    this.controlClicked.emit('home');
  }
  savedControl() {
    this.controlClicked.emit('saved');
  }
  postControl() {
    this.controlClicked.emit('post');
  }
  userControl() {
    this.controlClicked.emit('user');
  }
}