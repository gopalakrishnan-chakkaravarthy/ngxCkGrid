import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NGXCkGridComponent } from './ck-grid.component';
import { NGXCkGridContextMenuComponent } from './ck-grid-context-menu/ck-grid-context-menu.component';
import { NGXCkGridModalComponent } from './ck-grid-modal/ck-grid-modal.component';
import { NGXCKFilterPipe } from './filters/ngxck-filter.pipe';
@NgModule({
  declarations: [
    NGXCKFilterPipe,
    NGXCkGridComponent,
    NGXCkGridContextMenuComponent,
    NGXCkGridModalComponent,
  ],
  imports: [BrowserModule, CommonModule, FormsModule],
  exports: [NGXCkGridComponent, NGXCkGridModalComponent, NGXCKFilterPipe],
})
export class NGXCkGridModule {}
