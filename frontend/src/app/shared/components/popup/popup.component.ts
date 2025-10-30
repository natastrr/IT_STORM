import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PopupType} from "../../../../types/popup-type";
import {AuthService} from "../../../core/auth/auth.service";
import {finalize} from "rxjs";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {CategoryType} from "../../../../types/category.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'popup-component',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})

export class PopupComponent implements OnInit {

  selectedService: CategoryType | null = null;
  isDropdownOpen: boolean = false;
  popupType: typeof PopupType = PopupType;
  categories: CategoryType[] = [];
  popupForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]+(\s[А-ЯЁ][а-яё]+)*$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)]],
  });

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private http: HttpClient,
              private dialogRef: MatDialogRef<PopupComponent>
  ) {}

  ngOnInit(): void {
    if (this.data.popupType === this.popupType.requestForService) {
      this.popupForm.addControl('service', this.fb.control('', Validators.required));
      this.http.get<CategoryType[] | DefaultResponseType>(environment.api + 'categories').subscribe({
        next: (categoriesData: CategoryType[] | DefaultResponseType): void => {
          if ((categoriesData as DefaultResponseType).error) {
            throw new Error;
          }
          this.categories = categoriesData as CategoryType[];
        },
        error: (errorResponse: HttpErrorResponse): void => {
          console.log(errorResponse.error.message);
          this.router.navigate(['/']).then((): void => {
            this._snackBar.open('Ошибка при загрузке категорий.')
          });
        }
      });
    }
  }

  userRequest(): void {
    const payload: {name: string, phone: string, type: string, service?: string} = {
      name: this.popupForm.value.name,
      phone: this.popupForm.value.phone,
      type: "consultation",
    };
    if (this.data.popupType === this.popupType.requestForService) {
      payload.service = this.popupForm.value.service;
      payload.type = "order";
    }
    this.http.post<DefaultResponseType>(environment.api + 'requests', payload).subscribe({
      next: (response: DefaultResponseType): void => {
        this.popupForm.reset();
        if (response.error) {
          this.dialogRef.close();
          this._snackBar.open(response.message);
          return;
        }
        this.data.popupType = this.popupType.confirmation;
      },
      error: (errorResponse: HttpErrorResponse): void => {
        this.dialogRef.close();
        console.error(errorResponse.error);
        this._snackBar.open('Ошибка при отправке запроса.\nПопробуйте снова!', undefined , {panelClass: ['multi-line-snackbar']});
      }
    });
  }

  isError(field: AbstractControl | null): boolean {
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (!this.isDropdownOpen && !this.selectedService) {
      const control: AbstractControl | null = this.popupForm.get('service');
      if (control && !control.touched) control.markAsTouched();
    }
  }

  selectService(category: CategoryType): void {
    this.selectedService = category;
    this.popupForm.get('service')?.setValue(category.name);
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      if (this.isDropdownOpen) {
        this.isDropdownOpen = false;
        const control: AbstractControl | null = this.popupForm.get('service');
        if (!this.selectedService && control && !control.touched) control.markAsTouched();
      }
    }
  }

  isCustomSelectError(): boolean {
    const control: AbstractControl | null = this.popupForm.get('service');
    return !!(control?.invalid && (control.touched && this.selectedService === null));
  }

  get name(): AbstractControl | null {
    return this.popupForm.get('name');
  }

  get phone(): AbstractControl | null {
    return this.popupForm.get('phone');
  }

  get service(): AbstractControl | null {
    return this.popupForm.get('service');
  }

  logout(): void {
    this.authService.logout()
      .pipe(
        finalize((): void => {
          this.authService.removeTokens();
          this.authService.userId = null;
          this.dialogRef.close();
          this._snackBar.open('Вы вышли из системы!');
          this.router.navigate(['/']).then();
        })
      )
      .subscribe({
        next: (): void => {},
        error: (errorResponse: HttpErrorResponse): void => {
          console.log(errorResponse.error.message);
        }
      });
  }
}
