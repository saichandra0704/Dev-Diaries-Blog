import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service'; // Ensure the path is correct
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  verifyIdentityForm: FormGroup;
  resetPasswordForm: FormGroup;
  isIdentityVerified = false;
  securityQuestions = [
    {value: 'mother_maiden_name', viewValue: 'What is your mother\'s maiden name?'},
    { value: 'pet', viewValue: 'What is the name of your first pet?' },
    { value: 'school', viewValue: 'What was the name of your elementary school?' },
    { value: 'city', viewValue: 'In what city were you born?' }
  ];
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.verifyIdentityForm = this.fb.group({
      username: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required]
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  verifyIdentity() {
    const { username, securityQuestion, securityAnswer } = this.verifyIdentityForm.value;
    this.authService.verifySecurityQuestion(username, securityQuestion, securityAnswer).subscribe({
      next: () => {
        this.isIdentityVerified = true;
        this.snackBar.open('Identity Verified', 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Verification Failed', 'OK', { duration: 3000 });
      }
    });
  }

  resetPassword() {
    if (this.resetPasswordForm.value.newPassword !== this.resetPasswordForm.value.confirmPassword) {
      this.snackBar.open('Passwords do not match', 'OK', { duration: 3000 });
      return;
    }
    const { username } = this.verifyIdentityForm.value;
    const { newPassword } = this.resetPasswordForm.value;
    this.authService.resetPassword(username, newPassword).subscribe({
      next: () => {
        this.snackBar.open('Password Reset Successfully', 'OK', { duration: 3000 });
        localStorage.removeItem('userToken');
        this.router.navigate(['/login']);

      },
      error: () => {
        this.snackBar.open('Password Reset Failed', 'OK', { duration: 3000 });
      }
    });
  }
}

