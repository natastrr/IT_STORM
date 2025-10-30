import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../../../../assets/styles/_auth.scss']
})
export class SignupComponent implements OnInit {

  showPassword: boolean = false;
  signupForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]+(\s[А-ЯЁ][а-яё]+)*$/)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]],
    agreement: [false, Validators.requiredTrue],
  });

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {}

  isError(field: AbstractControl | null): boolean {
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

  signup(): void {
    if (!this.signupForm.valid) return;
    const {name, email, password} = this.signupForm.value;

    this.authService.signup(name, email, password).subscribe({
      next: (data: LoginResponseType | DefaultResponseType): void => {
        try {
          this.authService.authSuccess(data, 'Вы успешно зарегистировались!');
        } catch (e) {
          console.error(e);
        }
      },
      error: (errorResponse: HttpErrorResponse): void => {
        this.authService.authError(errorResponse, 'Ошибка регистрации!');
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get name(): AbstractControl | null {
    return this.signupForm.get('name');
  }

  get email(): AbstractControl | null {
    return this.signupForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.signupForm.get('password');
  }

}
