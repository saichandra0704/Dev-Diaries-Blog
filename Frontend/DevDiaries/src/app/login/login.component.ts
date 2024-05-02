import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  hide = true;
  currentUser!: string | null;

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router,private authService: AuthService, private Navbar: AppComponent) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: response => {
        console.log("Logged in successfully");
        this.currentUser = this.authService.getCurrentUser(); 
        this.Navbar.updateuser();
        this.router.navigate(['/dashboard']);
      },
        error: error => {
          console.error('Login error', error);
          this.snackBar.open('Failed to login', 'Close', {
            duration: 3000
          });
        }
      });
  }
}
