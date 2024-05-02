import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service'; // Ensure correct path
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  title: string = '';
  content: string = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  getWordCount(): number {
    return this.content ? this.content.trim().split(/\s+/).length : 0;
  }

  submitPost(): void {
    if (this.title && this.content) {
      this.authService.createPost(this.title, this.content,localStorage.getItem('username')).subscribe({
        next: (response: any) => {
          this.snackBar.open('Post successfully created!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard'])
        },
        error: (error: any) => {
          console.error('Error creating post', error);
          this.snackBar.open('Failed to create post. Try again.', 'Close', { duration: 3000 });
        }
      });
    } else {
      console.error('Title and content are required');
      this.snackBar.open('Please enter both title and content.', 'Close', { duration: 3000 });
    }
  }
}
