import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  securityQuestions!: { value: string; viewValue: string; }[];

  constructor(private authService: AuthService, private fb: FormBuilder,private snackBar: MatSnackBar,private router: Router) {}

  ngOnInit(): void {
    this.securityQuestions =[
      {value: 'mother_maiden_name', viewValue: 'What is your mother\'s maiden name?'},
    { value: 'pet', viewValue: 'What is the name of your first pet?' },
    { value: 'school', viewValue: 'What was the name of your elementary school?' },
    { value: 'city', viewValue: 'In what city were you born?' }
    ];
    this.initializeForm();
    this.loadUserProfile();
  }
  initializeForm(): void {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      password: ['', Validators.required],
      security_question: ['', Validators.required],
      security_answer: ['', Validators.required]
    });
  }
  
  loadUserProfile(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.authService.getProfile(username).subscribe(data => {
        this.profileForm.patchValue({
          username: data.username,
          security_question: data.security_question,
          security_answer: data.security_answer
        });
      });
    }
  }
  onSave(): void {
    if (this.profileForm.valid) {
      this.authService.updateProfile(this.profileForm.getRawValue()).subscribe({
        next: () =>{    this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 }),
        this.router.navigate(['/dashboard'])},
        error: (err) => console.error('Error updating profile:', err)
      });
    }
  }
}
