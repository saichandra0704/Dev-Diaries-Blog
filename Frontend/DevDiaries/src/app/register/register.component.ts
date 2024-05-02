import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hide = true;
  securityQuestions = [
    {value: 'mother_maiden_name', viewValue: 'What is your mother\'s maiden name?'},
    { value: 'pet', viewValue: 'What is the name of your first pet?' },
    { value: 'school', viewValue: 'What was the name of your elementary school?' },
    { value: 'city', viewValue: 'In what city were you born?' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient,    private snackBar: MatSnackBar,    private router: Router) {
    this.registerForm = this.fb.group({
      username: '',
      password: '',
      security_question: '',
      security_answer: ''
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.http.post('http://localhost:5000/api/register', this.registerForm.value)
        .subscribe({
          next: (response) => {
            this.snackBar.open('Registration successful redirecting to login page', 'Close', {
              duration: 3000
            });
            this.router.navigate(['/login']);},
          error: (error) => {
            console.error('Error during registration', error);
            this.snackBar.open('User already exists!', 'Close', {
              duration: 3000
            });
          }
        });
    } else {
      console.error('Form is not valid');
      this.snackBar.open('Invalid form data', 'Close', {
        duration: 3000
      });
    }
  }
}

