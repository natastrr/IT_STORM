import {Component, EventEmitter, Output} from '@angular/core';
import {PopupType} from "../../../../../types/popup-type";
import {PopupComponent} from "../../popup/popup.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @Output() logoClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() scrollTo: EventEmitter<string> = new EventEmitter<string>();

  popupType: typeof PopupType = PopupType;

  constructor(public matDialog: MatDialog) {}

  openPopup(popupType: PopupType, name?: string): void {
    this.matDialog.open(PopupComponent, {
      autoFocus: false,
      data: {popupType, name},
    });
  }

  onScroll(sectionId: string): void {
    this.scrollTo.emit(sectionId);
  }
}
