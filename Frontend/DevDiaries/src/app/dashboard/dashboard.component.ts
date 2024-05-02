import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service'; // Adjust the path as necessary
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  posts: any[] = [];
  currentUser: any;

  constructor(private authService: AuthService, public dialog: MatDialog,private snackBar: MatSnackBar, private router: Router) {}
  role = localStorage.getItem('role')
  ngOnInit(): void {
    this.authService.getAllPosts().subscribe(posts => this.posts = posts);
    this.currentUser = this.authService.getCurrentUser();
  }
  navigateToEdit(postId: number): void {
    this.router.navigate(['/edit-post', postId]);
  }

  deletePost(postId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.deletePost(postId).subscribe({
          next: () => {
            console.log('Post deleted successfully');
            this.snackBar.open('Post deleted successfully','Close', { duration: 3000 });
            this.posts = this.posts.filter(post => post.id !== postId); // Update UI
          },
          error: (error) => {
            console.error('Failed to delete the post', error);
          }
        });
      }
    });
}
}
