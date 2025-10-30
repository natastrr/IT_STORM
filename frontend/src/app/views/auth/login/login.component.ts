import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../../assets/styles/_auth.scss']
})
export class LoginComponent {

  showPassword: boolean = false;
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    )]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  constructor(private fb: FormBuilder, private authService: AuthService) {
  }

  login(): void {
    if (!this.loginForm.valid) return; const {email, password, rememberMe} = this.loginForm.value;

    this.authService.login(email, password, rememberMe).subscribe({
      next: (data: LoginResponseType | DefaultResponseType): void => {
        try {
          this.authService.authSuccess(data, 'Вы успешно авторизовались!');
        } catch (e) {
          console.error(e);
        }
      },
      error: (errorResponse: HttpErrorResponse): void => {
        this.authService.authError(errorResponse, 'Ошибка авторизации!');
      }
    });
  }

  isError(field: AbstractControl | null): boolean {
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

}
