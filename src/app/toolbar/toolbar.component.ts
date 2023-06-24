import { Component, Output, EventEmitter, Input } from '@angular/core';
import { IUser } from '../interfaces';
import { MatDialog } from '@angular/material/dialog';
import { PhotoListComponent } from '../photo-list/photo-list.component';
import { GenerationService } from '../generation.service';
import { PhotoDetailsComponent } from '../shared/photo-details/photo-details.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  constructor(
    private dialog : MatDialog,
    private gs : GenerationService
  ) {}

  getFontSet(control : string) {
    return control === this.state ? "material-icons" : "material-icons-outlined";
  }

  @Input() state !: string;
  @Input() user ?: IUser;
  @Input() newPostOpened !: boolean;

  @Output() controlClicked = new EventEmitter<string>();

  homeControl() {
    window.scrollTo(0,0);
    this.controlClicked.emit('home');
  }
  savedControl() {
    this.controlClicked.emit('saved');
  }
  postControl() {
    this.controlClicked.emit('post');
    this.gs.newPhoto(this.user!.id).subscribe(p => {
      this.dialog.open(PhotoDetailsComponent, {
        data: {
          photo: p,
          createMode: true
        }
      })
    })
  }
  userControl() {
    this.controlClicked.emit('user');
  }
}