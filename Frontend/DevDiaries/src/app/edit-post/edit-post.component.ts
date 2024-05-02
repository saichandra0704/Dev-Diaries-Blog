import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']  // Reusing create post styles
})
export class EditPostComponent implements OnInit {
  post: any = { title: '', content: '' };

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.authService.getPost(postId).subscribe({
        next: (data) => this.post = data,
        error: (error) => console.error('Error fetching post', error)
      });
    } }
  updatePost(): void {
    this.authService.updatePost(this.post.id, this.post).subscribe({
      next: () => {this.snackBar.open('Post Updated Successfully', 'OK', { duration: 3000 }),
      localStorage.removeItem('userToken'),
      this.router.navigate(['/dashboard'])},
      error: (error) => console.error('Failed to update post', error)
    });
  }

  getWordCount(): number {
    return this.post.content ? this.post.content.trim().split(/\s+/).length : 0;
  }
}
