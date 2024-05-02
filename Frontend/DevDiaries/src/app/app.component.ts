import { Component } from '@angular/core';
import { AuthService } from './service/auth.service'; // Make sure the path is correct

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn$ = this.authService.isLoggedIn;
  public role = localStorage.getItem('role');
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
  }
  logout() {
    this.authService.logout();
    this.role = localStorage.getItem('role');
  }
  updateuser(){
    this.role = localStorage.getItem('role');
  }
}
