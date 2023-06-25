import { Component, Output, EventEmitter, Input } from '@angular/core';
import { IUser } from '../interfaces';
import { MatDialog } from '@angular/material/dialog';
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

  fontsets = ['material-icons-outlined','material-icons']
  bookmark_icons = ['bookmark_outline','bookmark']

  fontsetIndex(control : string) : number {
    if (this.newPostOpened)
      return 0;
    return control === this.state ? 1 : 0;
  }

  @Input() state !: string;
  @Input() user ?: IUser;
  @Output() controlClicked = new EventEmitter<string>();

  newPostOpened = false;

  homeControl() {
    this.controlClicked.emit('home');
  }
  savedControl() {
    this.controlClicked.emit('saved');
  }
  postControl() {
    this.gs.newPhoto(this.user!.id).subscribe(p => {
      this.newPostOpened = true;
      this.dialog.open(PhotoDetailsComponent, {
        data: {
          photo: p,
          createMode: true
        }
      }).afterClosed().subscribe(_ => this.newPostOpened = false)
    })
  }
  userControl() {
    this.controlClicked.emit('user');
  }
}