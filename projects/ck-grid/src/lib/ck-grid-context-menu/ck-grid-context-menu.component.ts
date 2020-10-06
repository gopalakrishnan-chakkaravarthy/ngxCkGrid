import { EventEmitter, Input, Output } from '@angular/core';
import { Component } from '@angular/core';
import { ContextMenuItems } from '../../public-api';
@Component({
  selector: 'app-ck-grid-context-menu',
  templateUrl: './ck-grid-context-menu.component.html',
  styleUrls: ['./ck-grid-context-menu.component.scss'],
})
export class NGXCkGridContextMenuComponent {
  @Input() x: any;
  @Input() y: any;
  @Input() contextMenuItems: ContextMenuItems[] = [];
  @Output() contextMenuClick = new EventEmitter<any>();
  contextMenuItemsClick($event) {
    this.contextMenuClick.emit($event);
  }
}
