import {Component, OnDestroy, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from "../../../../core/auth/auth.service";
import {Subscription} from "rxjs";
import {UserService} from "../../../services/user.service";
import {UserInfoType} from "../../../../../types/user-info.type";
import {DefaultResponseType} from "../../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {PopupType} from "../../../../../types/popup-type";
import {PopupComponent} from "../../popup/popup.component";


@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() logoClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() scrollTo: EventEmitter<string> = new EventEmitter<string>();
  isLoggedIn: boolean = false;
  private isLoggedInSubscription: Subscription | undefined;
  userInfo: UserInfoType | null = null;

  constructor(private authService: AuthService,
              private userService: UserService,
              public matDialog: MatDialog) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    if (this.isLoggedIn) this.loadUserInfo();

    this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe((status: boolean): void => {
        this.isLoggedIn = status;
        status ? this.loadUserInfo() : this.userInfo = null;
      }
    );
  }

  private loadUserInfo(): void {
    this.userService.getUserInfo().subscribe({
      next: (userData: UserInfoType | DefaultResponseType): void => {
        if ((userData as DefaultResponseType).error) {
          throw new Error((userData as DefaultResponseType).message);
        } else {
          this.userInfo = userData as UserInfoType;
        }
      },
      error: (errorResponse: HttpErrorResponse): void => {
        console.log(errorResponse.error.message);
      }
    });
  }

  ngOnDestroy(): void {
    this.isLoggedInSubscription?.unsubscribe();
  }

  openPopup(popupType: PopupType): void {
    this.matDialog.open(PopupComponent, {
      autoFocus: false,
      data: {popupType},
    });
  }

  onScroll(sectionId: string): void {
    this.scrollTo.emit(sectionId);
  }

  protected readonly popupType: typeof PopupType = PopupType;
}
