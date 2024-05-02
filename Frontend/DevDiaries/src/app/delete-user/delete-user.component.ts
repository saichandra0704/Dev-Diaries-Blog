import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css'
})
export class DeleteUserComponent {
  promoteForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient,private snackBar: MatSnackBar, private router: Router, private authservice: AuthService) {}

  ngOnInit(): void {
    this.promoteForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.promoteForm.valid) {
      this.authservice.deleteUser(this.promoteForm.value).subscribe({
        next: response => {this.snackBar.open('User deleted successfully','Close', { duration: 3000 }),
        this.router.navigate(['/dashboard'])},
        error: error => alert('Failed to promote user!')
      });
    }
  }
}
